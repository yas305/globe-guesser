// src/components/borderHopper/countryGeometry.jsx
import React from 'react';
import * as THREE from 'three';

const CountryGeometry = ({ countryData, color = "#FFFFFF", opacity = 1 }) => {
  if (!countryData?.geometry) {
    return null;
  }

  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  
  try {
    const processCoordinates = (coords) => {
      coords.forEach(lineString => {
        if (!Array.isArray(lineString[0])) return;
        
        lineString.forEach((coord, i) => {
          const [lon, lat] = coord;
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lon + 180) * (Math.PI / 180);
          
          const x = -Math.sin(phi) * Math.cos(theta);
          const y = Math.cos(phi);
          const z = Math.sin(phi) * Math.sin(theta);
          
          vertices.push(x, y, z);
          
          // Connect to next point
          if (i < lineString.length - 1) {
            vertices.push(x, y, z);
          }
        });
      });
    };

    if (countryData.geometry.type === 'Polygon') {
      processCoordinates(countryData.geometry.coordinates);
    } else if (countryData.geometry.type === 'MultiPolygon') {
      countryData.geometry.coordinates.forEach(polygon => {
        processCoordinates(polygon);
      });
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  } catch (error) {
    console.error('Error processing geometry:', error);
    return null;
  }

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial 
        color={color}
        transparent={opacity < 1}
        opacity={opacity}
        linewidth={2}
      />
    </lineSegments>
  );
};

export default CountryGeometry;