import React from 'react';
import { TrendingUp } from 'lucide-react';
import { CalculatedResults } from '../types/quote';

interface SimpleProfitDisplayProps {
  results: CalculatedResults;
}

export const SimpleProfitDisplay: React.FC<SimpleProfitDisplayProps> = ({ results }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NZ', { 
      style: 'currency', 
      currency: 'NZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-green-400" />
        <h2 className="text-lg font-bold text-gray-100">Profit Calc</h2>
      </div>

      {/* Cost vs Price Comparison */}
      <div className="space-y-4 mb-6">
        {/* Header Row */}
        <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-gray-400 border-b border-gray-700 pb-2">
          <span>Category</span>
          <span className="text-center">Raw Cost</span>
          <span className="text-center">Marked Up Price</span>
        </div>

        {/* Labour Row */}
        <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-700">
          <span className="text-gray-300 flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            Labour
          </span>
          <span className="font-medium text-gray-200 text-center">{formatCurrency(results.totalCost * 0.35)}</span>
          <span className="font-medium text-blue-400 text-center">{formatCurrency(results.subtotal * 0.4)}</span>
        </div>

        {/* Materials Row */}
        <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-700">
          <span className="text-gray-300 flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Materials
          </span>
          <span className="font-medium text-gray-200 text-center">{formatCurrency(results.totalCost * 0.65)}</span>
          <span className="font-medium text-green-400 text-center">{formatCurrency(results.subtotal * 0.6)}</span>
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

        {/* Profit - moved below Sale Price */}
        <div className="flex justify-between items-center py-3 bg-green-900/30 rounded-lg px-4 border border-green-500/30">
          <span className="text-lg font-bold text-green-400">Profit</span>
          <span className="text-2xl font-bold text-green-400">{formatCurrency(results.grossProfit)}</span>
        </div>
      </div>
    </div>
  );
};