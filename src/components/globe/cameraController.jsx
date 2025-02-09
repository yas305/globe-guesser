import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { getCountryCenter, convertGeoToVector } from '../../services/countryService';

const CameraController = ({ selectedCountry, countryData }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    if (!selectedCountry || !countryData) return;

    const centerCoords = getCountryCenter(countryData.geometry);
    if (!centerCoords) return;

    const [lon, lat] = centerCoords;
    const targetPosition = convertGeoToVector(lon, lat);

    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 1.5,
      ease: "power2.inOut"
    });

  }, [selectedCountry, countryData, camera]);

  return null;
};

export default CameraController;