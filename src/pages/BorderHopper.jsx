// src/pages/BorderHopper.jsx
import React, { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import useBorderHopperStore from '../store/borderHopperStore';
import BorderHopperGlobe from '../components/borderHopper/border-globe';
import BorderHopperAutocomplete from '../components/borderHopper/autocomplete';
import PathDisplay from '../components/borderHopper/path-display';
import WinModal from '../components/borderHopper/winModal';
import ToastNotification from '../components/borderHopper/toastNotification';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getISOCode } from '../utils/countryISOCodes';

const BorderHopper = () => {
  const {
    initializeGame,
    makeMove,
    currentPath,
    sourceCountry,
    targetCountry,
    loading,
    error
  } = useBorderHopperStore();

  const [showWinModal, setShowWinModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCountrySelect = (country) => {
    const result = makeMove(country);

    if (!result.valid) {
      setToast({
        message: 'That country is not a neighbor!',
        isError: true
      });
      return;
    }

    if (result.won) {
      setShowWinModal(true);
    }
  };

  const handlePlayAgain = () => {
    setShowWinModal(false);
    initializeGame();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef6ff] flex items-center justify-center">
        <p className="text-lg">Loading game...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#eef6ff] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const currentCountry = currentPath[currentPath.length - 1];
  const sourceISOCode = getISOCode(sourceCountry);
  const targetISOCode = getISOCode(targetCountry);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white/20"></div>
            <div className="absolute right-10 bottom-10 w-20 h-20 rounded-full bg-white/20"></div>
            <div className="absolute right-40 top-5 w-10 h-10 rounded-full bg-white/20"></div>
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold flex items-center">
              <span className="mr-2">🌍</span> Border Hopper
            </CardTitle>
            <p className="text-blue-100 text-sm">Navigate from country to country using shared borders</p>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between mt-2 bg-white/10 rounded-lg p-4">
              <div className="flex items-center mb-3 sm:mb-0">
                {sourceISOCode && (
                  <ReactCountryFlag
                    countryCode={sourceISOCode}
                    svg
                    style={{
                      width: '2em',
                      height: '2em',
                      marginRight: '0.5rem',
                      borderRadius: '4px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}
                  />
                )}
                <span className="font-bold text-lg">{sourceCountry}</span>
              </div>

              <div className="flex items-center justify-center px-4">
                <div className="h-0.5 w-10 bg-white/50 hidden sm:block"></div>
                <div className="mx-3 text-white/80 text-xl">→</div>
                <div className="h-0.5 w-10 bg-white/50 hidden sm:block"></div>
              </div>

              <div className="flex items-center">
                {targetISOCode && (
                  <ReactCountryFlag
                    countryCode={targetISOCode}
                    svg
                    style={{
                      width: '2em',
                      height: '2em',
                      marginRight: '0.5rem',
                      borderRadius: '4px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}
                  />
                )}
                <span className="font-bold text-lg">{targetCountry}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <BorderHopperGlobe selectedCountry={currentCountry} />
          </div>

          <div className="space-y-6">
            <BorderHopperAutocomplete
              onSelect={handleCountrySelect}
            />
            <PathDisplay path={currentPath} />
          </div>
        </div>

        {showWinModal && (
          <WinModal
            path={currentPath}
            onPlayAgain={handlePlayAgain}
          />
        )}

        {toast && (
          <ToastNotification
            message={toast.message}
            isError={toast.isError}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default BorderHopper;