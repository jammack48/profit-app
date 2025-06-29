import React, { useState, useEffect } from 'react';
import { Camera, Calculator, ArrowRight } from 'lucide-react';

interface HomeScreenProps {
  onNavigateToSimulator: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToSimulator }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [matrixChars, setMatrixChars] = useState<string[]>([]);

  // Generate Matrix-style characters
  useEffect(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const generateChars = () => {
      const newChars = [];
      for (let i = 0; i < 50; i++) {
        newChars.push(chars[Math.floor(Math.random() * chars.length)]);
      }
      setMatrixChars(newChars);
    };

    generateChars();
    const interval = setInterval(generateChars, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTakePhoto = async () => {
    try {
      // For web testing, we'll use a file input
      // In Capacitor, this will be replaced with Camera.getPhoto()
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPhoto(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
      
      input.click();
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Matrix Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-green-900">
        {/* Animated Matrix Characters */}
        <div className="absolute inset-0 opacity-10">
          {matrixChars.map((char, index) => (
            <div
              key={index}
              className="absolute text-green-400 font-mono text-sm animate-pulse"
              style={{
                left: `${(index * 7) % 100}%`,
                top: `${(index * 13) % 100}%`,
                animationDelay: `${index * 0.1}s`,
                animationDuration: `${2 + (index % 3)}s`
              }}
            >
              {char}
            </div>
          ))}
        </div>
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Scanning Line Effect */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-30 animate-pulse" 
               style={{ 
                 top: '30%',
                 animation: 'scan 4s linear infinite'
               }} />
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen bg-black bg-opacity-40 p-6">
        {/* Landscape optimized layout */}
        <div className="flex items-center justify-between h-full max-w-6xl mx-auto">
          
          {/* Left side - App info */}
          <div className="flex-1 pr-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4 shadow-lg shadow-green-500/25">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
              Margin Calculator
            </h1>
            <p className="text-green-200 text-xl mb-8 drop-shadow-md">
              Professional quote analysis tool for trade professionals
            </p>
            
            {/* Continue Button */}
            <button
              onClick={onNavigateToSimulator}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 px-8 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all shadow-lg hover:shadow-xl shadow-green-500/25 hover:shadow-green-500/40 border border-green-500/30"
            >
              <span>Open Calculator</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right side - Photo section */}
          <div className="flex-1 flex justify-center">
            <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 text-center shadow-xl shadow-green-500/10">
              <h3 className="text-xl font-semibold text-green-100 mb-6 drop-shadow-md">
                Take Photo (Optional)
              </h3>
              
              <div className="mb-6">
                {photo ? (
                  <div className="relative">
                    <img 
                      src={photo} 
                      alt="Captured" 
                      className="w-40 h-40 rounded-2xl mx-auto object-cover border-4 border-green-500 shadow-lg shadow-green-500/25"
                    />
                    <button
                      onClick={handleTakePhoto}
                      className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center border-4 border-black hover:from-green-700 hover:to-blue-700 transition-all shadow-lg shadow-green-500/25"
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleTakePhoto}
                    className="w-40 h-40 bg-black bg-opacity-60 rounded-2xl mx-auto flex items-center justify-center border-2 border-dashed border-green-500/50 hover:border-green-400 hover:bg-opacity-80 transition-all group shadow-lg shadow-green-500/10"
                  >
                    <Camera className="w-12 h-12 text-green-400 group-hover:text-green-300" />
                  </button>
                )}
              </div>
              
              <p className="text-green-300 text-sm drop-shadow-sm">
                {photo ? 'Tap camera icon to retake photo' : 'Tap to capture quote or invoice'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};