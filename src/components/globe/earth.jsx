// src/components/globe/earth.jsx
import React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import Countries from './countries';

const Earth = ({ selectedCountry, mode = 'classic' }) => {
  const texture = useLoader(TextureLoader, '/earth-texture.jpg');

  if (mode === 'classic') {
    return (
      <group rotation={[0, 0, 0]}>
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial 
            map={texture}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
        <Countries selectedCountry={selectedCountry} mode={mode} />
      </group>
    );
  }

  // Border Hopper mode - empty sphere
  return (
    <group rotation={[0, 0, 0]}>
      {/* Empty sphere with very subtle grid for depth perception */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color="#666666"
          wireframe={true}
          transparent={true}
          opacity={0.1}
        />
      </mesh>
      <Countries selectedCountry={selectedCountry} mode={mode} />
    </group>
  );
};

export default Earth;