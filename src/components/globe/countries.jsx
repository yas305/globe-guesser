// src/components/globe/countries.jsx
import React, { useState, useEffect } from 'react';
import { getCountryData } from '../../data/countryGeo';
import CountryGeometry from './countryGeometry';

const Countries = ({ selectedCountry, mode = 'classic', showOnlySelected = false }) => {
  const [countryFeatures, setCountryFeatures] = useState([]);
  
  useEffect(() => {
    getCountryData().then(features => {
      setCountryFeatures(features);
    });
  }, []);

  return (
    <group>
      {countryFeatures.map((feature) => {
        const isSelected = feature.properties.name.toLowerCase() === selectedCountry?.toLowerCase();
        
        // In border hopper mode with showOnlySelected, only render selected country
        if (mode === 'minimal' && showOnlySelected && !isSelected) {
          return null;
        }

        return (
          <CountryGeometry
            key={feature.properties.name}
            countryData={feature}
            selected={isSelected}
            mode={mode}
          />
        );
      })}
    </group>
  );
};

export default Countries;