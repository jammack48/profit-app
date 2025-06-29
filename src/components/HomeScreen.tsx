import React, { useState, useEffect } from 'react';
import { Camera, Calculator, ArrowRight, Monitor, Square, Loader2, Sparkles } from 'lucide-react';
import { QuoteData } from '../types/quote';
import { parseQuoteDataWithAI } from '../services/openaiService';

interface HomeScreenProps {
  onNavigateToSimulator: (quoteData?: QuoteData) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToSimulator }) => {
  const [rawLines, setRawLines] = useState('');
  const [parsedItems, setParsedItems] = useState<any[]>([]);
  const [dataConfirmed, setDataConfirmed] = useState(false);
  const [isParsingWithAI, setIsParsingWithAI] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // AI-powered parsing function
  async function parseWithAI() {
    if (!rawLines.trim()) {
      alert('Please paste some quote data first.');
      return;
    }
    
    setIsParsingWithAI(true);
    setParseError(null);
    
    try {
      const parsedData = await parseQuoteDataWithAI(rawLines);
      if (parsedData && parsedData.length > 0) {
        setParsedItems(parsedData);
        setDataConfirmed(false);
      } else {
        setParseError('No items could be parsed from the data. Please check the format.');
        setParsedItems([]);
      }
    } catch (error) {
      console.error('AI parsing error:', error);
      setParseError(error instanceof Error ? error.message : 'Failed to parse data with AI');
      setParsedItems([]);
    } finally {
      setIsParsingWithAI(false);
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
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-green-400" />
          <div>
            <h1 className="text-3xl font-bold text-green-200">AI Profit Calculator</h1>
            <p className="text-green-100">
              Paste your quote data and let AI intelligently parse and structure it for analysis.
            </p>
          </div>
        </div>
        
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

AI will automatically detect the format and parse the data!"
              value={rawLines}
              onChange={e => setRawLines(e.target.value)}
            />
            
            <button
              className="mt-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={parseWithAI}
              disabled={!rawLines.trim() || isParsingWithAI}
            >
              {isParsingWithAI ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI Parsing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Parse with AI
                </>
              )}
            </button>

            {parseError && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-red-200 text-sm">{parseError}</p>
                <p className="text-red-300 text-xs mt-1">
                  Make sure your OpenAI API key is set in src/services/openaiService.ts
                </p>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div>
            {parsedItems.length > 0 ? (
              <div>
                <h3 className="text-green-200 font-semibold mb-4 text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-400" />
                  AI Parsed Items ({parsedItems.length})
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
                              {item.isBigTicket && (
                                <span className="ml-1 text-amber-400">⭐</span>
                              )}
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
                      AI parsing looks correct, ready to simulate
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
                  <Sparkles className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400">Paste your quote data and click "Parse with AI" to see intelligent parsing results here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};