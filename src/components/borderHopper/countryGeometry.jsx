// src/components/borderHopper/countryGeometry.jsx
import React from 'react';
import * as THREE from 'three';

const CountryGeometry = ({ countryData, color = "#FFFFFF", opacity = 1 }) => {
  // Need coordinates in the same format as classic mode
  if (!countryData?.geometry?.coordinates) {
    return null;
  }

  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  
  try {
    // Use the same polygon handling as classic mode
    const polygons = countryData.geometry.type === 'MultiPolygon' 
      ? countryData.geometry.coordinates 
      : [countryData.geometry.coordinates];

    polygons.forEach(polygon => {
      polygon.forEach(ring => {
        // Create connected lines same as minimal mode in classic
        for (let i = 0; i < ring.length; i++) {
          const coord = ring[i];
          if (!Array.isArray(coord)) return;
          
          const [lon, lat] = coord;
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lon + 180) * (Math.PI / 180);
          
          const x = -Math.sin(phi) * Math.cos(theta);
          const y = Math.cos(phi);
          const z = Math.sin(phi) * Math.sin(theta);
          
          vertices.push(x, y, z);
          
          // Connect to next point (or back to first for last point)
          if (i < ring.length - 1) {
            const [nextLon, nextLat] = ring[i + 1];
            const nextPhi = (90 - nextLat) * (Math.PI / 180);
            const nextTheta = (nextLon + 180) * (Math.PI / 180);
            
            vertices.push(
              -Math.sin(nextPhi) * Math.cos(nextTheta),
              Math.cos(nextPhi),
              Math.sin(nextPhi) * Math.sin(nextTheta)
            );
          } else {
            // Connect back to first point
            const [firstLon, firstLat] = ring[0];
            const firstPhi = (90 - firstLat) * (Math.PI / 180);
            const firstTheta = (firstLon + 180) * (Math.PI / 180);
            
            vertices.push(
              -Math.sin(firstPhi) * Math.cos(firstTheta),
              Math.cos(firstPhi),
              Math.sin(firstPhi) * Math.sin(firstTheta)
            );
          }
        }
      });
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  } catch (error) {
    console.error('Error processing country geometry:', error);
    return null;
  }

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial 
        color={color}
        transparent
        opacity={opacity}
        linewidth={2}
      />
    </lineSegments>
  );
};

export default CountryGeometry;