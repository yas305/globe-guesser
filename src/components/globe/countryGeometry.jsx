// src/components/globe/countryGeometry.jsx
import React from 'react';
import * as THREE from 'three';

const CountryGeometry = ({ countryData, selected, mode = 'classic' }) => {
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
        // Convert coordinates to vectors
        const points = ring.map(coord => {
          const [lon, lat] = coord;
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lon + 180) * (Math.PI / 180);
          return new THREE.Vector3(
            -Math.sin(phi) * Math.cos(theta),
            Math.cos(phi),
            Math.sin(phi) * Math.sin(theta)
          );
        });

        if (mode === 'classic') {
          // Classic mode: just push vertices
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
        } else {
          // Minimal mode: create connected lines
          for (let i = 0; i < points.length; i++) {
            vertices.push(points[i].x, points[i].y, points[i].z);
            if (i < points.length - 1) {
              vertices.push(points[i + 1].x, points[i + 1].y, points[i + 1].z);
            } else {
              vertices.push(points[0].x, points[0].y, points[0].z);
            }
          }
        }
      });
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  } catch (error) {
    console.error('Error processing country geometry:', error);
    return null;
  }

  if (mode === 'classic') {
    return (
      <line geometry={geometry}>
        <lineBasicMaterial 
          color={selected ? '#ff0000' : '#ffffff'}
          transparent
          opacity={selected ? 0.8 : 0.2}
        />
      </line>
    );
  }

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial 
        color={selected ? '#ffffff' : '#666666'}
        transparent
        opacity={selected ? 1 : 0.3}
        linewidth={1}
      />
    </lineSegments>
  );
};

export default CountryGeometry;