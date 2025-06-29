import React, { useState, useEffect } from 'react';
import { Camera, Calculator, ArrowRight, Monitor, Square, Loader2 } from 'lucide-react';
import { QuoteData } from '../types/quote';
import { createWorker } from 'tesseract.js';

interface HomeScreenProps {
  onNavigateToSimulator: (quoteData?: QuoteData) => void;
}

// Simple and robust parsing function for pasted quote data
const parseSimpleQuoteData = (text: string): QuoteData | null => {
  try {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const lineItems: any[] = [];
    
    for (const line of lines) {
      // Skip obvious header/summary lines
      if (line.toLowerCase().includes('name') && line.toLowerCase().includes('quantity')) continue;
      if (line.toLowerCase().includes('subtotal')) continue;
      if (line.toLowerCase().includes('gst amount')) continue;
      if (line.toLowerCase().includes('total') && line.includes('$')) continue;
      if (line.match(/^\$[\d,]+\.[\d]+$/)) continue;
      
      // Try to extract numbers from the line
      const numbers = line.match(/\d+\.?\d*/g);
      if (!numbers || numbers.length < 4) continue;
      
      // Get the name (everything before the first number)
      const firstNumberIndex = line.search(/\d/);
      if (firstNumberIndex === -1) continue;
      
      const name = line.substring(0, firstNumberIndex).trim();
      if (!name) continue;
      
      // Parse the numbers - expect at least quantity, cost, price
      const quantity = parseFloat(numbers[0]);
      const cost = parseFloat(numbers[1]);
      const price = parseFloat(numbers[2]);
      
      // Calculate markup if not provided
      let markup = 0;
      if (numbers.length > 3 && numbers[3].includes('.')) {
        markup = parseFloat(numbers[3]);
      } else if (cost > 0) {
        markup = ((price - cost) / cost) * 100;
      }
      
      // Determine item type
      const type = name.toLowerCase().includes('labour') || name.toLowerCase().includes('labor') ? 'labour' : 'material';
      
      // Check if big ticket item
      const isBigTicket = cost > 500 || name.toLowerCase().includes('daikin') || name.toLowerCase().includes('heat pump');
      
      lineItems.push({
        id: (lineItems.length + 1).toString(),
        name: name,
        type: type,
        quantity: quantity,
        cost: cost,
        price: price,
        markup: markup,
        tax: 15,
        discount: 0,
        total: quantity * price,
        isBigTicket: isBigTicket,
        maxMarkup: isBigTicket ? 25 : undefined
      });
    }
    
    if (lineItems.length > 0) {
      return {
        gstRate: 0.15,
        lineItems
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing quote data:', error);
    return null;
  }
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToSimulator }) => {
  const [rawLines, setRawLines] = useState('');
  const [parsedItems, setParsedItems] = useState<any[]>([]);
  const [dataConfirmed, setDataConfirmed] = useState(false);

  // Simple parsing function for pasted lines
  function parsePastedLines() {
    if (!rawLines.trim()) {
      alert('Please paste some quote data first.');
      return;
    }
    
    const parsedData = parseSimpleQuoteData(rawLines);
    if (parsedData && parsedData.lineItems.length > 0) {
      setParsedItems(parsedData.lineItems);
      setDataConfirmed(false);
    } else {
      alert('Could not parse the pasted data. Please make sure each line contains at least: Name, Quantity, Cost, Price');
      setParsedItems([]);
    }
  }

  function handleConfirmAndSimulate() {
    if (parsedItems.length > 0) {
      onNavigateToSimulator({
        gstRate: 0.15,
        lineItems: parsedItems
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="max-w-6xl w-full mx-auto bg-gray-800 rounded-xl border border-green-700 p-6">
        <h1 className="text-3xl font-bold text-green-200 mb-4">Quote Data Input</h1>
        <p className="text-green-100 mb-6">
          Simply copy and paste your quote data from any spreadsheet or table. The app will automatically detect and parse the line items.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div>
            <label className="block text-green-200 font-semibold mb-2">Paste Quote Data:</label>
            <textarea
              className="w-full h-64 p-4 rounded bg-black text-green-200 border border-green-700 font-mono text-sm resize-none"
              placeholder="Paste your quote data here...

Example:
Labour - Dave	8.00	58.00	95.00	63.79%	15%	0%	760.00
Switch isolator 20A	1.00	12.15	81.00	566.67%	15%	0%	81.00
Daikin FTXM35U	1.00	1120.00	1344.00	20.00%	15%	0%	1344.00

Just paste the rows from your quote table - the app will figure out the format!"
              value={rawLines}
              onChange={e => setRawLines(e.target.value)}
            />
            
            <button
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              onClick={parsePastedLines}
              disabled={!rawLines.trim()}
            >
              Parse Quote Data
            </button>
          </div>

          {/* Preview Section */}
          <div>
            {parsedItems.length > 0 ? (
              <div>
                <h3 className="text-green-200 font-semibold mb-4 text-lg">
                  Parsed Items ({parsedItems.length})
                </h3>
                
                <div className="bg-black bg-opacity-40 rounded-lg border border-green-700 max-h-64 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-green-900 bg-opacity-50 sticky top-0">
                      <tr>
                        <th className="px-2 py-2 text-left text-green-200">Name</th>
                        <th className="px-2 py-2 text-center text-green-200">Type</th>
                        <th className="px-2 py-2 text-center text-green-200">Qty</th>
                        <th className="px-2 py-2 text-center text-green-200">Cost</th>
                        <th className="px-2 py-2 text-center text-green-200">Price</th>
                        <th className="px-2 py-2 text-center text-green-200">Markup</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-green-900 hover:bg-green-900 hover:bg-opacity-20">
                          <td className="px-2 py-2 text-gray-200 max-w-32">
                            <div className="truncate" title={item.name}>
                              {item.name}
                            </div>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <span className={`px-1 py-0.5 rounded text-xs ${
                              item.type === 'labour' 
                                ? 'bg-blue-900 text-blue-200' 
                                : 'bg-green-900 text-green-200'
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-center text-gray-200">{item.quantity}</td>
                          <td className="px-2 py-2 text-center text-gray-200">${item.cost.toFixed(2)}</td>
                          <td className="px-2 py-2 text-center text-gray-200">${item.price.toFixed(2)}</td>
                          <td className="px-2 py-2 text-center text-gray-200">{item.markup.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="confirm-data" 
                      checked={dataConfirmed} 
                      onChange={e => setDataConfirmed(e.target.checked)}
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                    />
                    <label htmlFor="confirm-data" className="text-green-200 text-sm">
                      Data looks correct, ready to simulate
                    </label>
                  </div>
                  
                  <button
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all shadow-lg ${
                      dataConfirmed 
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 transform hover:scale-105' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={handleConfirmAndSimulate}
                    disabled={!dataConfirmed}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Launch Margin Simulator
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Calculator className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400">Paste your quote data and click "Parse Quote Data" to see the preview here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};