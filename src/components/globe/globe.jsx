// src/components/globe/globe.jsx
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Earth from './earth';
import CameraController from './cameraController';
import { getCountryData } from '../../services/countryService';

const Globe = ({ selectedCountry, mode = 'classic' }) => {
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    if (selectedCountry) {
      getCountryData().then(features => {
        const country = features.find(f => 
          f.properties.name.toLowerCase() === selectedCountry.toLowerCase()
        );
        setCountryData(country);
      });
    }
  }, [selectedCountry]);

  const containerStyles = mode === 'classic' 
    ? "w-[320px] h-[320px] bg-transparent"
    : "w-[320px] h-[320px] bg-[#1a1a1a] rounded-full";

  const canvasStyles = mode === 'classic'
    ? { background: 'transparent' }
    : { background: '#1a1a1a' };

  return (
    <div className={containerStyles}>
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        style={canvasStyles}
      >
        <ambientLight intensity={mode === 'classic' ? 1.2 : 0.5} />
        <pointLight 
          position={[10, 10, 10]} 
          intensity={mode === 'classic' ? 2 : 0.8} 
        />
        <Earth 
          selectedCountry={selectedCountry} 
          mode={mode}
        />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
        />
        <CameraController 
          selectedCountry={selectedCountry}
          countryData={countryData}
        />
      </Canvas>
    </div>
  );
};

export default Globe;