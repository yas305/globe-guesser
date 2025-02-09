import React from 'react';
import useGameStore from '../../store/gameStore';

const GuessesGrid = () => {
  const { guesses, maxGuesses } = useGameStore();

  return (
    <div className="w-full max-w-[320px] mx-auto mt-8 bg-white rounded-3xl shadow-lg p-6">
      <h2 className="text-2xl font-black mb-4">Your Guesses</h2>
      <div className="divide-y">
        <div className="grid grid-cols-3 py-3 font-bold">
          <div>Country</div>
          <div>Distance</div>
          <div>Direction</div>
        </div>
        {guesses.map((guess, i) => (
          <div key={i} className="grid grid-cols-3 py-3">
            <div>{guess.country}</div>
            <div>{guess.distance} km</div>
            <div>{guess.direction}</div>
          </div>
        ))}
        {[...Array(maxGuesses - guesses.length)].map((_, i) => (
          <div key={i} className="grid grid-cols-3 py-3 text-gray-400">
            <div>-</div>
            <div>-</div>
            <div>-</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuessesGrid;