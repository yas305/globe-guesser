// src/components/borderHopper/border-globe.jsx
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import BorderEarth from './earth';
import BorderCameraController from './border-camera-controller';
import useBorderHopperStore from '../../store/borderHopperStore';
import HintButton from './hint-button';

const BorderGlobe = () => {
  const controlsRef = useRef();
  const { sourceCountry, targetCountry } = useBorderHopperStore();

  return (
    <div className="flex flex-col items-center">
      {/* Globe container */}
      <div className="relative w-[320px] h-[320px] rounded-full overflow-hidden mb-4"
        style={{
          background: 'radial-gradient(circle, #1e3a8a 0%, #0f172a 100%)',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
        }}>
        {/* Add subtle animated gradient overlay */}
        <div className="absolute inset-0 opacity-30 z-0"
          style={{
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(99, 102, 241, 0.2) 100%)',
            animation: 'gradientShift 8s ease infinite alternate'
          }}>
        </div>

        <Canvas
          camera={{ position: [0, 0, 2.5], fov: 45 }}
          style={{ background: 'transparent' }}
        >
          {/* Improved lighting for better visibility */}
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.0} />
          <pointLight position={[-10, -10, -10]} intensity={0.4} color="#6366f1" />

          {/* Add subtle stars in the background */}
          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />

          <BorderEarth />

          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.5}
          />

          {/* Add the camera controller to automatically position the view */}
          <BorderCameraController />
        </Canvas>

        {/* Add a subtle glow effect */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.3)',
            borderRadius: '50%'
          }}>
        </div>

        {/* Add global styles for animations */}
        <style jsx global>{`
          @keyframes gradientShift {
            0% { opacity: 0.1; }
            50% { opacity: 0.3; }
            100% { opacity: 0.1; }
          }
          
          /* Debug styles for hint button */
          body[style*="--hint-active: true"] {
            background-color: rgba(0, 255, 0, 0.05);
          }
        `}</style>
      </div>

      {/* Hint button container with clear positioning */}
      <div className="w-full flex justify-center mt-2 mb-4 relative" style={{ zIndex: 100 }}>
        <HintButton />
      </div>
    </div>
  );
};

export default BorderGlobe;