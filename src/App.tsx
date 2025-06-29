import React, { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { SimulatorScreen } from './components/SimulatorScreen';
import { QuoteData } from './types/quote';
import GoogleOcrDemo from './components/GoogleOcrDemo';

export type Screen = 'home' | 'simulator';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [currentQuoteData, setCurrentQuoteData] = useState<QuoteData | null>(null);

  const navigateToSimulator = (quoteData?: QuoteData) => {
    if (quoteData) {
      setCurrentQuoteData(quoteData);
    }
    setCurrentScreen('simulator');
  };

  const navigateToHome = () => {
    setCurrentScreen('home');
    setCurrentQuoteData(null);
  };

  return (
    <>
      <GoogleOcrDemo />
      <div className="min-h-screen bg-gray-900">
        {currentScreen === 'home' ? (
          <HomeScreen onNavigateToSimulator={navigateToSimulator} />
        ) : (
          <SimulatorScreen 
            onNavigateToHome={navigateToHome} 
            quoteData={currentQuoteData}
          />
        )}
      </div>
    </>
  );
}

export default App;