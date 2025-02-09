export const countryCoordinates = {
    "Brazil": { lat: -14.235, lng: -51.925 },
    "Russia": { lat: 61.524, lng: 105.319 },
    // Add more countries
  };
  
  export const getCountryPosition = (countryName) => {
    const coords = countryCoordinates[countryName];
    if (!coords) return null;
  
    const lat = coords.lat * (Math.PI / 180);
    const lng = coords.lng * (Math.PI / 180);
    
    return {
      x: -Math.cos(lat) * Math.sin(lng),
      y: Math.sin(lat),
      z: Math.cos(lat) * Math.cos(lng)
    };
  };