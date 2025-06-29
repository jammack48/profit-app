import React, { useState } from 'react';
import { Calculator, Zap, ArrowLeft } from 'lucide-react';
import { MarginControls } from './MarginControls';
import { QuoteDisplay } from './QuoteDisplay';
import { ProfitSummary } from './ProfitSummary';
import { useQuoteCalculations } from '../hooks/useQuoteCalculations';
import { sampleQuoteData } from '../data/sampleQuote';
import { MarginSettings } from '../types/quote';

interface SimulatorPageProps {
  onBack: () => void;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({ onBack }) => {
  const [marginSettings, setMarginSettings] = useState<MarginSettings>({
    labourMargin: 63.79,
    materialMargin: 88.0,
    bigTicketMargins: {
      '13': 25.0 // FTXV50U
    }
  });

  const results = useQuoteCalculations(sampleQuoteData, marginSettings);
  const bigTicketItems = sampleQuoteData.lineItems.filter(item => item.isBigTicket);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Margin Impact Simulator
                </h1>
                <p className="text-sm text-gray-600">
                  Analyze quote profitability in real-time
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Zap className="w-4 h-4 text-green-500" />
              <span>Live calculations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1">
            <MarginControls
              marginSettings={marginSettings}
              onMarginChange={setMarginSettings}
              bigTicketItems={bigTicketItems}
            />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-8">
            <ProfitSummary results={results} />
            <QuoteDisplay 
              quoteData={sampleQuoteData} 
              marginSettings={marginSettings}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Margin Impact Simulator • Built for trade professionals
            </div>
            <div className="flex items-center gap-4">
              <span>Sample Quote Data</span>
              <span>•</span>
              <span>Real-time Calculations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};