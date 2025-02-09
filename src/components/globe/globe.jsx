import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Earth from './earth';
import CameraController from './cameraController';
import { getCountryData } from '../../services/countryService';

const Globe = ({ selectedCountry }) => {
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

  return (
    <div className="w-full max-w-[320px] aspect-square mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <Earth selectedCountry={selectedCountry} />
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