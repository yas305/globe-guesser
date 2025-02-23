// src/utils/countryUtils.js
import * as turf from '@turf/turf';

export const findBorderingCountries = (countryFeatures) => {
  const borderMap = new Map();

  // Process each country
  countryFeatures.forEach(country => {
    const countryName = country.properties.name;
    const neighbors = new Set();

    // Check against all other countries
    countryFeatures.forEach(otherCountry => {
      if (country === otherCountry) return;

      try {
        // Convert to turf features
        const poly1 = turf.feature(country.geometry);
        const poly2 = turf.feature(otherCountry.geometry);

        // Check if they intersect
        const intersection = turf.booleanIntersects(poly1, poly2);
        
        if (intersection) {
          neighbors.add(otherCountry.properties.name);
        }
      } catch (error) {
        console.error(`Error processing border between ${countryName} and ${otherCountry.properties.name}:`, error);
      }
    });

    borderMap.set(countryName, Array.from(neighbors));
  });

  return borderMap;
};

export const findPath = (source, target, borderMap) => {
  const visited = new Set();
  const queue = [[source]];
  
  while (queue.length > 0) {
    const currentPath = queue.shift();
    const currentCountry = currentPath[currentPath.length - 1];
    
    if (currentCountry === target) {
      return currentPath;
    }
    
    if (!visited.has(currentCountry)) {
      visited.add(currentCountry);
      const neighbors = borderMap.get(currentCountry) || [];
      
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push([...currentPath, neighbor]);
        }
      }
    }
  }
  
  return null; // No path found
};

export const validateMove = (currentCountry, nextCountry, borderMap) => {
  const neighbors = borderMap.get(currentCountry) || [];
  return neighbors.includes(nextCountry);
};

export const generateGamePair = (borderMap) => {
  const countries = Array.from(borderMap.keys());
  let source, target, path;
  
  // Keep trying until we find a pair with a valid path
  do {
    source = countries[Math.floor(Math.random() * countries.length)];
    target = countries[Math.floor(Math.random() * countries.length)];
    path = findPath(source, target, borderMap);
  } while (!path || path.length < 3 || path.length > 8); // Ensure reasonable path length
  
  return { source, target };
};