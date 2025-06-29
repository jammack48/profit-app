import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { SimulatorPage } from './components/SimulatorPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'simulator'>('home');
  const [quoteData, setQuoteData] = useState(null);

  const handleTakePhoto = () => {
    // Placeholder for camera functionality
    console.log('Camera functionality will be implemented with Capacitor');
    // For now, simulate loading data and navigate to simulator
    setCurrentPage('simulator');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setQuoteData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {currentPage === 'home' ? (
        <HomePage onTakePhoto={handleTakePhoto} />
      ) : (
        <SimulatorPage onBack={handleBackToHome} />
      )}
    </div>
  );
}

export default App;