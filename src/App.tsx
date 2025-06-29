import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { VerticalSlider } from './components/VerticalSlider';
import { SimpleProfitDisplay } from './components/SimpleProfitDisplay';
import { CostContainer } from './components/CostContainer';
import { useQuoteCalculations } from './hooks/useQuoteCalculations';
import { sampleQuoteData } from './data/sampleQuote';
import { MarginSettings } from './types/quote';

function App() {
  const [marginSettings, setMarginSettings] = useState<MarginSettings>({
    labourMargin: 63.79,
    materialMargin: 88.0,
    bigTicketMargins: {
      '13': 25.0 // FTXV50U
    }
  });

  const results = useQuoteCalculations(sampleQuoteData, marginSettings);
  const bigTicketItem = sampleQuoteData.lineItems.find(item => item.isBigTicket);

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

  // Calculate adjusted items for cost containers
  const getAdjustedItems = () => {
    return sampleQuoteData.lineItems.map(item => {
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

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-4 border border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-900 rounded-lg">
            <Calculator className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">Margin Simulator</h1>
            <p className="text-sm text-gray-400">Adjust margins to see profit impact</p>
          </div>
        </div>
      </div>

      {/* Main Content - Landscape Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Controls */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
          <h2 className="text-lg font-bold text-gray-100 mb-4">Margin Controls</h2>
          
          <div className="grid grid-cols-3 gap-4 h-64 mb-4">
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
            
            <VerticalSlider
              label="Heat Pump"
              value={bigTicketMargin}
              onChange={handleBigTicketChange}
              min={0}
              max={150}
            />
          </div>

          {/* Cost Containers */}
          <div className="grid grid-cols-3 gap-4">
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
            
            <CostContainer
              title="Heat Pump"
              items={bigTicketItems}
              totalCost={bigTicketTotalCost}
              totalPrice={bigTicketTotalPrice}
              margin={bigTicketMargin}
            />
          </div>
        </div>

        {/* Results */}
        <SimpleProfitDisplay results={results} />
      </div>
    </div>
  );
}

export default App;