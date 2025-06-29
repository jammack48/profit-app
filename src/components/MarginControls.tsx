import React from 'react';
import { Settings, AlertCircle } from 'lucide-react';
import { MarginSlider } from './MarginSlider';
import { MarginSettings } from '../types/quote';
import { QuoteLineItem } from '../types/quote';

interface MarginControlsProps {
  marginSettings: MarginSettings;
  onMarginChange: (settings: MarginSettings) => void;
  bigTicketItems: QuoteLineItem[];
}

export const MarginControls: React.FC<MarginControlsProps> = ({
  marginSettings,
  onMarginChange,
  bigTicketItems
}) => {
  const handleLabourMarginChange = (value: number) => {
    onMarginChange({
      ...marginSettings,
      labourMargin: value
    });
  };

  const handleMaterialMarginChange = (value: number) => {
    onMarginChange({
      ...marginSettings,
      materialMargin: value
    });
  };

  const handleBigTicketMarginChange = (itemId: string, value: number) => {
    onMarginChange({
      ...marginSettings,
      bigTicketMargins: {
        ...marginSettings.bigTicketMargins,
        [itemId]: value
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Settings className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Margin Controls</h2>
          <p className="text-gray-600">Adjust margins to see profit impact</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            General Margins
          </h3>
          
          <MarginSlider
            label="Labour Margin"
            value={marginSettings.labourMargin}
            onChange={handleLabourMarginChange}
            min={0}
            max={150}
            step={0.5}
          />
          
          <MarginSlider
            label="Materials Margin"
            value={marginSettings.materialMargin}
            onChange={handleMaterialMarginChange}
            min={0}
            max={150}
            step={0.5}
          />
        </div>

        {bigTicketItems.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Big-Ticket Items
              </h3>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            
            {bigTicketItems.map((item) => {
              const currentMargin = marginSettings.bigTicketMargins[item.id] ?? item.markup;
              const maxMargin = item.maxMarkup || 25;
              const warning = currentMargin > maxMargin ? `Max ${maxMargin}%` : undefined;
              
              return (
                <div key={item.id} className="bg-amber-50 rounded-lg p-4">
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      Cost: ${item.cost.toFixed(2)} • Recommended max: {maxMargin}%
                    </p>
                  </div>
                  
                  <MarginSlider
                    label="Markup"
                    value={currentMargin}
                    onChange={(value) => handleBigTicketMarginChange(item.id, value)}
                    min={0}
                    max={Math.max(maxMargin * 2, 50)}
                    step={0.1}
                    warning={warning}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};