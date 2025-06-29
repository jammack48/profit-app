import React, { useState } from 'react';
import { ArrowLeft, Calculator } from 'lucide-react';
import { VerticalSlider } from './VerticalSlider';
import { SimpleProfitDisplay } from './SimpleProfitDisplay';
import { CostContainer } from './CostContainer';
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-semibold text-white">Margin Simulator</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profit Summary - Top Priority */}
        <SimpleProfitDisplay results={results} />

        {/* Margin Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4">Adjust Margins</h2>
          
          <div className="grid grid-cols-3 gap-4 h-48 mb-4">
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
              max={50}
            />
          </div>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-3 gap-2">
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
      </div>
    </div>
  );
};