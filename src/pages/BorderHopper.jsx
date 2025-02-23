// src/pages/BorderHopper.jsx
import React, { useEffect } from 'react';
import useBorderHopperStore from '../store/borderHopperStore';
import BorderHopperGlobe from '../components/borderHopper/border-globe';
import BorderHopperAutocomplete from '../components/borderHopper/autocomplete';
import PathDisplay from '../components/borderHopper/path-display';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const BorderHopper = () => {
  const { 
    initializeGame, 
    makeMove, 
    currentPath, 
    sourceCountry, 
    targetCountry,
    loading,
    error,
    getValidMoves
  } = useBorderHopperStore();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCountrySelect = (country) => {
    const result = makeMove(country);
    if (!result.valid) {
      // Could use a toast notification here
      alert(result.message);
    }
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

  return (
    <div className="min-h-screen bg-[#eef6ff]">
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Border Hopper</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              Travel from <span className="font-bold">{sourceCountry}</span> to{' '}
              <span className="font-bold">{targetCountry}</span>
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <BorderHopperGlobe selectedCountry={currentCountry} />
          </div>
          
          <div className="space-y-6">
            <BorderHopperAutocomplete 
              onSelect={handleCountrySelect}
              suggestions={getValidMoves()}
            />
            <PathDisplay path={currentPath} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorderHopper;