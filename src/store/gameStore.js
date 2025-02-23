import { create } from 'zustand';
import { getCountryData } from '../services/countryService';
import { calculateDistance, getDirection } from '../services/classicGameService';

const getCenterCoordinates = (geometry) => {
  if (!geometry?.coordinates) return null;

  try {
    if (geometry.type === 'MultiPolygon') {
      // Get the largest polygon for MultiPolygon
      const polygons = geometry.coordinates;
      let maxArea = 0;
      let mainPolygon = polygons[0];
      
      polygons.forEach(polygon => {
        const area = polygon[0].length;
        if (area > maxArea) {
          maxArea = area;
          mainPolygon = polygon;
        }
      });
      
      const coordinates = mainPolygon[0];
      const centerIndex = Math.floor(coordinates.length / 2);
      return coordinates[centerIndex];
    } else {
      // For single Polygon
      const coordinates = geometry.coordinates[0];
      const centerIndex = Math.floor(coordinates.length / 2);
      return coordinates[centerIndex];
    }
  } catch (error) {
    console.error('Error extracting coordinates:', error);
    return null;
  }
};

const useGameStore = create((set, get) => ({
  targetCountry: null,
  guesses: [],
  isGameOver: false,
  maxGuesses: 6,

  initializeGame: async () => {
    const features = await getCountryData();
    const randomCountry = features[Math.floor(Math.random() * features.length)];
    set({
      targetCountry: randomCountry,
      guesses: [],
      isGameOver: false
    });
    return randomCountry;
  },

  makeGuess: async (guessedCountryName) => {
    const state = get();
    if (state.isGameOver) return null;

    const features = await getCountryData();
    const guessedCountry = features.find(f => 
      f.properties.name.toLowerCase() === guessedCountryName.toLowerCase()
    );

    if (!guessedCountry || !state.targetCountry) return null;

    const guessCenter = getCenterCoordinates(guessedCountry.geometry);
    const targetCenter = getCenterCoordinates(state.targetCountry.geometry);

    if (!guessCenter || !targetCenter) {
      console.error('Failed to get coordinates for countries');
      return null;
    }

    const distance = calculateDistance(guessCenter, targetCenter);
    const direction = getDirection(guessCenter, targetCenter);

    const newGuess = {
      country: guessedCountryName,
      distance,
      direction,
      isCorrect: distance === 0
    };

    const newGuesses = [...state.guesses, newGuess];
    const isGameOver = newGuess.isCorrect || newGuesses.length >= state.maxGuesses;

    set({
      guesses: newGuesses,
      isGameOver
    });

    return newGuess;
  }
}));

export default useGameStore;