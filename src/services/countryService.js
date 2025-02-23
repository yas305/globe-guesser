// src/services/countryService.js
import { feature } from 'topojson-client';

export const getCountryData = async () => {
  try {
    const response = await fetch('/world-110m.json');
    const topology = await response.json();
    return feature(topology, topology.objects.countries).features;
  } catch (error) {
    console.error('Error loading country data:', error);
    return [];
  }
};

export const getAdminBoundaryData = async () => {
  try {
    const response = await fetch('/simplified-boundaries.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading admin boundary data:', error);
    return [];
  }
};

export const getCountryCenter = (countryGeometry) => {
  if (!countryGeometry?.coordinates) return null;
  
  const coords = countryGeometry.type === 'MultiPolygon' 
    ? countryGeometry.coordinates[0][0]
    : countryGeometry.coordinates[0];
    
  const centerIndex = Math.floor(coords.length / 2);
  return coords[centerIndex];
};

export const convertGeoToVector = (lon, lat, radius = 2.5) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  return {
    x: radius * -Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  };
};