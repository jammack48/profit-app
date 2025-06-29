import React from 'react';
import { Camera, Calculator, Zap, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onTakePhoto: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onTakePhoto }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-2xl mb-6 backdrop-blur-sm border border-blue-400/30">
            <Calculator className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Margin Mate
          </h1>
          <p className="text-lg text-blue-200 max-w-sm mx-auto leading-relaxed">
            Instantly analyze quote profitability with AI-powered invoice scanning
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-8">
        {/* Camera Button */}
        <div className="mb-8">
          <button
            onClick={onTakePhoto}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl p-6 shadow-2xl transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Camera className="w-8 h-8" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold">Scan Invoice</div>
                <div className="text-blue-100 text-sm">Take a photo to get started</div>
              </div>
              <ArrowRight className="w-6 h-6 ml-auto" />
            </div>
          </button>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Features</h2>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="font-semibold text-white">Real-time Calculations</div>
                <div className="text-sm text-gray-300">Instant profit analysis as you adjust margins</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Calculator className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="font-semibold text-white">Smart Margin Control</div>
                <div className="text-sm text-gray-300">Separate controls for labour, materials & big-ticket items</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Camera className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="font-semibold text-white">AI Invoice Scanning</div>
                <div className="text-sm text-gray-300">Automatically extract data from photos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Button */}
        <button
          onClick={onTakePhoto}
          className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl p-4 border border-white/20 backdrop-blur-sm transition-all duration-200"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="font-medium">Try Demo Data</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8">
        <div className="text-center text-sm text-blue-200/60">
          Built for trade professionals
        </div>
      </div>
    </div>
  );
};