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
        <h2 className="text-lg font-bold text-gray-100">Quote Summary</h2>
      </div>

      {/* Vertical Stack like Spreadsheet */}
      <div className="space-y-4">
        {/* Labour */}
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-gray-300">Labour</span>
          <span className="font-medium text-gray-100">{formatCurrency(results.totalCost * 0.35)}</span>
        </div>

        {/* Materials */}
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-gray-300">Materials</span>
          <span className="font-medium text-gray-100">{formatCurrency(results.totalCost * 0.65)}</span>
        </div>

        {/* Profit */}
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-green-400">Profit</span>
          <span className="font-bold text-green-400">{formatCurrency(results.grossProfit)}</span>
        </div>
      </div>

      {/* Additional Details */}
      <div className="mt-6 pt-4 border-t border-gray-700 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Subtotal:</span>
          <span className="font-medium text-gray-200">{formatCurrency(results.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">GST (15%):</span>
          <span className="font-medium text-gray-200">{formatCurrency(results.gstAmount)}</span>
        </div>
        
        {/* Sale Price moved here */}
        <div className="flex justify-between items-center py-3 bg-gray-700 rounded-lg px-4">
          <span className="text-lg font-bold text-gray-100">Sale Price</span>
          <span className="text-2xl font-bold text-blue-400">{formatCurrency(results.total)}</span>
        </div>
      </div>
    </div>
  );
};