import React from 'react';
import { Package, User, AlertTriangle } from 'lucide-react';
import { QuoteLineItem as QuoteLineItemType } from '../types/quote';

interface QuoteLineItemProps {
  item: QuoteLineItemType;
  adjustedPrice?: number;
  adjustedMarkup?: number;
}

export const QuoteLineItem: React.FC<QuoteLineItemProps> = ({ 
  item, 
  adjustedPrice = item.price, 
  adjustedMarkup = item.markup 
}) => {
  const totalPrice = adjustedPrice * item.quantity;
  const totalCost = item.cost * item.quantity;
  const profit = totalPrice - totalCost;
  const profitMargin = totalPrice > 0 ? (profit / totalPrice) * 100 : 0;

  const getItemIcon = () => {
    if (item.type === 'labour') {
      return <User className="w-4 h-4 text-blue-500" />;
    }
    return <Package className="w-4 h-4 text-green-500" />;
  };

  const getMarkupColor = () => {
    if (item.isBigTicket && adjustedMarkup > (item.maxMarkup || 25)) {
      return 'text-red-600 bg-red-50';
    }
    if (adjustedMarkup < 20) {
      return 'text-amber-600 bg-amber-50';
    }
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow ${
      item.isBigTicket ? 'border-amber-200 bg-amber-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          {getItemIcon()}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {item.name}
            </h3>
            {item.isBigTicket && (
              <div className="flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                <span className="text-xs text-amber-600">Big-ticket item</span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            ${totalPrice.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">
            Qty: {item.quantity}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-gray-500">Cost</div>
          <div className="font-medium">${item.cost.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-500">Price</div>
          <div className="font-medium">${adjustedPrice.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-500">Markup</div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${getMarkupColor()}`}>
            {adjustedMarkup.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-gray-500">Profit</div>
          <div className="font-medium text-green-600">
            ${profit.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};