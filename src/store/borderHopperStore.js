// src/store/borderHopperStore.js
import { create } from 'zustand';
import { getCountryData } from '../services/countryService';
import { getOfficialName, isSameCountry, getCommonName } from '../utils/countryNames';

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

  for (let attempts = 0; attempts < 200; attempts++) {
    const source = countries[Math.floor(Math.random() * countries.length)];
    const target = countries[Math.floor(Math.random() * countries.length)];

    if (source === target) continue;

    const sourceNeighbors = borders[source] || [];
    if (sourceNeighbors.includes(target)) continue;

    const path = findPath(source, target, borders);

    if (path && path.length >= 3 && path.length <= 6) {
      console.log(`Generated path from ${source} to ${target} with length ${path.length}`);
      return { source, target, path };
    }
  }

  console.log("Couldn't find optimal path, trying with relaxed criteria");
  for (let attempts = 0; attempts < 100; attempts++) {
    const source = countries[Math.floor(Math.random() * countries.length)];
    const target = countries[Math.floor(Math.random() * countries.length)];

    if (source === target) continue;

    const path = findPath(source, target, borders);
    if (path && path.length >= 2 && path.length <= 7) {
      console.log(`Generated fallback path from ${source} to ${target} with length ${path.length}`);
      return { source, target, path };
    }
  }

  console.log("Using last resort path generation");
  const source = countries[Math.floor(Math.random() * countries.length)];
  const target = countries[Math.floor(Math.random() * countries.length)];
  const path = findPath(source, target, borders);

  return path ? { source, target, path } : null;
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
  showHint: false,
  optimalPath: null,

  setShowHint: (show) => {
    console.log(`Setting showHint to: ${show}`);
    set({ showHint: show });
  },

  initializeGame: async () => {
    try {
      set({ loading: true, error: null, showHint: false });

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

      set({
        borders,
        countryFeatures: features,
        sourceCountry: gamePair.source,
        targetCountry: gamePair.target,
        currentPath: [gamePair.source],
        visitedCountries: new Set([gamePair.source]),
        optimalPath: gamePair.path,
        loading: false,
        showHint: false
      });

      console.log('Game initialized with:', {
        source: gamePair.source,
        target: gamePair.target,
        optimalPath: gamePair.path,
        features: features.length + ' countries loaded'
      });

    } catch (error) {
      console.error('Game initialization error:', error);
      set({
        error: error.message,
        loading: false,
        showHint: false
      });
    }
  },

  makeMove: (country) => {
    const { currentPath, targetCountry, borders } = get();
    const currentCountry = currentPath[currentPath.length - 1];

    const officialCountryName = getOfficialName(country);

    const validMoves = borders[currentCountry] || [];
    console.log('Making move:', {
      from: currentCountry,
      to: country,
      officialName: officialCountryName,
      validMoves
    });

    const isValidMove = validMoves.some(validMove =>
      validMove === officialCountryName || isSameCountry(validMove, country)
    );

    if (!isValidMove) {
      return {
        valid: false,
        message: 'Selected country is not a neighbor'
      };
    }

    const isWin = officialCountryName === targetCountry || isSameCountry(officialCountryName, targetCountry);

    set({
      currentPath: [...currentPath, officialCountryName],
      visitedCountries: new Set([...get().visitedCountries, officialCountryName])
    });

    return {
      valid: true,
      won: isWin,
      message: isWin ? 'Congratulations!' : null
    };
  },

  getValidMoves: () => {
    const { currentPath, borders } = get();
    if (!borders || currentPath.length === 0) return [];
    const currentCountry = currentPath[currentPath.length - 1];
    const validMoves = borders[currentCountry] || [];

    return validMoves.map(country => {
      const commonName = getCommonName(country);
      return commonName || country;
    });
  },

  getBorderingCountries: () => {
    const { currentPath, borders, countryFeatures } = get();
    if (!borders || currentPath.length === 0 || !countryFeatures) {
      console.log("Cannot get bordering countries - missing data");
      return [];
    }

    const currentCountry = currentPath[currentPath.length - 1];
    const borderingCountries = borders[currentCountry] || [];

    console.log(`Getting bordering countries for ${currentCountry}:`, borderingCountries);

    const result = borderingCountries
      .map(countryName => {
        const feature = countryFeatures.find(f => f.name === countryName);
        if (!feature || !feature.geo_shape || !feature.geo_shape.geometry) {
          console.log(`Could not find geometry for bordering country: ${countryName}`);
          return null;
        }

        return {
          name: countryName,
          geometry: {
            type: feature.geo_shape.geometry.type,
            coordinates: feature.geo_shape.geometry.coordinates
          }
        };
      })
      .filter(Boolean);

    console.log(`Found ${result.length} bordering countries with geometry`);
    return result;
  }
}));

export default useBorderHopperStore;