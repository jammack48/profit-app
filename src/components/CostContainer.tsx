import React from 'react';
import { Package, User, Zap } from 'lucide-react';

interface CostContainerProps {
  title: string;
  items: Array<{
    id: string;
    name: string;
    cost: number;
    adjustedPrice: number;
    quantity: number;
    type: 'labour' | 'material';
    isBigTicket?: boolean;
  }>;
  totalCost: number;
  totalPrice: number;
  margin: number;
}

export const CostContainer: React.FC<CostContainerProps> = ({
  title,
  items,
  totalCost,
  totalPrice,
  margin
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NZ', { 
      style: 'currency', 
      currency: 'NZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getIcon = (type: 'labour' | 'material', isBigTicket?: boolean) => {
    if (isBigTicket) return <Zap className="w-3 h-3 text-yellow-400" />;
    return type === 'labour' ? 
      <User className="w-3 h-3 text-blue-400" /> : 
      <Package className="w-3 h-3 text-green-400" />;
  };

  const profit = totalPrice - totalCost;
  const profitColor = profit > 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-white">{title}</h4>
        <div className="text-xs text-blue-400 font-medium">{margin.toFixed(1)}%</div>
      </div>
      
      <div className="space-y-1 mb-3">
        {items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center gap-1">
            {getIcon(item.type, item.isBigTicket)}
            <span className="text-xs text-white/70 truncate flex-1">
              {item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name}
            </span>
          </div>
        ))}
        {items.length > 3 && (
          <div className="text-xs text-white/50">
            +{items.length - 3} more items
          </div>
        )}
      </div>
      
      <div className="border-t border-white/10 pt-2 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-white/60">Cost:</span>
          <span className="text-white/80">{formatCurrency(totalCost)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-white/60">Price:</span>
          <span className="text-blue-400 font-medium">{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-white/60">Profit:</span>
          <span className={`font-medium ${profitColor}`}>{formatCurrency(profit)}</span>
        </div>
      </div>
    </div>
  );
};