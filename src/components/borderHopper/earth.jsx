// src/components/borderHopper/earth.jsx
import React from 'react';
import BorderCountries from './countries';

const BorderEarth = () => {
  return (
    <group rotation={[0, 0, 0]}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color="#666666"
          wireframe={true}
          transparent={true}
          opacity={0.1}
        />
      </mesh>
      <BorderCountries />
    </group>
  );
};

export default BorderEarth;