import { useState, useEffect } from 'react';
import { QuoteData, MarginSettings, CalculatedResults, QuoteLineItem } from '../types/quote';

export const useQuoteCalculations = (quoteData: QuoteData, marginSettings: MarginSettings): CalculatedResults => {
  const [results, setResults] = useState<CalculatedResults>({
    subtotal: 0,
    gstAmount: 0,
    total: 0,
    totalCost: 0,
    grossProfit: 0,
    grossProfitPercentage: 0
  });

  useEffect(() => {
    const calculateAdjustedLineItems = (): QuoteLineItem[] => {
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
          markup: adjustedMarkup,
          price: adjustedPrice
        };
      });
    };

    const adjustedItems = calculateAdjustedLineItems();
    
    const subtotal = adjustedItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const totalCost = adjustedItems.reduce((sum, item) => {
      return sum + (item.cost * item.quantity);
    }, 0);
    
    const gstAmount = subtotal * quoteData.gstRate;
    const total = subtotal + gstAmount;
    const grossProfit = subtotal - totalCost;
    const grossProfitPercentage = subtotal > 0 ? (grossProfit / subtotal) * 100 : 0;

    setResults({
      subtotal,
      gstAmount,
      total,
      totalCost,
      grossProfit,
      grossProfitPercentage
    });
  }, [quoteData, marginSettings]);

  return results;
};