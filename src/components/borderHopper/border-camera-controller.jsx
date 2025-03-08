import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import useBorderHopperStore from '../../store/borderHopperStore';
import { convertGeoToVector } from '../../services/countryService';

const BorderCameraController = () => {
    const { camera, controls } = useThree();
    const animationRef = useRef(null);
    const {
        sourceCountry,
        targetCountry,
        countryFeatures,
        currentPath
    } = useBorderHopperStore();

    useEffect(() => {
        if (!countryFeatures || countryFeatures.length === 0 || !sourceCountry) return;

        // Find source and target country features
        const sourceFeature = countryFeatures.find(f => f.name === sourceCountry);
        const targetFeature = countryFeatures.find(f => f.name === targetCountry);

        if (!sourceFeature || !sourceFeature.geo_shape || !sourceFeature.geo_shape.geometry) {
            console.log('Could not find source country geometry');
            return;
        }

        // Get the center coordinates of the source country
        const sourceCoords = getCountryCenter(sourceFeature.geo_shape.geometry);

        // If we have both source and target, calculate the midpoint
        let targetPosition;
        if (targetFeature && targetFeature.geo_shape && targetFeature.geo_shape.geometry) {
            const targetCoords = getCountryCenter(targetFeature.geo_shape.geometry);

            // Calculate midpoint between source and target
            const midpointCoords = calculateMidpoint(sourceCoords, targetCoords);

            // Convert to 3D vector
            targetPosition = convertGeoToVector(midpointCoords[0], midpointCoords[1], 2.5);
        } else {
            // Just use source country
            targetPosition = convertGeoToVector(sourceCoords[0], sourceCoords[1], 2.5);
        }

        // Calculate a slightly offset position for better viewing angle
        const cameraPosition = {
            x: targetPosition.x * 1.8,
            y: targetPosition.y * 1.8,
            z: targetPosition.z * 1.8
        };

        // Cancel any existing animation
        if (animationRef.current) {
            animationRef.current.kill();
        }

        // Animate camera to look at the country with a smoother transition
        animationRef.current = gsap.to(camera.position, {
            x: cameraPosition.x,
            y: cameraPosition.y,
            z: cameraPosition.z,
            duration: 2.0,
            ease: "power2.inOut",
            onUpdate: () => {
                // Make sure camera is looking at the center of the globe
                camera.lookAt(0, 0, 0);
            },
            onComplete: () => {
                // Final adjustment to ensure we're looking at the center
                camera.lookAt(0, 0, 0);
            }
        });

    }, [sourceCountry, targetCountry, countryFeatures, camera, currentPath]);

    return null;
};

// Helper function to get the center of a country
const getCountryCenter = (countryGeometry) => {
    if (!countryGeometry?.coordinates) return [0, 0];

    try {
        const coords = countryGeometry.type === 'MultiPolygon'
            ? countryGeometry.coordinates[0][0]
            : countryGeometry.coordinates[0];

        // Calculate the average of all coordinates for a better center
        let sumLon = 0;
        let sumLat = 0;
        let count = 0;

        for (const coord of coords) {
            if (Array.isArray(coord) && coord.length >= 2) {
                sumLon += coord[0];
                sumLat += coord[1];
                count++;
            }
        }

        if (count === 0) return [0, 0];

        return [sumLon / count, sumLat / count];
    } catch (error) {
        console.error('Error calculating country center:', error);
        return [0, 0];
    }
};

// Helper function to calculate the midpoint between two coordinates
const calculateMidpoint = (coord1, coord2) => {
    // Convert to radians
    const lon1 = coord1[0] * Math.PI / 180;
    const lat1 = coord1[1] * Math.PI / 180;
    const lon2 = coord2[0] * Math.PI / 180;
    const lat2 = coord2[1] * Math.PI / 180;

    // Convert to Cartesian coordinates
    const x1 = Math.cos(lat1) * Math.cos(lon1);
    const y1 = Math.cos(lat1) * Math.sin(lon1);
    const z1 = Math.sin(lat1);

    const x2 = Math.cos(lat2) * Math.cos(lon2);
    const y2 = Math.cos(lat2) * Math.sin(lon2);
    const z2 = Math.sin(lat2);

    // Calculate midpoint in Cartesian coordinates
    const x = (x1 + x2) / 2;
    const y = (y1 + y2) / 2;
    const z = (z1 + z2) / 2;

    // Convert back to spherical coordinates
    const lon = Math.atan2(y, x);
    const hyp = Math.sqrt(x * x + y * y);
    const lat = Math.atan2(z, hyp);

    // Convert to degrees
    return [lon * 180 / Math.PI, lat * 180 / Math.PI];
};

export default BorderCameraController; 