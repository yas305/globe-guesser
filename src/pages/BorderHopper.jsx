// src/pages/BorderHopper.jsx
import React, { useEffect, useState } from 'react';
import useBorderHopperStore from '../store/borderHopperStore';
import BorderHopperGlobe from '../components/borderHopper/border-globe';
import BorderHopperAutocomplete from '../components/borderHopper/autocomplete';
import PathDisplay from '../components/borderHopper/path-display';
import WinModal from '../components/borderHopper/winModal';
import ToastNotification from '../components/borderHopper/toastNotification';

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

  return (
    <div className="min-h-screen bg-[#eef6ff]">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Border Hopper</h1>
          <p className="text-lg">
            Travel from <span className="font-bold">{sourceCountry}</span> to{' '}
            <span className="font-bold">{targetCountry}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <BorderHopperGlobe />
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