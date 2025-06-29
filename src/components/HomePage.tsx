import React from 'react';
import { Camera, Calculator } from 'lucide-react';

interface HomePageProps {
  onTakePhoto: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onTakePhoto }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Logo and Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-500/20 rounded-3xl mb-8 backdrop-blur-sm border border-blue-400/30">
          <Calculator className="w-12 h-12 text-blue-400" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-4">
          Margin Mate
        </h1>
        <p className="text-xl text-blue-200 max-w-md mx-auto leading-relaxed">
          Scan invoices and analyze quote profitability instantly
        </p>
      </div>

      {/* Camera Button */}
      <button
        onClick={onTakePhoto}
        className="w-full max-w-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl p-8 shadow-2xl transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white/20 rounded-2xl">
            <Camera className="w-12 h-12" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">Scan Invoice</div>
            <div className="text-blue-100">Take a photo to get started</div>
          </div>
        </div>
      </button>

      {/* Footer */}
      <div className="mt-16 text-center text-blue-200/60">
        Built for trade professionals
      </div>
    </div>
  );
};