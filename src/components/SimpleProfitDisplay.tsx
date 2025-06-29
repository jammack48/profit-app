import React from 'react';
import { TrendingUp, User, Package, Star } from 'lucide-react';
import { CalculatedResults } from '../types/quote';
import { QuoteData, MarginSettings } from '../types/quote';

interface SimpleProfitDisplayProps {
  results: CalculatedResults;
  quoteData: QuoteData;
  marginSettings: MarginSettings;
}

export const SimpleProfitDisplay: React.FC<SimpleProfitDisplayProps> = ({ 
  results, 
  quoteData, 
  marginSettings 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NZ', { 
      style: 'currency', 
      currency: 'NZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate category breakdowns
  const getAdjustedItems = () => {
    return quoteData.lineItems.map(item => {
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
  
  // Separate items by category
  const labourItems = adjustedItems.filter(item => item.type === 'labour');
  const materialItems = adjustedItems.filter(item => item.type === 'material' && !item.isBigTicket);
  const bigTicketItems = adjustedItems.filter(item => item.isBigTicket);

  // Calculate totals for each category
  const labourCost = labourItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
  const labourPrice = labourItems.reduce((sum, item) => sum + (item.adjustedPrice * item.quantity), 0);
  
  const materialCost = materialItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
  const materialPrice = materialItems.reduce((sum, item) => sum + (item.adjustedPrice * item.quantity), 0);
  
  const bigTicketCost = bigTicketItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
  const bigTicketPrice = bigTicketItems.reduce((sum, item) => sum + (item.adjustedPrice * item.quantity), 0);

  // Get the big ticket item name for display
  const bigTicketItem = bigTicketItems[0];
  const bigTicketLabel = bigTicketItem ? 
    (bigTicketItem.name.includes('FTXM') || bigTicketItem.name.includes('Daikin') ? 'Heat Pump' : 'Big Ticket') : 
    'Big Ticket';

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-green-400" />
        <h2 className="text-lg font-bold text-gray-100">Profit Calculator</h2>
      </div>

      {/* Cost vs Price Comparison by Category */}
      <div className="space-y-4 mb-6">
        {/* Header Row */}
        <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-gray-400 border-b border-gray-700 pb-2">
          <span>Category</span>
          <span className="text-center">Raw Cost</span>
          <span className="text-center">Marked Up Price</span>
        </div>

        {/* Labour Row */}
        {labourItems.length > 0 && (
          <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-700">
            <span className="text-gray-300 flex items-center">
              <User className="w-3 h-3 text-blue-400 mr-2" />
              Labour ({labourItems.length})
            </span>
            <span className="font-medium text-gray-200 text-center">{formatCurrency(labourCost)}</span>
            <span className="font-medium text-blue-400 text-center">{formatCurrency(labourPrice)}</span>
          </div>
        )}

        {/* Materials Row */}
        {materialItems.length > 0 && (
          <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-700">
            <span className="text-gray-300 flex items-center">
              <Package className="w-3 h-3 text-green-400 mr-2" />
              Materials ({materialItems.length})
            </span>
            <span className="font-medium text-gray-200 text-center">{formatCurrency(materialCost)}</span>
            <span className="font-medium text-green-400 text-center">{formatCurrency(materialPrice)}</span>
          </div>
        )}

        {/* Big Ticket Row */}
        {bigTicketItems.length > 0 && (
          <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-700">
            <span className="text-gray-300 flex items-center">
              <Star className="w-3 h-3 text-amber-400 mr-2" />
              {bigTicketLabel} ({bigTicketItems.length})
            </span>
            <span className="font-medium text-gray-200 text-center">{formatCurrency(bigTicketCost)}</span>
            <span className="font-medium text-amber-400 text-center">{formatCurrency(bigTicketPrice)}</span>
          </div>
        )}

        {/* Totals Row */}
        <div className="grid grid-cols-3 gap-4 py-2 border-t-2 border-gray-600 font-semibold">
          <span className="text-gray-200">Total</span>
          <span className="text-gray-100 text-center">{formatCurrency(results.totalCost)}</span>
          <span className="text-white text-center">{formatCurrency(results.subtotal)}</span>
        </div>
      </div>

      {/* Additional Details */}
      <div className="space-y-2 border-t border-gray-700 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Subtotal:</span>
          <span className="font-medium text-gray-200">{formatCurrency(results.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">GST (15%):</span>
          <span className="font-medium text-gray-200">{formatCurrency(results.gstAmount)}</span>
        </div>
        
        {/* Sale Price */}
        <div className="flex justify-between items-center py-3 bg-gray-700 rounded-lg px-4 mt-4">
          <span className="text-lg font-bold text-gray-100">Sale Price</span>
          <span className="text-2xl font-bold text-blue-400">{formatCurrency(results.total)}</span>
        </div>

        {/* Profit */}
        <div className="flex justify-between items-center py-3 bg-green-900/30 rounded-lg px-4 border border-green-500/30">
          <span className="text-lg font-bold text-green-400">Profit</span>
          <span className="text-2xl font-bold text-green-400">{formatCurrency(results.grossProfit)}</span>
        </div>
        
        {/* Profit Margin Percentage */}
        <div className="text-center pt-2">
          <span className="text-sm text-gray-400">Overall Margin: </span>
          <span className="text-lg font-bold text-green-400">{results.grossProfitPercentage.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};