import React from 'react';
import { Package, User } from 'lucide-react';

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

  const getIcon = (type: 'labour' | 'material') => {
    return type === 'labour' ? 
      <User className="w-3 h-3 text-blue-400" /> : 
      <Package className="w-3 h-3 text-green-400" />;
  };

  // Create array of 5 items, padding with empty items if needed
  const paddedItems = [...items];
  while (paddedItems.length < 5) {
    paddedItems.push({
      id: `empty-${paddedItems.length}`,
      name: '',
      cost: 0,
      adjustedPrice: 0,
      quantity: 0,
      type: 'material' as const,
      isEmpty: true
    });
  }

  return (
    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-200">{title}</h4>
        <div className="text-xs text-gray-400">{margin.toFixed(1)}%</div>
      </div>
      
      <div className="space-y-1 mb-2 h-20">
        {paddedItems.slice(0, 5).map((item, index) => (
          <div key={item.id || `empty-${index}`} className="flex items-center justify-between text-xs h-3.5">
            {!item.isEmpty && (
              <>
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  {getIcon(item.type)}
                  <span className="truncate text-gray-300">
                    {item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name}
                  </span>
                </div>
                <div className="text-right ml-1">
                  <div className="font-medium text-gray-100">
                    {formatCurrency(item.adjustedPrice * item.quantity)}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-700 pt-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Cost:</span>
          <span>{formatCurrency(totalCost)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold">
          <span className="text-gray-200">Price:</span>
          <span className="text-blue-400">{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
};