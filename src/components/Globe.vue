<template>
  <div ref="container" class="globe-container"></div>
</template>

<script>
import * as THREE from 'three';
import * as geoJsonUtil from '@/util/geoJsonUtil';
import throttle from 'lodash-decorators/throttle';
import { autobind } from 'core-decorators';

const PI_HALF = Math.PI / 2;
const PI_DOUBLE = Math.PI * 2;
const EARTH_RADIUS = 200;

const HOVER_COUNTRY_COLOR = 0xffffff;
const FOCUS_COUNTRY_COLOR = 0xffd345;

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
    this.hoverCountryCode = null;
    this.focusCountryCode = null;

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

    // Cloud
    {
      const cloudGeometry = new THREE.SphereGeometry(EARTH_RADIUS + 2, 40, 32);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        alphaMap: THREE.ImageUtils.loadTexture('/weather.jpg'),
        side: THREE.DoubleSide,
        opacity: 0.8,
        transparent: true,
      });
      const mesh = new THREE.Mesh(cloudGeometry, material);
      mesh.rotation.y = Math.PI;
      this.scene.add(mesh);
      this.cloudMesh = mesh;
    }

    this.raycaster = new THREE.Raycaster();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.w, this.h);
    this.container.appendChild(this.renderer.domElement);
    this.container.addEventListener('mousedown', this.onMouseDown, false);
    this.container.addEventListener('mousewheel', this.onMouseWheel, false);
    this.container.addEventListener('mousemove', this.onMouseMove, false);
    this.container.addEventListener('mouseup', this.onMouseUp, false);
  }

  /**
   * Calculates the coordinates on the earth surface that mouse is hovering.
   */
  calcHoverCoordOnEarth(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const mousePosition = this.getMousePositionInContainer(this.container, mouseX, mouseY);
    const mouseVec = new THREE.Vector2(mousePosition[0] * 2 - 1, -(mousePosition[1] * 2 - 1));
    this.raycaster.setFromCamera(mouseVec, this.camera);
    const intersects = this.raycaster.intersectObject(this.earthMesh);
    if (intersects.length > 0) {
      return intersects[0].point; // returns THREE.Vector3
    }
    return null;
  }

  /**
   * Calculates the rotation radian from earth surface coordinates.
   */
  calcRotationFromEarthCoord(coord) {
    // lat
    const rotateY = Math.PI / 2 - Math.acos(coord.y / EARTH_RADIUS);
    // lon
    const rotateX = ((Math.atan2(coord.x, coord.z) + Math.PI * 1.5) % (Math.PI * 2)) - Math.PI;
    return [rotateX, rotateY];
  }

  /**
   * Gets the country code that mouse is hovering.
   */
  getHoverCountryCode(event) {
    const coord = this.calcHoverCoordOnEarth(event);
    if (coord !== null) {
      const rotateXY = this.calcRotationFromEarthCoord(coord);
      const [lon, lat] = rotateXY.map(v => v * 180 / Math.PI);
      const countryCode = geoJsonUtil.getCountryFromLatLng(lat, lon);
      return countryCode;
    }
    return null;
  }

  /**
   * Updates the geometry of hovering country according to mouse.
   */
  @throttle(100)
  updateHoverCountryByEvent(event) {
    const countryCode = this.getHoverCountryCode(event);
    if (this.hoverCountryCode === countryCode) {
      return;
    }
    if (this.hoverCountryMesh) {
      this.scene.remove(this.hoverCountryMesh);
      this.hoverCountryMesh = null;
    }
    if (countryCode !== null) {
      const geoJsonCountries = geoJsonUtil.getGeoJsonCountries();
      const material = new THREE.LineBasicMaterial({ color: HOVER_COUNTRY_COLOR });
      const lines = geoJsonUtil.buildLinesFromGeoJson(geoJsonCountries[countryCode], EARTH_RADIUS, material);
      const mesh = new THREE.Object3D();
      lines.forEach((line) => {
        line.renderOrder = 1; // over earth
        mesh.add(line);
      });
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.y = 0;
      mesh.rotation.z = -Math.PI;
      this.scene.add(mesh);
      this.hoverCountryMesh = mesh;
    }
    this.hoverCountryCode = countryCode;
  }

  /**
   * Sets the geometry of focus country.
   */
  setFocusCountry(countryCode) {
    if (this.focusCountryCode === countryCode) {
      return;
    }
    if (this.focusCountryMesh) {
      this.scene.remove(this.focusCountryMesh);
      this.focusCountryMesh = null;
    }
    if (countryCode !== null) {
      const geoJsonCountries = geoJsonUtil.getGeoJsonCountries();
      const material = new THREE.LineBasicMaterial({ color: FOCUS_COUNTRY_COLOR });
      const lines = geoJsonUtil.buildLinesFromGeoJson(geoJsonCountries[countryCode], EARTH_RADIUS, material);
      const mesh = new THREE.Object3D();
      lines.forEach((line) => {
        line.renderOrder = 2; // over hover border
        mesh.add(line);
      });
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.y = 0;
      mesh.rotation.z = -Math.PI;
      this.scene.add(mesh);
      this.focusCountryMesh = mesh;
    }
    this.focusCountryCode = countryCode;
  }

  /**
   * Normalize a radian to be in -PI ~ PI
   */
  normalizeRadian(theta) {
    return theta - PI_DOUBLE * Math.floor((theta + Math.PI) / PI_DOUBLE);
  }

  /**
   * Calculates the nearest rotation radian for `newRotate` based on `oldRotate`.
   * The result has the same normalized degree as `newRotate` but value is
   * closest to `oldRotate`.
   */
  calcNearRotation(newRotate, oldRotate) {
    const oldNormalized = this.normalizeRadian(oldRotate);
    let newNormalized = this.normalizeRadian(newRotate);
    if (Math.abs(oldNormalized - newNormalized) > Math.PI) {
      // Choose another rotate side
      if (oldNormalized > newNormalized) {
        newNormalized += PI_DOUBLE;
      } else {
        newNormalized -= PI_DOUBLE;
      }
    }
    const oldOffset = Math.floor((oldRotate + Math.PI) / PI_DOUBLE);
    return newNormalized + oldOffset * PI_DOUBLE;
  }

  @autobind
  animate() {
    if (!this.running) {
      return;
    }
    requestAnimationFrame(this.animate);
    this.render();
  }

  render() {
    this.zoom(this.curZoomSpeed);

    this.cloudMesh.rotation.y += 0.0001;
    this.rotation.x += (this.target.x - this.rotation.x) * 0.1;
    this.rotation.y += (this.target.y - this.rotation.y) * 0.1;
    this.distance += (this.distanceTarget - this.distance) * 0.3;

    // console.log(this.rotation.x, normalizeAngle(this.rotation.x));

    this.camera.position.x = this.distance * Math.sin(this.rotation.x) * Math.cos(this.rotation.y);
    this.camera.position.y = this.distance * Math.sin(this.rotation.y);
    this.camera.position.z = this.distance * Math.cos(this.rotation.x) * Math.cos(this.rotation.y);

    this.camera.lookAt(this.earthMesh.position);

    this.renderer.render(this.scene, this.camera);
  }

  zoom(delta) {
    this.distanceTarget -= delta;
    this.distanceTarget = this.distanceTarget > 1000 ? 1000 : this.distanceTarget;
    this.distanceTarget = this.distanceTarget < 300 ? 300 : this.distanceTarget;
  }

  stopRunning() {
    console.log('Globe stopped');
    this.running = false;
  }

  getMousePositionInContainer(container, x, y) {
    const rect = container.getBoundingClientRect();
    return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
  }

  @autobind
  onMouseDown(event) {
    event.preventDefault();
    this.isDragging = true;
    // this.container.addEventListener('mouseup', this._onMouseUp, false);
    // this.container.addEventListener('mouseout', this._onMouseOut, false);
    this.mouseOnDown.x = -event.clientX;
    this.mouseOnDown.y = event.clientY;
    this.targetOnDown.x = this.target.x;
    this.targetOnDown.y = this.target.y;
    this.container.style.cursor = 'move';
  }

  @autobind
  onMouseMove(event) {
    this.mouse.x = -event.clientX;
    this.mouse.y = event.clientY;

    if (this.isDragging) {
      // If mouse button is down, we update viewport.
      const zoomDamp = (this.distance / 1000) * (this.distance / 1000);

      this.target.x = this.targetOnDown.x + (this.mouse.x - this.mouseOnDown.x) * 0.005 * zoomDamp;
      this.target.y = this.targetOnDown.y + (this.mouse.y - this.mouseOnDown.y) * 0.005 * zoomDamp;

      this.target.y = this.target.y > PI_HALF ? PI_HALF : this.target.y;
      this.target.y = this.target.y < -PI_HALF ? -PI_HALF : this.target.y;
    } else {
      // If mouse button is not down, we highlight country pointing to.
      this.updateHoverCountryByEvent(event);
    }
  }

  @autobind
  onMouseUp(event) {
    this.onDocumentMouseUp();
    if (this.mouse.x === this.mouseOnDown.x && this.mouse.y === this.mouseOnDown.y) {
      const coord = this.calcHoverCoordOnEarth(event);
      const countryCode = this.getHoverCountryCode(event);
      const rotation = this.calcRotationFromEarthCoord(coord);
      const newRotateX = rotation[0] - Math.PI * 0.5;
      const newRotateY = rotation[1];
      this.target.x = this.calcNearRotation(newRotateX, this.target.x);
      this.target.y = this.calcNearRotation(newRotateY, this.target.y);
      this.setFocusCountry(countryCode);
    }
  }

  @autobind
  onDocumentMouseUp() {
    this.container.style.cursor = 'auto';
    this.isDragging = false;
  }

  @autobind
  onMouseWheel(event) {
    event.preventDefault();
    this.zoom(event.wheelDeltaY * 0.3);
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
}

export default {
  name: 'Globe',
  data: () => ({
    globeRenderer: null,
  }),
  mounted() {
    this.globeRenderer = new GlobeRenderer(this.$refs.container);
    document.addEventListener('mouseup', this.globeRenderer.onDocumentMouseUp);
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.globeRenderer.onDocumentMouseUp);
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
