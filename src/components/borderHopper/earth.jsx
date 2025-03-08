// src/components/borderHopper/earth.jsx
import React from 'react';
import BorderCountries from './countries';
import * as THREE from 'three';

const BorderEarth = () => {
  // Create a subtle grid texture for the globe
  const gridTexture = new THREE.TextureLoader().load('/2earth-texture.jpg');

  return (
    <group rotation={[0, 0, 0]}>
      {/* Base sphere with subtle texture */}
      <mesh>
        <sphereGeometry args={[0.995, 64, 64]} />
        <meshStandardMaterial
          color="#192a56"
          map={gridTexture}
          transparent={true}
          opacity={0.2}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#4a69bd"
          wireframe={true}
          transparent={true}
          opacity={0.15}
        />
      </mesh>

      <BorderCountries />
    </group>
  );
};

export default BorderEarth;