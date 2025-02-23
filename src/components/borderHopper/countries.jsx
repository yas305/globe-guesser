// src/components/borderHopper/countries.jsx
import React from 'react';
import CountryGeometry from './countryGeometry';
import useBorderHopperStore from '../../store/borderHopperStore';

const BorderCountries = () => {
  const {
    sourceCountry,
    targetCountry,
    currentPath,
    countryFeatures
  } = useBorderHopperStore();

  if (!countryFeatures || countryFeatures.length === 0) {
    console.log('No country features available');
    return null;
  }

  // Get all countries we need to show
  const countriesToShow = new Set([
    sourceCountry,
    targetCountry,
    ...currentPath
  ]);

  return (
    <>
      {Array.from(countriesToShow).map(countryName => {
        const feature = countryFeatures.find(f => f.name === countryName);
        
        if (!feature || !feature.geo_shape || !feature.geo_shape.geometry) {
          console.log(`Could not find geometry for: ${countryName}`);
          return null;
        }

        // Pass geometry data in same format as classic mode
        const geometryData = {
          geometry: {
            type: feature.geo_shape.geometry.type,
            coordinates: feature.geo_shape.geometry.coordinates
          }
        };

        const color = countryName === sourceCountry ? "#FFA500" :  // Orange for source
                     countryName === targetCountry ? "#FF0000" :   // Red for target
                     countryName === currentPath[currentPath.length - 1] ? "#00FF00" :  // Green for current
                     "#32CD32";  // Light green for visited

        return (
          <CountryGeometry
            key={countryName}
            countryData={geometryData}
            color={color}
            opacity={1}
          />
        );
      })}
    </>
  );
};

export default BorderCountries;