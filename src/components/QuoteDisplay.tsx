import React from 'react';
import { FileText, Download } from 'lucide-react';
import { QuoteLineItem } from './QuoteLineItem';
import { QuoteData, MarginSettings } from '../types/quote';

interface QuoteDisplayProps {
  quoteData: QuoteData;
  marginSettings: MarginSettings;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ 
  quoteData, 
  marginSettings 
}) => {
  const getAdjustedItem = (item: any) => {
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
      adjustedPrice,
      adjustedMarkup
    };
  };

  const labourItems = quoteData.lineItems.filter(item => item.type === 'labour');
  const materialItems = quoteData.lineItems.filter(item => item.type === 'material');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <FileText className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Quote Line Items</h2>
            <p className="text-gray-600">
              {quoteData.lineItems.length} items • Adjusted for margin changes
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" />
          Export Quote
        </button>
      </div>

      <div className="space-y-6">
        {labourItems.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Labour Items ({labourItems.length})
            </h3>
            <div className="space-y-3">
              {labourItems.map((item) => {
                const { adjustedPrice, adjustedMarkup } = getAdjustedItem(item);
                return (
                  <QuoteLineItem
                    key={item.id}
                    item={item}
                    adjustedPrice={adjustedPrice}
                    adjustedMarkup={adjustedMarkup}
                  />
                );
              })}
            </div>
          </div>
        )}

        {materialItems.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Material Items ({materialItems.length})
            </h3>
            <div className="space-y-3">
              {materialItems.map((item) => {
                const { adjustedPrice, adjustedMarkup } = getAdjustedItem(item);
                return (
                  <QuoteLineItem
                    key={item.id}
                    item={item}
                    adjustedPrice={adjustedPrice}
                    adjustedMarkup={adjustedMarkup}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};