// src/components/borderHopper/path-display.jsx
import React from 'react';

const PathDisplay = ({ path = [] }) => {
  if (path.length === 0) return null;

  return (
<div className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg mt-4">
  <h2 className="text-xl font-bold mb-4">Your Path</h2>
  <div className="flex flex-wrap gap-2">
        {path.map((country, index) => (
          <React.Fragment key={country}>
            <span className="font-medium">{country}</span>
            {index < path.length - 1 && (
              <span className="text-gray-400">→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PathDisplay;