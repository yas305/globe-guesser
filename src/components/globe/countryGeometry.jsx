import React from 'react';
import * as THREE from 'three';

const CountryGeometry = ({ countryData, selected }) => {

    console.log('Country:', countryData?.properties?.name, 'Selected:', selected);
  if (!countryData?.geometry?.coordinates) {
    return null;
  }

  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  
  try {
    // Handle MultiPolygon and Polygon types
    const polygons = countryData.geometry.type === 'MultiPolygon' 
      ? countryData.geometry.coordinates 
      : [countryData.geometry.coordinates];

    polygons.forEach(polygon => {
      polygon.forEach(ring => {
        ring.forEach(coord => {
          if (!Array.isArray(coord)) return;
          const [lon, lat] = coord;
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lon + 180) * (Math.PI / 180);
          vertices.push(
            -Math.sin(phi) * Math.cos(theta),
            Math.cos(phi),
            Math.sin(phi) * Math.sin(theta)
          );
        });
      });
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  } catch (error) {
    console.error('Error processing country geometry:', error);
    return null;
  }

  return (
    <line geometry={geometry}>
      <lineBasicMaterial 
        color={selected ? '#ff0000' : '#ffffff'}
        transparent
        opacity={selected ? 0.8 : 0.2}
      />
    </line>
  );
};

export default CountryGeometry;