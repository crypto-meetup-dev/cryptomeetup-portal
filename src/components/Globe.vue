<template>
  <div ref="container" class="globe-container"></div>
</template>

<script>
import * as THREE from 'three';
import * as geoJsonUtil from '@/util/geoJsonUtil';
import throttle from 'lodash.throttle';

const EARTH_RADIUS = 200;

const Shaders = {
  earth: {
    uniforms: {
      texture: { type: 't', value: null },
    },
    vertexShader: [
      'varying vec3 vNormal;',
      'varying vec2 vUv;',
      'void main() {',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      'vNormal = normalize( normalMatrix * normal );',
      'vUv = uv;',
      '}',
    ].join('\n'),
    fragmentShader: [
      'uniform sampler2D texture;',
      'varying vec3 vNormal;',
      'varying vec2 vUv;',
      'void main() {',
      'vec3 diffuse = texture2D( texture, vUv ).xyz;',
      'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
      'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
      'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
      '}',
    ].join('\n'),
  },
  atmosphere: {
    uniforms: {},
    vertexShader: [
      'varying vec3 vNormal;',
      'void main() {',
      'vNormal = normalize( normalMatrix * normal );',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}',
    ].join('\n'),
    fragmentShader: [
      'varying vec3 vNormal;',
      'void main() {',
      'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
      'gl_FragColor = vec4( 0, 0.666, 1.0, 1.0 ) * intensity;',
      '}',
    ].join('\n'),
  },
};

const PI_HALF = Math.PI / 2;

class GlobeRenderer {
  constructor(container) {
    this.container = container;
    this.running = true;
    this.distance = 100000;
    this.distanceTarget = 100000;
    this.isDragging = false;
    this.mouse = { x: 0, y: 0 };
    this.mouseOnDown = { x: 0, y: 0 };
    this.rotation = { x: 0, y: 0 };
    this.target = { x: Math.PI * 3 / 2, y: Math.PI / 6.0 };
    this.targetOnDown = { x: 0, y: 0 };
    this.curZoomSpeed = 0;
    this.overRenderer = true;
    this.currentCountryCode = null;

    this._animate = this.animate.bind(this);
    this._onMouseDown = this.onMouseDown.bind(this);
    this._onMouseUp = this.onMouseUp.bind(this);
    this._onMouseMove = this.onMouseMove.bind(this);
    // this._onMouseOut = this.onMouseOut.bind(this);
    this._onMouseWheel = this.onMouseWheel.bind(this);
    // this._onDocumentKeyDown = this.onDocumentKeyDown.bind(this);

    this.updateHoverCountryThrottled = throttle(this.updateHoverCountry, 100);

    this.init();

    setTimeout(() => this.animate(), 2000);
  }

  init() {
    this.w = this.container.offsetWidth || window.innerWidth;
    this.h = this.container.offsetHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(30, this.w / this.h, 1, 10000);
    this.camera.position.z = this.distance;

    this.scene = new THREE.Scene();

    // Star Field
    {
      const geometry = new THREE.SphereGeometry(1000, 32, 32);
      const material = new THREE.MeshBasicMaterial();
      material.map = THREE.ImageUtils.loadTexture('/starfield.png');
      material.side = THREE.BackSide;
      // create the mesh based on geometry and material
      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
    }

    const geometry = new THREE.SphereGeometry(EARTH_RADIUS, 40, 30);

    // Earth
    {
      const shader = Shaders.earth;
      const uniforms = THREE.UniformsUtils.clone(shader.uniforms);
      uniforms.texture.value = THREE.ImageUtils.loadTexture('/earth.jpg');

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
      });
      // const material = new THREE.MeshNormalMaterial({
      //   wireframe: true,
      //   opacity: 0.1,
      //   transparent: true,
      // });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.y = Math.PI;

      this.scene.add(mesh);
      this.earthMesh = mesh;
    }

    // Atomosphere
    {
      const shader = Shaders.atmosphere;
      const uniforms = THREE.UniformsUtils.clone(shader.uniforms);
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(1.1, 1.1, 1.1);
      this.scene.add(mesh);
    }

    this.raycaster = new THREE.Raycaster();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.w, this.h);
    this.container.appendChild(this.renderer.domElement);
    this.container.addEventListener('mousedown', this._onMouseDown, false);
    this.container.addEventListener('mousewheel', this._onMouseWheel, false);
    this.container.addEventListener('mousemove', this._onMouseMove, false);
    // document.addEventListener('keydown', this._onDocumentKeyDown, false);
  }

  updateHoverCountry(mouseX, mouseY) {
    // First, get a sphere position by raycasting.
    const mousePosition = this.getMousePositionInContainer(this.container, mouseX, mouseY);
    const mouseVec = new THREE.Vector2(mousePosition[0] * 2 - 1, - (mousePosition[1] * 2 - 1));
    this.raycaster.setFromCamera(mouseVec, this.camera);
    const intersects = this.raycaster.intersectObject(this.earthMesh);
    if (intersects.length > 0) {
      // Second, we convert sphere position to lat lng.
      const spherePosition = intersects[0].point;
      const lat = 90 - (Math.acos(spherePosition.y / EARTH_RADIUS)) * 180 / Math.PI;
      const lon = ((270 + (Math.atan2(spherePosition.x , spherePosition.z)) * 180 / Math.PI) % 360) -180;
      // Third, we calculate hit country from lat lng.
      const hoverCountryCode = geoJsonUtil.getCountryFromLatLng(lat, lon);
      this.setHoverCountryGeometry(hoverCountryCode);
      // Finally, we update highlight target.
    }
  }

  setHoverCountryGeometry(hoverCountryCodeOrNull) {
    if (this.currentCountryCode === hoverCountryCodeOrNull) {
      return;
    }
    console.log(hoverCountryCodeOrNull);
    if (this.hoverCountryMesh) {
      this.scene.remove(this.hoverCountryMesh);
      this.hoverCountryMesh = null;
    }
    if (hoverCountryCodeOrNull !== null) {
      const geoJsonCountries = geoJsonUtil.getGeoJsonCountries();
      const material = new THREE.LineBasicMaterial({color: 0xffffff});
      const lines = geoJsonUtil.buildLinesFromGeoJson(geoJsonCountries[hoverCountryCodeOrNull], EARTH_RADIUS, material);
      const mesh = new THREE.Object3D();
      lines.forEach(line => mesh.add(line));
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.y = 0;
      mesh.rotation.z = -Math.PI;
      this.scene.add(mesh);
      this.hoverCountryMesh = mesh;
    }
    this.currentCountryCode = hoverCountryCodeOrNull;
  }

  animate() {
    if (!this.running) {
      return;
    }
    requestAnimationFrame(this._animate);
    this.render();
  }

  render() {
    this.zoom(this.curZoomSpeed);

    this.rotation.x += (this.target.x - this.rotation.x) * 0.1;
    this.rotation.y += (this.target.y - this.rotation.y) * 0.1;
    this.distance += (this.distanceTarget - this.distance) * 0.3;

    this.camera.position.x = this.distance * Math.sin(this.rotation.x) * Math.cos(this.rotation.y);
    this.camera.position.y = this.distance * Math.sin(this.rotation.y);
    this.camera.position.z = this.distance * Math.cos(this.rotation.x) * Math.cos(this.rotation.y);

    this.camera.lookAt(this.earthMesh.position);

    this.renderer.render(this.scene, this.camera);
  }

  zoom(delta) {
    this.distanceTarget -= delta;
    this.distanceTarget = this.distanceTarget > 1000 ? 1000 : this.distanceTarget;
    this.distanceTarget = this.distanceTarget < 350 ? 350 : this.distanceTarget;
  }

  stopRunning() {
    console.log('Globe stopped');
    this.running = false;
    this.unregisterMouseListener();
  }

  onMouseDown(event) {
    console.log('onMouseDown');
    event.preventDefault();
    this.isDragging = true;
    this.container.addEventListener('mouseup', this._onMouseUp, false);
    // this.container.addEventListener('mouseout', this._onMouseOut, false);
    this.mouseOnDown.x = -event.clientX;
    this.mouseOnDown.y = event.clientY;
    this.targetOnDown.x = this.target.x;
    this.targetOnDown.y = this.target.y;
    this.container.style.cursor = 'move';
  }

  getMousePositionInContainer(container, x, y) {
    const rect = container.getBoundingClientRect();
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];
  }

  onMouseMove(event) {
    this.mouse.x = -event.clientX;
    this.mouse.y = event.clientY;

    if (this.isDragging) {
      // If mouse button is down, we update viewport.
      const zoomDamp = this.distance / 1000;

      this.target.x = this.targetOnDown.x + (this.mouse.x - this.mouseOnDown.x) * 0.005 * zoomDamp;
      this.target.y = this.targetOnDown.y + (this.mouse.y - this.mouseOnDown.y) * 0.005 * zoomDamp;

      this.target.y = this.target.y > PI_HALF ? PI_HALF : this.target.y;
      this.target.y = this.target.y < -PI_HALF ? -PI_HALF : this.target.y;
    } else {
      // If mouse button is not down, we highlight country pointing to.
      this.updateHoverCountryThrottled(event.clientX, event.clientY);
    }
  }

  onMouseUp() {
    this.unregisterMouseListener();
    this.container.style.cursor = 'auto';
    this.isDragging = false;
  }

  onMouseWheel(event) {
    //    console.log(event);
    event.preventDefault();
    if (this.overRenderer) {
      this.zoom(event.wheelDeltaY * 0.3);
    }
    return false;
  }

  // onMouseOut() {
  //   this.unregisterMouseListener();
  // }

  // onDocumentKeyDown(event) {
  //   switch (event.keyCode) {
  //     case 38:
  //       this.zoom(100);
  //       event.preventDefault();
  //       break;
  //     case 40:
  //       this.zoom(-100);
  //       event.preventDefault();
  //       break;
  //   }
  // }

  unregisterMouseListener() {
    // this.container.removeEventListener('mousemove', this._onMouseMove, false);
    this.container.removeEventListener('mouseup', this._onMouseUp, false);
    // this.container.removeEventListener('mouseout', this._onMouseOut, false);
  }
}

export default {
  name: 'Globe',
  data: () => ({
    globeRenderer: null,
  }),
  mounted() {
    this.globeRenderer = new GlobeRenderer(this.$refs.container);
  },
  beforeDestroy() {
    this.globeRenderer.stopRunning();
  },
};
</script>

<style lang="stylus" scoped>
.globe-container
  position: absolute
  width: 100vw
  height: 100vh
  top: 0
  left: 0

  canvas
    position: absolute
    left: 0
    top: 0
</style>
