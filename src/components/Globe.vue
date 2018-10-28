<template>
  <div ref="container" class="globe-container" tabindex="-1"></div>
</template>

<script>
import * as THREE from 'three';
import Geo from '@/util/geo';
import countryLatLonJson from '@/util/countryLatLon.json';
import countryPointsJson from '@/util/countryPoints.json';
import * as CountryCode from 'i18n-iso-countries';
import throttle from 'lodash-decorators/throttle';
import { autobind } from 'core-decorators';
import { EventEmitter2 } from 'eventemitter2';
import isTouchDevice from 'is-touch-device';

const jitterRate = 0.5;
const magnitudeJitter = {};
countryPointsJson.forEach((country) => {
  const jitter = [];
  for (let i = 0; i < country.points.length; i += 2) {
    jitter.push(Math.random() * jitterRate + (1 - jitterRate / 2));
  }
  magnitudeJitter[country.code] = jitter;
});

const PI_HALF = Math.PI / 2;
const PI_DOUBLE = Math.PI * 2;
const EARTH_RADIUS = 200;

const HOVER_COUNTRY_COLOR = 0xffffff;
const FOCUS_COUNTRY_COLOR = 0xffd345;

const DISTANCE_FAR_MOST = 1000;
const DISTANCE_NEAR_MOST = 300;
const DISTANCE_FOCUS = 500;
const POINT_SIZE = 100;

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

class GlobeRenderer extends EventEmitter2 {
  constructor(container, isTouch) {
    super();
    this.isTouch = isTouch;
    this.container = container;
    this.running = true;
    this.distance = 100000;
    this.distanceTarget = 100000;
    this.isDragging = false;
    this.isTouchMoved = false;
    this.touchDownClientPos = null;
    this.mouse = { x: 0, y: 0 };
    this.mouseOnDown = { x: 0, y: 0 };
    this.rotation = { x: 0, y: 0 };
    this.target = { x: Math.PI * 3 / 2, y: Math.PI / 6.0 };
    this.targetOnDown = { x: 0, y: 0 };
    this.hoverCountryCode = null;
    this.focusCountryCode = null;
    this.init();

    setTimeout(() => this.animate(), 500);
  }

  init() {
    this.w = this.container.offsetWidth || window.innerWidth;
    this.h = this.container.offsetHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(30, this.w / this.h, 1, 10000);
    this.camera.position.z = this.distance;

    this.scene = new THREE.Scene();

    // Star Field
    {
      const geometry = new THREE.SphereGeometry(DISTANCE_FAR_MOST + 10, 32, 32);
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
        side: THREE.FrontSide,
        opacity: 0.8,
        transparent: true,
      });
      const mesh = new THREE.Mesh(cloudGeometry, material);
      mesh.rotation.y = Math.PI;
      this.scene.add(mesh);
      this.cloudMesh = mesh;
    }

    // Unit Point
    {
      const pointGeometry = new THREE.BoxGeometry(1, 1, 1);
      pointGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -0.5));
      const unitPointMesh = new THREE.Mesh(pointGeometry);
      this.unitPointMesh = unitPointMesh;
    }

    this.raycaster = new THREE.Raycaster();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.w, this.h);
    this.container.appendChild(this.renderer.domElement);
    this.container.addEventListener(this.isTouch ? 'touchstart' : 'mousedown', this.onMouseDown, false);
    this.container.addEventListener(this.isTouch ? 'touchmove' : 'mousemove', this.onMouseMove, false);
    this.container.addEventListener(this.isTouch ? 'touchend' : 'mouseup', this.onMouseUp, false);
    this.container.addEventListener('mousewheel', this.onMouseWheel, false);
  }

  makePointColor(magnitude) {
    const c = new THREE.Color();
    c.setHSL((0.6 - (magnitude * 0.5)), 1.0, 0.5);
    return c;
  }

  setPoints(pointSeries) {
    // pointSeries is an array of points that:
    // points[idx + 0]: lat
    // points[idx + 1]: lon
    // points[idx + 2]: magnitude (0 ~ 1)
    if (this.pointsMesh) {
      this.scene.remove(this.pointsMesh);
      this.pointsMesh = null;
    }
    if (pointSeries) {
      const pointCollection = new THREE.Object3D();
      pointSeries.forEach((points) => {
        const geometry = new THREE.Geometry();
        for (let i = 0; i < points.length; i += 3) {
          this.addPointToGeometry(
            points[i],
            points[i + 1],
            points[i + 2] * POINT_SIZE,
            this.makePointColor(points[i + 2]),
            geometry,
          );
        }
        const material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          vertexColors: THREE.FaceColors,
          morphTargets: false,
          blending: THREE.AdditiveBlending,
        });
        const mesh = new THREE.Mesh(geometry, material);
        pointCollection.add(mesh);
      });
      this.pointsMesh = pointCollection;
      this.scene.add(this.pointsMesh);
    }
  }

  addPointToGeometry(lat, lon, magnitude, color, targetGeometry) {
    // magnitude is between 0 and 1.
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (180 - lon) * Math.PI / 180;

    this.unitPointMesh.position.x = EARTH_RADIUS * Math.sin(phi) * Math.cos(theta);
    this.unitPointMesh.position.y = EARTH_RADIUS * Math.cos(phi);
    this.unitPointMesh.position.z = EARTH_RADIUS * Math.sin(phi) * Math.sin(theta);
    this.unitPointMesh.lookAt(this.earthMesh.position);

    this.unitPointMesh.scale.z = Math.max(magnitude, 0.1);
    this.unitPointMesh.updateMatrix();

    for (let i = 0; i < this.unitPointMesh.geometry.faces.length; i++) {
      this.unitPointMesh.geometry.faces[i].color = color;
    }
    if (this.unitPointMesh.matrixAutoUpdate) {
      this.unitPointMesh.updateMatrix();
    }
    targetGeometry.merge(this.unitPointMesh.geometry, this.unitPointMesh.matrix);
  }

  /**
   * Calculates the coordinates on the earth surface that mouse is hovering.
   */
  calcHoverCoordOnEarth({ clientX, clientY }) {
    const mousePosition = this.getMousePositionInContainer(this.container, clientX, clientY);
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
  getHoverCountryCode(clientPos) {
    const coord = this.calcHoverCoordOnEarth(clientPos);
    if (coord !== null) {
      const rotateXY = this.calcRotationFromEarthCoord(coord);
      const [lon, lat] = rotateXY.map(v => v * 180 / Math.PI);
      const countryCode = Geo.getCountryFromLatLng(lat, lon);
      return countryCode;
    }
    return null;
  }

  /**
   * Get the client position from touch or mouse event.
   */
  getClientPosFromTouchOrMouseEvent(event) {
    const clientX = this.isTouch ? event.touches[0].clientX : event.clientX;
    const clientY = this.isTouch ? event.touches[0].clientY : event.clientY;
    return { clientX, clientY };
  }

  /**
   * Updates the geometry of hovering country according to mouse.
   */
  @throttle(100)
  updateHoverCountryByClientPos(clientPos) {
    const countryCode = this.getHoverCountryCode(clientPos);
    if (this.hoverCountryCode === countryCode) {
      return;
    }
    if (this.hoverCountryMesh) {
      this.scene.remove(this.hoverCountryMesh);
      this.hoverCountryMesh = null;
    }
    if (countryCode !== null) {
      const geoJsonCountries = Geo.getGeoJsonCountries();
      const material = new THREE.LineBasicMaterial({ color: HOVER_COUNTRY_COLOR });
      const lines = Geo.buildLinesFromGeoJson(geoJsonCountries[countryCode], EARTH_RADIUS, material);
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
      const geoJsonCountries = Geo.getGeoJsonCountries();
      const material = new THREE.LineBasicMaterial({ color: FOCUS_COUNTRY_COLOR });
      const lines = Geo.buildLinesFromGeoJson(geoJsonCountries[countryCode], EARTH_RADIUS, material);
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
    this.emit('focusCountry', countryCode);
  }

  /**
   * Zoom in and focus at a specific country.
   */
  focusCountry(countryCode, lat = null, lon = null) {
    if (lat == null || lon == null) {
      const countryCodeAlpha2 = (CountryCode.alpha3ToAlpha2(countryCode) || '').toLowerCase();
      const countryLatLon = countryLatLonJson[countryCodeAlpha2];
      if (countryLatLon) {
        lat = parseFloat(countryLatLon[0]) * Math.PI / 180;
        lon = parseFloat(countryLatLon[1]) * Math.PI / 180;
      }
    }
    if (lat == null || lon == null) {
      console.log('No country location data for %s', countryCode);
      // No data
      return;
    }
    const newRotateX = lon - Math.PI * 0.5;
    const newRotateY = lat;
    // Move viewport to left a little.
    this.target.x = this.calcNearRotation(newRotateX, this.target.x) + Math.PI * 0.05;
    this.target.y = this.calcNearRotation(newRotateY, this.target.y);
    this.zoomTo(DISTANCE_FOCUS);
    this.setFocusCountry(countryCode);
  }

  /**
   * Zoom out.
   */
  clearCountryFocus() {
    this.zoomTo(DISTANCE_FAR_MOST);
    this.setFocusCountry(null);
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
    this.zoomBy(0);

    this.cloudMesh.rotation.y += 0.0002;
    this.rotation.x += (this.target.x - this.rotation.x) * 0.1;
    this.rotation.y += (this.target.y - this.rotation.y) * 0.1;
    this.distance += (this.distanceTarget - this.distance) * 0.3;

    this.camera.position.x = this.distance * Math.sin(this.rotation.x) * Math.cos(this.rotation.y);
    this.camera.position.y = this.distance * Math.sin(this.rotation.y);
    this.camera.position.z = this.distance * Math.cos(this.rotation.x) * Math.cos(this.rotation.y);

    this.camera.lookAt(this.earthMesh.position);

    this.renderer.render(this.scene, this.camera);
  }

  zoomTo(value) {
    this.distanceTarget = value;
    this.distanceTarget = this.distanceTarget > DISTANCE_FAR_MOST ? DISTANCE_FAR_MOST : this.distanceTarget;
    this.distanceTarget = this.distanceTarget < DISTANCE_NEAR_MOST ? DISTANCE_NEAR_MOST : this.distanceTarget;
  }

  zoomBy(delta) {
    this.distanceTarget -= delta;
    this.distanceTarget = this.distanceTarget > DISTANCE_FAR_MOST ? DISTANCE_FAR_MOST : this.distanceTarget;
    this.distanceTarget = this.distanceTarget < DISTANCE_NEAR_MOST ? DISTANCE_NEAR_MOST : this.distanceTarget;
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
    const clientPos = this.getClientPosFromTouchOrMouseEvent(event);
    this.isDragging = true;
    if (this.isTouch) {
      this.isTouchMoved = false;
      this.touchDownClientPos = clientPos;
      // In mobile, update hover country when touch down.
      this.updateHoverCountryByClientPos(clientPos);
    }
    this.mouseOnDown.x = -clientPos.clientX;
    this.mouseOnDown.y = clientPos.clientY;
    this.targetOnDown.x = this.target.x;
    this.targetOnDown.y = this.target.y;
    this.container.style.cursor = 'move';
  }

  @autobind
  onMouseMove(event) {
    const clientPos = this.getClientPosFromTouchOrMouseEvent(event);
    if (this.isTouch) {
      this.isTouchMoved = true;
    }
    this.mouse.x = -clientPos.clientX;
    this.mouse.y = clientPos.clientY;
    if (this.isDragging || this.isTouch) {
      // If mouse button is down, we update viewport.
      const zoomDamp = (this.distance / DISTANCE_FAR_MOST) ** 2;

      this.target.x = this.targetOnDown.x + (this.mouse.x - this.mouseOnDown.x) * 0.005 * zoomDamp;
      this.target.y = this.targetOnDown.y + (this.mouse.y - this.mouseOnDown.y) * 0.005 * zoomDamp;

      this.target.y = this.target.y > PI_HALF ? PI_HALF : this.target.y;
      this.target.y = this.target.y < -PI_HALF ? -PI_HALF : this.target.y;
    } else {
      // If mouse button is not down, we highlight country pointing to.
      this.updateHoverCountryByClientPos(event);
    }
  }

  @autobind
  onMouseUp(event) {
    this.onDocumentMouseUp();
    let isTap = false;
    if (this.isTouch) {
      isTap = !this.isTouchMoved;
    } else {
      isTap = this.mouse.x === this.mouseOnDown.x && this.mouse.y === this.mouseOnDown.y;
    }
    const clientPos = this.isTouch ? this.touchDownClientPos : this.getClientPosFromTouchOrMouseEvent(event);
    if (isTap) {
      const coord = this.calcHoverCoordOnEarth(clientPos);
      const countryCode = this.getHoverCountryCode(clientPos);
      if (!countryCode) {
        return;
      }
      const rotation = this.calcRotationFromEarthCoord(coord);
      this.focusCountry(countryCode, rotation[1], rotation[0]);
    }
  }

  @autobind
  onDocumentMouseUp() {
    this.container.style.cursor = 'auto';
    this.isDragging = false;
    // We don't zoom into a country on document mouse up.
  }

  @autobind
  onMouseWheel(event) {
    event.preventDefault();
    this.zoomBy(event.wheelDeltaY * 0.3);
  }

  @throttle(200)
  @autobind
  onWindowResize() {
    this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
  }
}

export default {
  name: 'Globe',
  props: ['value', 'countryPrice'],
  mounted() {
    this.globeRenderer = new GlobeRenderer(this.$refs.container, isTouchDevice());
    this.globeRenderer.on('focusCountry', (code) => {
      this.$emit('input', code);
    });
    document.addEventListener('mouseup', this.globeRenderer.onDocumentMouseUp);
    window.addEventListener('resize', this.globeRenderer.onWindowResize);
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.globeRenderer.onDocumentMouseUp);
    window.removeEventListener('resize', this.globeRenderer.onWindowResize);
    this.globeRenderer.stopRunning();
  },
  watch: {
    value(countryCode) {
      if (countryCode) {
        this.globeRenderer.focusCountry(countryCode);
      } else {
        this.globeRenderer.clearCountryFocus();
      }
    },
    countryPrice(priceMap2) {
      const priceMap = Object.freeze(priceMap2);

      let maxPrice = 0;
      Object.values(priceMap).forEach((price) => {
        if (price > maxPrice) {
          maxPrice = price;
        }
      });

      // build each country points
      const pointSeries = countryPointsJson
        .map((country) => {
          // A series per country
          const points = [];
          const jitter = magnitudeJitter[country.code];
          const magnitude = (priceMap[country.code] || 0) / maxPrice;
          for (let i = 0, ji = 0; i < country.points.length; i += 2, ji += 1) {
            points.push(country.points[i + 1], country.points[i], Math.min(magnitude * jitter[ji], 1));
          }
          return points;
        });

      console.time('setPoints');
      this.globeRenderer.setPoints(pointSeries);
      console.timeEnd('setPoints');
    },
  },
};
</script>

<style lang="sass" scoped>
.globe-container
  position: absolute
  width: 100vw
  height: 100vh
  top: 0
  left: 0
  overflow: hidden
</style>
