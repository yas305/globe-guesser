// src/store/borderHopperStore.js
import { create } from 'zustand';
import { getAdminBoundaryData } from '../services/countryService';

const useBorderHopperStore = create((set, get) => ({
  countryFeatures: [],
  sourceCountry: null,
  targetCountry: null,
  currentPath: [],
  loading: true,
  error: null,

  initializeGame: async () => {
    try {
      set({ loading: true, error: null });
      
      // Load both the country borders and geometry data
      const [borders, features] = await Promise.all([
        window.fs.readFile('correct_country_borders.json', { encoding: 'utf8' })
          .then(JSON.parse),
        getAdminBoundaryData()
      ]);
      
      if (!features || features.length === 0) {
        throw new Error('No country features loaded');
      }

      // Find countries that have both borders and geometry data
      const validCountries = Object.keys(borders).filter(country => 
        features.some(f => f.name === country)
      );

      // Generate source and target countries
      const source = validCountries[Math.floor(Math.random() * validCountries.length)];
      let target;
      let attempts = 0;
      
      // Find a target country that has a valid path from source
      while (attempts < 100) {
        target = validCountries[Math.floor(Math.random() * validCountries.length)];
        if (target !== source && findPath(source, target, borders)) {
          break;
        }
        attempts++;
      }

      if (!target) {
        throw new Error('Could not find valid target country');
      }

      set({
        countryFeatures: features,
        sourceCountry: source,
        targetCountry: target,
        currentPath: [source],
        borders,
        loading: false
      });
    } catch (error) {
      console.error('Game initialization error:', error);
      set({ 
        error: `Failed to initialize game: ${error.message}`, 
        loading: false 
      });
    }
  },

  makeMove: (country) => {
    const { borders, currentPath, targetCountry } = get();
    const currentCountry = currentPath[currentPath.length - 1];
    
    // Get valid neighbors
    const neighbors = borders[currentCountry] || [];
    
    // Validate move
    if (!neighbors.includes(country)) {
      return { 
        valid: false, 
        message: 'Selected country is not a neighbor' 
      };
    }

    // Check for winning move
    const isWin = country === targetCountry;
    
    set({
      currentPath: [...currentPath, country]
    });

    return {
      valid: true,
      won: isWin,
      message: isWin ? 'Congratulations! You reached the target!' : null
    };
  },

  getValidMoves: () => {
    const { borders, currentPath } = get();
    const currentCountry = currentPath[currentPath.length - 1];
    return borders[currentCountry] || [];
  }
}));

export const getBorderingCountries = (countryFeatures, countryName) => {
  // Return neighbors from the correct_country_borders.json
  const borders = countryFeatures[countryName] || [];
  return borders;
};

// Function to find a valid path between two countries
const findPath = (source, target, countryBorders) => {
  const queue = [[source]];
  const visited = new Set([source]);
  
  while (queue.length > 0) {
    const currentPath = queue.shift();
    const currentCountry = currentPath[currentPath.length - 1];
    
    if (currentCountry === target) {
      return currentPath;
    }
    
    const neighbors = countryBorders[currentCountry] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...currentPath, neighbor]);
      }
    }
  }
  
  return null;
};

// Function to generate a valid pair of countries
export const generateBorderHopperPair = (countryBorders) => {
  const countries = Object.keys(countryBorders);
  
  for (let attempts = 0; attempts < 100; attempts++) {
    const source = countries[Math.floor(Math.random() * countries.length)];
    const target = countries[Math.floor(Math.random() * countries.length)];
    
    if (source === target) continue;
    
    const path = findPath(source, target, countryBorders);
    if (path && path.length >= 3 && path.length <= 6) {
      return {
        source,
        target,
        optimalPath: path
      };
    }
  }
  
  return null;
};


export default useBorderHopperStore;