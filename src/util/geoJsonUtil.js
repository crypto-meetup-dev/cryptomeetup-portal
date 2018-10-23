import getCountriesGeoJson from '@geo-maps/countries-coastline-10km';
import countryLatLon from "./countryLatLon";
import * as THREE from 'three';
import * as d3 from 'd3-geo';

function getMidpoint(point1, point2) {
  const midpointLon = (point1[0] + point2[0]) / 2;
  const midpointLat = (point1[1] + point2[1]) / 2;
  const midpoint = [midpointLon, midpointLat];
  return midpoint;
}

/**
 * If the distance between two latitude and longitude values is
 * greater than five degrees, return true.
 */
function needsInterpolation(point2, point1) {
  const lon1 = point1[0];
  const lat1 = point1[1];
  const lon2 = point2[0];
  const lat2 = point2[1];
  const lonDis = Math.abs(lon1 - lon2);
  const latDis = Math.abs(lat1 - lat2);
  if (lonDis > 5 || latDis > 5) {
    return true;
  }
  return false;
}

function interpolatePoints(interpoArr) {
  // This function is recursive. It will continue to add midpoints to the
  // interpolation array until needsInterpolation() returns false.
  let ret = [];
  let point1;
  let point2;

  for (let pointIdx = 0; pointIdx < interpoArr.length - 1; pointIdx++) {
    point1 = interpoArr[pointIdx];
    point2 = interpoArr[pointIdx + 1];

    if (needsInterpolation(point2, point1)) {
      ret.push(point1);
      ret.push(getMidpoint(point1, point2));
    } else {
      ret.push(point1);
    }
  }

  ret.push(interpoArr[interpoArr.length - 1]);

  if (ret.length > interpoArr.length) {
    ret = interpolatePoints(ret);
  } else {
    return ret;
  }
  return ret;
}

function createCoordinateArray(feature) {
  // Loop through the coordinates and figure out if the points need interpolation.
  const ret = [];
  let interpo = [];
  for (let pointIdx = 0; pointIdx < feature.length; pointIdx++) {
    const point1 = feature[pointIdx];
    const point2 = feature[pointIdx - 1];
    if (pointIdx > 0) {
      if (needsInterpolation(point2, point1)) {
        interpo = [point2, point1];
        interpo = interpolatePoints(interpo);
        for (let interpoIdx = 0; interpoIdx < interpo.length; interpoIdx++) {
          ret.push(interpo[interpoIdx]);
        }
      } else {
        ret.push(point1);
      }
    } else {
      ret.push(point1);
    }
  }
  return ret;
}

function convertToSphereCoords(coordinates, radius, x, y, z) {
  const lon = coordinates[0];
  const lat = coordinates[1];
  x.push(Math.cos(lat * Math.PI / 180) * Math.cos(lon * Math.PI / 180) * radius);
  y.push(Math.cos(lat * Math.PI / 180) * Math.sin(lon * Math.PI / 180) * radius);
  z.push(Math.sin(lat * Math.PI / 180) * radius);
}

function buildLineMesh(x, y, z, material) {
  const geometry = new THREE.Geometry();
  for (let i = 0; i < x.length; i++) {
    geometry.vertices.push(new THREE.Vector3(
      x[i],
      y[i],
      z[i],
    ));
  }
  const line = new THREE.Line(geometry, material);
  return line;
}

/**
 * Get the country code from lat lon.
 */
export function getCountryFromLatLng(lat, lon) {
  const countries = getCountriesGeoJson();
  const len = countries.features.length;
  for (let i = 0; i < len; i++) {
    const country = countries.features[i];
    if (d3.geoContains(country, [lon, lat])) {
      return country.properties.A3;
    }
  }
  return null;
}

/**
 * Get a map from country ID to GeoJSON geometry.
 * @param {Object} geoJson
 */
export function getGeoJsonCountries() {
  const output = {};
  const countries = getCountriesGeoJson();
  countries.features.forEach((country) => {
    output[country.properties.A3] = country.geometry;
  });
  return output;
}

/**
 * Get a THREE.js line geometry from a GeoJson getmetry.
 */
export function buildLinesFromGeoJson(geometry, radius, material) {
  const meshes = [];

  let xValues = [];
  let yValues = [];
  let zValues = [];

  switch (geometry.type) {
    case 'LineString':
    {
      const coods = createCoordinateArray(geometry.coordinates);
      for (let coodIdx = 0; coodIdx < coods.length; coodIdx++) {
        convertToSphereCoords(coods[coodIdx], radius, xValues, yValues, zValues);
      }
      meshes.push(buildLineMesh(xValues, yValues, zValues, material));
      break;
    }
    case 'Polygon':
    {
      for (let segIdx = 0; segIdx < geometry.coordinates.length; segIdx++) {
        const coods = createCoordinateArray(geometry.coordinates[segIdx]);
        for (let coodIdx = 0; coodIdx < coods.length; coodIdx++) {
          convertToSphereCoords(coods[coodIdx], radius, xValues, yValues, zValues);
        }
        meshes.push(buildLineMesh(xValues, yValues, zValues, material));
        xValues = [];
        yValues = [];
        zValues = [];
      }
      break;
    }
    case 'MultiLineString':
    {
      for (let segIdx = 0; segIdx < geometry.coordinates.length; segIdx++) {
        const coods = createCoordinateArray(geometry.coordinates[segIdx]);
        for (let coodIdx = 0; coodIdx < coods.length; coodIdx++) {
          convertToSphereCoords(coods[coodIdx], radius, xValues, yValues, zValues);
        }
        meshes.push(buildLineMesh(xValues, yValues, zValues, material));
        xValues = [];
        yValues = [];
        zValues = [];
      }
      break;
    }
    case 'MultiPolygon':
    {
      for (let polygonIdx = 0; polygonIdx < geometry.coordinates.length; polygonIdx++) {
        for (let segIdx = 0; segIdx < geometry.coordinates[polygonIdx].length; segIdx++) {
          const coods = createCoordinateArray(geometry.coordinates[polygonIdx][segIdx]);
          for (let coodIdx = 0; coodIdx < coods.length; coodIdx++) {
            convertToSphereCoords(coods[coodIdx], radius, xValues, yValues, zValues);
          }
          meshes.push(buildLineMesh(xValues, yValues, zValues, material));
          xValues = [];
          yValues = [];
          zValues = [];
        }
      }
      break;
    }
    default:
      throw Error('Unsupported Geometry Type');
  }
  return meshes;
}

export const getLandCodeForContract = 
  (digit2) => Object.keys(countryLatLon).indexOf(digit2)