import React from 'react';
import { TrendingUp, DollarSign, Calculator, Target } from 'lucide-react';
import { CalculatedResults } from '../types/quote';

interface ProfitSummaryProps {
  results: CalculatedResults;
}

export const ProfitSummary: React.FC<ProfitSummaryProps> = ({ results }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NZ', { 
      style: 'currency', 
      currency: 'NZD' 
    }).format(amount);
  };

  const summaryCards = [
    {
      title: 'Subtotal',
      value: results.subtotal,
      icon: Calculator,
      color: 'blue',
      description: 'Pre-GST total'
    },
    {
      title: 'Total Cost',
      value: results.totalCost,
      icon: DollarSign,
      color: 'red',
      description: 'Material & labour cost'
    },
    {
      title: 'Gross Profit',
      value: results.grossProfit,
      icon: TrendingUp,
      color: 'green',
      description: `${results.grossProfitPercentage.toFixed(1)}% margin`
    },
    {
      title: 'Final Total',
      value: results.total,
      icon: Target,
      color: 'purple',
      description: 'Including GST'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <TrendingUp className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Profit Summary</h2>
          <p className="text-gray-600">Live calculation results</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`border rounded-lg p-4 ${getColorClasses(card.color)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium opacity-75">
                  {card.description}
                </span>
              </div>
              <div className="text-2xl font-bold mb-1">
                {formatCurrency(card.value)}
              </div>
              <div className="text-sm opacity-75">
                {card.title}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            GST Amount ({(15).toFixed(0)}%)
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(results.gstAmount)}
          </div>
        </div>
      </div>
    </div>
  );
};