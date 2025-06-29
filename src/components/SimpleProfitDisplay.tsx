import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
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

  const profitPercentage = results.grossProfitPercentage;
  const getProfitColor = () => {
    if (profitPercentage >= 30) return 'text-green-400';
    if (profitPercentage >= 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      {/* Sale Price - Most Important */}
      <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl p-4 mb-4 border border-blue-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-semibold text-white">Sale Price</span>
          </div>
          <div className="text-3xl font-bold text-blue-400">
            {formatCurrency(results.total)}
          </div>
        </div>
      </div>

      {/* Profit Highlight */}
      <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-4 mb-4 border border-green-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-white">Gross Profit</span>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getProfitColor()}`}>
              {formatCurrency(results.grossProfit)}
            </div>
            <div className={`text-sm ${getProfitColor()}`}>
              {profitPercentage.toFixed(1)}% margin
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Subtotal:</span>
          <span className="font-medium text-white">{formatCurrency(results.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Total Cost:</span>
          <span className="font-medium text-white">{formatCurrency(results.totalCost)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/70">GST (15%):</span>
          <span className="font-medium text-white">{formatCurrency(results.gstAmount)}</span>
        </div>
      </div>
    </div>
  );
};