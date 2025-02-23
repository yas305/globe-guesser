// src/components/borderHopper/border-globe.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BorderEarth from './earth';

const BorderGlobe = () => {
  return (
    <div className="w-[320px] h-[320px] rounded-full" style={{ background: '#1a1a1a' }}>
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        style={{ background: '#1a1a1a' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        
        <BorderEarth />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default BorderGlobe;