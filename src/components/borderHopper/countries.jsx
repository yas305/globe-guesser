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

  // Debug log to see countryFeatures structure
  console.log('countryFeatures structure:', {
    featureCount: countryFeatures?.length,
    firstFeature: countryFeatures?.[0],
    lookingFor: { source: sourceCountry, target: targetCountry },
  });

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

  console.log('Attempting to render:', Array.from(countriesToShow));

  return (
    <>
      {Array.from(countriesToShow).map(countryName => {
        // Try different property paths to find the country name
        const feature = countryFeatures.find(f => 
          f.name === countryName ||
          f.properties?.name === countryName ||
          f.properties?.ADMIN === countryName ||
          f.properties?.NAME === countryName
        );
        
        if (!feature) {
          console.log(`Could not find geometry for "${countryName}" in:`, 
            countryFeatures.slice(0, 3).map(f => ({
              name: f.name,
              properties: f.properties
            }))
          );
          return null;
        }

        const color = countryName === sourceCountry ? "#FFA500" :  // Orange for source
                     countryName === targetCountry ? "#FF0000" :   // Red for target
                     countryName === currentPath[currentPath.length - 1] ? "#00FF00" :  // Green for current
                     "#32CD32";  // Light green for visited

        return (
          <CountryGeometry
            key={countryName}
            countryData={feature}
            color={color}
          />
        );
      })}
    </>
  );
};

export default BorderCountries;