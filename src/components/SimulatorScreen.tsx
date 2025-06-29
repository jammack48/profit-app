import React, { useState } from 'react';
import { Calculator, ArrowLeft, Zap, AlertCircle } from 'lucide-react';
import { VerticalSlider } from './VerticalSlider';
import { SimpleProfitDisplay } from './SimpleProfitDisplay';
import { CostContainer } from './CostContainer';
import { useQuoteCalculations } from '../hooks/useQuoteCalculations';
import { sampleQuoteData } from '../data/sampleQuote';
import { MarginSettings, QuoteData } from '../types/quote';

interface SimulatorScreenProps {
  onNavigateToHome: () => void;
  quoteData?: QuoteData | null;
}

export const SimulatorScreen: React.FC<SimulatorScreenProps> = ({ 
  onNavigateToHome,
  quoteData 
}) => {
  // Use provided quote data or fall back to empty sample data
  const activeQuoteData = quoteData || sampleQuoteData;
  const hasData = activeQuoteData.lineItems.length > 0;
  
  const [marginSettings, setMarginSettings] = useState<MarginSettings>({
    labourMargin: 63.79,
    materialMargin: 88.0,
    bigTicketMargins: {}
  });

  const results = useQuoteCalculations(activeQuoteData, marginSettings);
  const bigTicketItem = activeQuoteData.lineItems.find(item => item.isBigTicket);

  const handleLabourChange = (value: number) => {
    setMarginSettings(prev => ({ ...prev, labourMargin: value }));
  };

  const handleMaterialChange = (value: number) => {
    setMarginSettings(prev => ({ ...prev, materialMargin: value }));
  };

  const handleBigTicketChange = (value: number) => {
    if (bigTicketItem) {
      setMarginSettings(prev => ({
        ...prev,
        bigTicketMargins: { ...prev.bigTicketMargins, [bigTicketItem.id]: value }
      }));
    }
  };

  const bigTicketMargin = bigTicketItem ? 
    (marginSettings.bigTicketMargins[bigTicketItem.id] ?? bigTicketItem.markup) : 0;

  const getAdjustedItems = () => {
    return activeQuoteData.lineItems.map(item => {
      let adjustedMarkup = item.markup;
      
      if (item.isBigTicket && marginSettings.bigTicketMargins[item.id] !== undefined) {
        adjustedMarkup = marginSettings.bigTicketMargins[item.id];
      } else if (item.type === 'labour') {
        adjustedMarkup = marginSettings.labourMargin;
      } else if (item.type === 'material' && !item.isBigTicket) {
        adjustedMarkup = marginSettings.materialMargin;
      }

      const adjustedPrice = item.cost * (1 + adjustedMarkup / 100);
      
      return {
        ...item,
        adjustedPrice,
        adjustedMarkup
      };
    });
  };

  const adjustedItems = getAdjustedItems();
  const labourItems = adjustedItems.filter(item => item.type === 'labour');
  const materialItems = adjustedItems.filter(item => item.type === 'material' && !item.isBigTicket);
  const bigTicketItems = adjustedItems.filter(item => item.isBigTicket);

  const labourTotalCost = labourItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
  const labourTotalPrice = labourItems.reduce((sum, item) => sum + (item.adjustedPrice * item.quantity), 0);

  const materialTotalCost = materialItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
  const materialTotalPrice = materialItems.reduce((sum, item) => sum + (item.adjustedPrice * item.quantity), 0);

  const bigTicketTotalCost = bigTicketItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
  const bigTicketTotalPrice = bigTicketItems.reduce((sum, item) => sum + (item.adjustedPrice * item.quantity), 0);

  const bigTicketLabel = bigTicketItem ? 
    (bigTicketItem.name.includes('FTXM') ? 'Heat Pump' : 
     bigTicketItem.name.includes('Daikin') ? 'Heat Pump' : 
     'Big Ticket') : 'Big Ticket';

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gray-900 p-3">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-3 mb-3 border border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={onNavigateToHome}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-900 rounded-lg">
                <Calculator className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-100">Margin Impact Simulator</h1>
                <p className="text-xs text-gray-400">No quote data loaded</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <AlertCircle className="w-3 h-3" />
              <span>Import required</span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 mx-auto border-2 border-dashed border-gray-600">
              <Calculator className="w-12 h-12 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-300 mb-3">No Quote Data</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Import a quote screenshot to start analyzing margins and calculating profits.
            </p>
            <button
              onClick={onNavigateToHome}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-lg"
            >
              Import Quote Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-3">
      {/* Compact Header for landscape */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-3 mb-3 border border-gray-700">
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateToHome}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900 rounded-lg">
              <Calculator className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-100">Margin Impact Simulator</h1>
              <p className="text-xs text-gray-400">
                {quoteData ? 'Using imported quote data' : 'No data loaded'} • {activeQuoteData.lineItems.length} items
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Zap className="w-3 h-3 text-green-500" />
            <span>Live calculations</span>
          </div>
        </div>
      </div>

      {/* Main Content - Optimized for landscape phone */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Controls */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
          <h2 className="text-lg font-bold text-gray-100 mb-3">Margin Controls</h2>
          
          <div className="grid grid-cols-3 gap-3 h-48 mb-4">
            <VerticalSlider
              label="Labour"
              value={marginSettings.labourMargin}
              onChange={handleLabourChange}
              min={0}
              max={150}
            />
            
            <VerticalSlider
              label="Materials"
              value={marginSettings.materialMargin}
              onChange={handleMaterialChange}
              min={0}
              max={150}
            />
            
            {bigTicketItem && (
              <VerticalSlider
                label={bigTicketLabel}
                value={bigTicketMargin}
                onChange={handleBigTicketChange}
                min={0}
                max={150}
              />
            )}
          </div>

          {/* Cost Containers */}
          <div className="grid grid-cols-3 gap-3">
            <CostContainer
              title="Labour"
              items={labourItems}
              totalCost={labourTotalCost}
              totalPrice={labourTotalPrice}
              margin={marginSettings.labourMargin}
            />
            
            <CostContainer
              title="Materials"
              items={materialItems}
              totalCost={materialTotalCost}
              totalPrice={materialTotalPrice}
              margin={marginSettings.materialMargin}
            />
            
            {bigTicketItems.length > 0 && (
              <CostContainer
                title={bigTicketLabel}
                items={bigTicketItems}
                totalCost={bigTicketTotalCost}
                totalPrice={bigTicketTotalPrice}
                margin={bigTicketMargin}
              />
            )}
          </div>
        </div>

        {/* Results - Now with proper category breakdown */}
        <SimpleProfitDisplay 
          results={results} 
          quoteData={activeQuoteData}
          marginSettings={marginSettings}
        />
      </div>
    </div>
  );
};