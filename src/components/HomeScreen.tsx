import React, { useState } from 'react';
import { Camera, Calculator, User, ArrowRight } from 'lucide-react';

interface HomeScreenProps {
  onNavigateToSimulator: (name: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToSimulator }) => {
  const [name, setName] = useState('');
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

  const handleContinue = () => {
    if (name.trim()) {
      onNavigateToSimulator(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 flex flex-col">
      {/* Header */}
      <div className="text-center pt-8 pb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
          <Calculator className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Margin Calculator
        </h1>
        <p className="text-blue-200 text-lg">
          Professional quote analysis tool
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        {/* Photo Section */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
          <div className="text-center">
            <div className="mb-4">
              {photo ? (
                <div className="relative">
                  <img 
                    src={photo} 
                    alt="Captured" 
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-500"
                  />
                  <button
                    onClick={handleTakePhoto}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center border-4 border-gray-800 hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleTakePhoto}
                  className="w-32 h-32 bg-gray-700 rounded-full mx-auto flex items-center justify-center border-2 border-dashed border-gray-600 hover:border-blue-500 hover:bg-gray-600 transition-all group"
                >
                  <Camera className="w-8 h-8 text-gray-400 group-hover:text-blue-400" />
                </button>
              )}
            </div>
            <p className="text-gray-300 text-sm">
              {photo ? 'Tap camera icon to retake' : 'Tap to take photo'}
            </p>
          </div>
        </div>

        {/* Name Input */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-blue-400" />
            <label className="text-gray-200 font-medium">Your Name</label>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            autoComplete="name"
          />
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!name.trim()}
          className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
            name.trim()
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>Continue to Calculator</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 pb-4">
        <p className="text-gray-400 text-sm">
          Built for trade professionals
        </p>
      </div>
    </div>
  );
};