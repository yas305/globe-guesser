// src/services/classicGameService.js
export const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Earth's radius in km
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };
  
  export const getDirection = (from, to) => {
    const [fromLon, fromLat] = from;
    const [toLon, toLat] = to;
    
    const latDiff = toLat - fromLat;
    const lonDiff = toLon - fromLon;
    
    // Handle crossing the 180th meridian
    const adjustedLonDiff = lonDiff > 180 ? lonDiff - 360 : 
                           lonDiff < -180 ? lonDiff + 360 : lonDiff;
  
    if (Math.abs(latDiff) < 5 && Math.abs(adjustedLonDiff) < 5) return '🎯';
    
    if (Math.abs(latDiff) < 5) return adjustedLonDiff > 0 ? '➡️' : '⬅️';
    if (Math.abs(adjustedLonDiff) < 5) return latDiff > 0 ? '⬆️' : '⬇️';
    
    if (latDiff > 0 && adjustedLonDiff > 0) return '↗️';
    if (latDiff > 0 && adjustedLonDiff < 0) return '↖️';
    if (latDiff < 0 && adjustedLonDiff > 0) return '↘️';
    return '↙️';
  };