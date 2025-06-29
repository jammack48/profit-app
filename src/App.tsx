import React, { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { SimulatorScreen } from './components/SimulatorScreen';

export type Screen = 'home' | 'simulator';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [userName, setUserName] = useState('');

  const navigateToSimulator = (name: string) => {
    setUserName(name);
    setCurrentScreen('simulator');
  };

  const navigateToHome = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {currentScreen === 'home' ? (
        <HomeScreen onNavigateToSimulator={navigateToSimulator} />
      ) : (
        <SimulatorScreen 
          userName={userName} 
          onNavigateToHome={navigateToHome} 
        />
      )}
    </div>
  );
}

export default App;