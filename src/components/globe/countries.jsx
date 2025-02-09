import React, { useState, useEffect } from 'react';
import { getCountryData } from '../../data/countryGeo';
import CountryGeometry from './countryGeometry';


const Countries = ({ selectedCountry }) => {
  const [countryFeatures, setCountryFeatures] = useState([]);
  
  useEffect(() => {
    getCountryData().then(features => {
      console.log('Available countries:', features.map(f => f.properties.name));
      setCountryFeatures(features);
    });
  }, []);

  return (
    <group>
      {countryFeatures.map((feature) => {
        const isSelected = feature.properties.name.toLowerCase() === selectedCountry?.toLowerCase();
        return (
          <CountryGeometry
            key={feature.properties.name}
            countryData={feature}
            selected={isSelected}
          />
        );
      })}
    </group>
  );
};
export default Countries