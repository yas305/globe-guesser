// src/components/borderHopper/winModal.jsx
import React from 'react';

const WinModal = ({ path, onPlayAgain }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-4">
          Congratulations! 🎉
        </h2>

        <div className="mb-6">
          <p className="text-center text-gray-600 mb-4">
            You found a path in {path.length - 1} moves!
          </p>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Your Path:</h3>
            <div className="flex flex-wrap gap-2">
              {path.map((country, index) => (
                <React.Fragment key={country}>
                  <span className="font-medium">{country}</span>
                  {index < path.length - 1 && (
                    <span className="text-blue-500">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onPlayAgain}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;