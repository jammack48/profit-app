import React, { useState } from 'react';
import { Camera, Calculator, ArrowRight } from 'lucide-react';

interface HomeScreenProps {
  onNavigateToSimulator: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToSimulator }) => {
  const [photo, setPhoto] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      {/* Landscape optimized layout */}
      <div className="flex items-center justify-between h-full max-w-6xl mx-auto">
        
        {/* Left side - App info */}
        <div className="flex-1 pr-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Margin Calculator
          </h1>
          <p className="text-blue-200 text-xl mb-8">
            Professional quote analysis tool for trade professionals
          </p>
          
          {/* Continue Button */}
          <button
            onClick={onNavigateToSimulator}
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all shadow-lg hover:shadow-xl"
          >
            <span>Open Calculator</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right side - Photo section */}
        <div className="flex-1 flex justify-center">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
            <h3 className="text-xl font-semibold text-gray-200 mb-6">
              Take Photo (Optional)
            </h3>
            
            <div className="mb-6">
              {photo ? (
                <div className="relative">
                  <img 
                    src={photo} 
                    alt="Captured" 
                    className="w-40 h-40 rounded-2xl mx-auto object-cover border-4 border-blue-500"
                  />
                  <button
                    onClick={handleTakePhoto}
                    className="absolute -bottom-3 -right-3 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center border-4 border-gray-800 hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleTakePhoto}
                  className="w-40 h-40 bg-gray-700 rounded-2xl mx-auto flex items-center justify-center border-2 border-dashed border-gray-600 hover:border-blue-500 hover:bg-gray-600 transition-all group"
                >
                  <Camera className="w-12 h-12 text-gray-400 group-hover:text-blue-400" />
                </button>
              )}
            </div>
            
            <p className="text-gray-400 text-sm">
              {photo ? 'Tap camera icon to retake photo' : 'Tap to capture quote or invoice'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};