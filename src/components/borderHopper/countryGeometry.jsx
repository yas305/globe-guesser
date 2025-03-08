// src/components/borderHopper/countryGeometry.jsx
import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';

const CountryGeometry = ({ countryData, color = "#FFFFFF", opacity = 1 }) => {
  // Need coordinates in the same format as classic mode
  if (!countryData?.geometry?.coordinates) {
    console.warn('CountryGeometry: Missing coordinates data');
    return null;
  }

  // Debug logging for hint countries
  useEffect(() => {
    if (color === "#AAAAAA") { // This is a hint country
      console.log(`Rendering hint country geometry with opacity ${opacity}`);
    }
  }, [color, opacity]);

  // Use useMemo to avoid recreating geometries on every render
  const geometry = useMemo(() => {
    const lineGeometry = new THREE.BufferGeometry();
    const lineVertices = [];

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

            lineVertices.push(x, y, z);

            // Connect to next point (or back to first for last point)
            if (i < ring.length - 1) {
              const [nextLon, nextLat] = ring[i + 1];
              const nextPhi = (90 - nextLat) * (Math.PI / 180);
              const nextTheta = (nextLon + 180) * (Math.PI / 180);

              lineVertices.push(
                -Math.sin(nextPhi) * Math.cos(nextTheta),
                Math.cos(nextPhi),
                Math.sin(nextPhi) * Math.sin(nextTheta)
              );
            } else {
              // Connect back to first point
              const [firstLon, firstLat] = ring[0];
              const firstPhi = (90 - firstLat) * (Math.PI / 180);
              const firstTheta = (firstLon + 180) * (Math.PI / 180);

              lineVertices.push(
                -Math.sin(firstPhi) * Math.cos(firstTheta),
                Math.cos(firstPhi),
                Math.sin(firstPhi) * Math.sin(firstTheta)
              );
            }
          }
        });
      });

      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lineVertices, 3));
      return lineGeometry;
    } catch (error) {
      console.error('Error processing country geometry:', error);
      return null;
    }
  }, [countryData]);

  if (!geometry) return null;

  // For hint countries, use a more visible style
  const isHintCountry = color === "#AAAAAA";
  const lineWidth = isHintCountry ? 4 : 3; // Thicker lines for hint countries
  const actualOpacity = isHintCountry ? 0.9 : opacity; // More opaque for hint countries

  return (
    <lineSegments geometry={geometry} renderOrder={isHintCountry ? 10 : 1}>
      <lineBasicMaterial
        color={color}
        transparent={true}
        opacity={actualOpacity}
        linewidth={lineWidth}
        depthTest={!isHintCountry} // Disable depth test for hint countries to ensure they're visible
      />
    </lineSegments>
  );
};

export default CountryGeometry;