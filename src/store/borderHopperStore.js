// src/store/borderHopperStore.js
import { create } from 'zustand';
import { getCountryData } from '../services/countryService';
import { getOfficialName, getCommonName } from '../utils/countryNames';

const findPath = (source, target, borders) => {
  const queue = [[source]];
  const visited = new Set([source]);
  
  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    
    if (current === target) {
      return path;
    }
    
    const neighbors = borders[current] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  
  return null;
};

const generateGamePair = (borders) => {
  const countries = Object.keys(borders);
  
  for (let attempts = 0; attempts < 100; attempts++) {
    const source = countries[Math.floor(Math.random() * countries.length)];
    const target = countries[Math.floor(Math.random() * countries.length)];
    
    if (source === target) continue;
    
    const path = findPath(source, target, borders);
    if (path && path.length >= 2 && path.length <= 5) {
      // Convert to common names for display
      return { 
        source: getCommonName(source),
        target: getCommonName(target),
        // Keep the official names for internal use
        officialSource: source,
        officialTarget: target,
        path 
      };
    }
  }
  
  return null;
};

const useBorderHopperStore = create((set, get) => ({
  sourceCountry: null,
  targetCountry: null,
  currentPath: [],
  visitedCountries: new Set(),
  countryFeatures: [],
  loading: true,
  error: null,
  borders: null,

  initializeGame: async () => {
    try {
      set({ loading: true, error: null });
      
      // Load both borders and features in parallel
      const [borders, features] = await Promise.all([
        fetch('/correct_country_borders.json').then(res => res.json()),
        getCountryData()
      ]);
      
      if (!borders || Object.keys(borders).length === 0) {
        throw new Error('No country borders data found');
      }

      const gamePair = generateGamePair(borders);
      
      if (!gamePair) {
        throw new Error('Could not generate a valid country pair');
      }

      console.log('Generated game pair:', gamePair);
      
      set({
        borders,
        countryFeatures: features,
        sourceCountry: gamePair.source,
        targetCountry: gamePair.target,
        currentPath: [gamePair.source],
        visitedCountries: new Set([gamePair.source]),
        loading: false
      });

      // Log state after setting for debugging
      console.log('Game initialized with:', {
        source: gamePair.source,
        target: gamePair.target,
        features: features.length + ' countries loaded'
      });

    } catch (error) {
      console.error('Game initialization error:', error);
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },


  makeMove: (country) => {
    const { currentPath, targetCountry, borders } = get();
    const currentCountry = currentPath[currentPath.length - 1];
    
    // Normalize both the entered country and current country names
    const normalizedCountry = getOfficialName(country);
    const normalizedCurrent = getOfficialName(currentCountry);
    
    // Get valid neighbors and normalize them
    const validMoves = borders[normalizedCurrent] || [];
    
    // Check if the normalized country name is in the valid moves
    if (!validMoves.includes(normalizedCountry)) {
      return { 
        valid: false, 
        message: 'Selected country is not a neighbor' 
      };
    }

    const isWin = normalizedCountry === getOfficialName(targetCountry);
    
    set({
      currentPath: [...currentPath, normalizedCountry]
    });

    return {
      valid: true,
      won: isWin,
      message: isWin ? 'Congratulations! You found a path!' : null
    };
  },

  getValidMoves: () => {
    const { currentPath, borders } = get();
    if (!borders || currentPath.length === 0) return [];
    const currentCountry = getOfficialName(currentPath[currentPath.length - 1]);
    return borders[currentCountry] || [];
  }
}));

export default useBorderHopperStore;