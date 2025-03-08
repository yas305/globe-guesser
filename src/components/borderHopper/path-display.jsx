// src/components/borderHopper/path-display.jsx
import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { getISOCode } from '../../utils/countryISOCodes';

const PathDisplay = ({ path = [] }) => {
  if (path.length === 0) return null;

  return (
    <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg mt-4">
      <h2 className="text-xl font-bold mb-4">Your Path</h2>
      <div className="flex flex-wrap items-center gap-2">
        {path.map((country, index) => {
          const isoCode = getISOCode(country);
          return (
            <React.Fragment key={country}>
              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1.5">
                {isoCode && (
                  <ReactCountryFlag
                    countryCode={isoCode}
                    svg
                    style={{
                      width: '1.2em',
                      height: '1.2em',
                      marginRight: '0.5rem',
                    }}
                  />
                )}
                <span className="font-medium">{country}</span>
              </div>
              {index < path.length - 1 && (
                <span className="text-blue-500">→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PathDisplay;