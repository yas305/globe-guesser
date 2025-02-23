import React, { useState, useEffect } from 'react'
import Globe from '../components/globe/globe'
import Autocomplete from '../components/game/autocomplete'
import GuessesGrid from '../components/game/guesses-grid'
import useGameStore from '../store/gameStore'

function ClassicGame() {
    const [showingSuggestions, setShowingSuggestions] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const { initializeGame, makeGuess, isGameOver } = useGameStore();
  
    useEffect(() => {
      initializeGame();
    }, []);
  
    const handleGuess = async (country) => {
      setSelectedCountry(country);
      const guess = await makeGuess(country);
      if (guess && guess.isCorrect) {
        alert('Congratulations! You found the country!');
      } else if (isGameOver) {
        alert('Game Over! Try again!');
      }
    };
  
    const handleNewGame = () => {
      initializeGame();
      setSelectedCountry(null);
    };
  
    return (
      <div className="min-h-screen bg-[#eef6ff]">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl font-black text-white" style={{ 
              textShadow: '4px 4px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 2px 2px 0px #000'
            }}>
              Globe Guesser
            </h1>
            <button 
              onClick={handleNewGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-black px-8 py-3 rounded-xl text-lg transition-all transform hover:scale-105"
            >
              {isGameOver ? 'Play Again' : 'New Game'}
            </button>
          </div>
  
          {/* Game Container */}
          <div className="flex flex-col items-center">
            {!isGameOver && (
              <div className="w-full max-w-xl mb-6">
                <Autocomplete 
                  onSelect={handleGuess} 
                  onSuggestionsChange={setShowingSuggestions} 
                />
              </div>
            )}
            
            {/* Globe */}
            <div className="mb-8">
              <div className={`transition-all duration-300 ${
                showingSuggestions ? 'opacity-50' : 'opacity-100'
              }`}>
                <Globe selectedCountry={selectedCountry} />
              </div>
            </div>
  
            {/* Guesses Grid */}
            <div className="w-full max-w-xl">
              <GuessesGrid />
            </div>
          </div>
        </div>
      </div>
    );
  }


export default ClassicGame;