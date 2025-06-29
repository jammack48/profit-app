import React, { useState, useEffect } from 'react';
import { Camera, Calculator, ArrowRight, Monitor, Square, Loader2 } from 'lucide-react';
import { QuoteData } from '../types/quote';
import { createWorker } from 'tesseract.js';

interface HomeScreenProps {
  onNavigateToSimulator: (quoteData?: QuoteData) => void;
}

// Sample quote variations to simulate different types of jobs
const sampleQuotes = {
  electrical: {
    gstRate: 0.15,
    lineItems: [
      {
        id: '1',
        name: 'Labour - Dave',
        type: 'labour' as const,
        quantity: 8.00,
        cost: 58.00,
        price: 95.00,
        markup: 63.79,
        tax: 15,
        discount: 0
      },
      {
        id: '2',
        name: '55650320 Switch isolator 20A 2P IP66 small NL120S N-line',
        type: 'material' as const,
        quantity: 1.00,
        cost: 12.15,
        price: 81.00,
        markup: 566.67,
        tax: 15,
        discount: 0
      },
      {
        id: '3',
        name: '30800040 Conduit flex 25mm uPVC GY prm 25m 30.25G Marley',
        type: 'material' as const,
        quantity: 5.00,
        cost: 2.17,
        price: 12.03,
        markup: 454.38,
        tax: 15,
        discount: 0
      },
      {
        id: '4',
        name: '41412000 Anchor wall dog 38mm SQ pk26 ELWDSA38SD Elmark',
        type: 'material' as const,
        quantity: 1.00,
        cost: 15.87,
        price: 24.83,
        markup: 56.46,
        tax: 15,
        discount: 0
      },
      {
        id: '5',
        name: '49140020 Tape duct 48mmx30m utility BK 330282027 Tiki Tape',
        type: 'material' as const,
        quantity: 1.00,
        cost: 10.82,
        price: 14.42,
        markup: 33.27,
        tax: 15,
        discount: 0
      },
      {
        id: '6',
        name: '44320220 Cable tie std 200x4.0mm NAT pk100 EL3004 Elmark',
        type: 'material' as const,
        quantity: 0.10,
        cost: 16.46,
        price: 41.16,
        markup: 149.70,
        tax: 15,
        discount: 0
      },
      {
        id: '7',
        name: '48450040 Silicone industrial 300ml CL 30804311 Bostik',
        type: 'material' as const,
        quantity: 0.50,
        cost: 18.08,
        price: 24.10,
        markup: 33.30,
        tax: 15,
        discount: 0
      },
      {
        id: '8',
        name: 'Labour - Electrician',
        type: 'labour' as const,
        quantity: 8.00,
        cost: 58.00,
        price: 99.00,
        markup: 70.69,
        tax: 15,
        discount: 0
      },
      {
        id: '9',
        name: 'misc',
        type: 'material' as const,
        quantity: 1.00,
        cost: 0.00,
        price: 200.00,
        markup: 0.00,
        tax: 15,
        discount: 0
      }
    ]
  },
  hvac: {
    gstRate: 0.15,
    lineItems: [
      {
        id: '1',
        name: 'Labour - Dave',
        type: 'labour' as const,
        quantity: 6.00,
        cost: 58.00,
        price: 95.00,
        markup: 63.79,
        tax: 15,
        discount: 0
      },
      {
        id: '2',
        name: 'Daikin FTXM35U Heat Pump',
        type: 'material' as const,
        quantity: 1.00,
        cost: 1120.00,
        price: 1344.00,
        markup: 20.00,
        tax: 15,
        discount: 0,
        isBigTicket: true,
        maxMarkup: 25
      },
      {
        id: '3',
        name: 'Wifi Module',
        type: 'material' as const,
        quantity: 1.00,
        cost: 118.00,
        price: 141.60,
        markup: 20.00,
        tax: 15,
        discount: 0
      },
      {
        id: '4',
        name: 'Installation Kit',
        type: 'material' as const,
        quantity: 1.00,
        cost: 85.00,
        price: 159.80,
        markup: 88.00,
        tax: 15,
        discount: 0
      }
    ]
  }
};

// Enhanced parsing function for standard tabular format
const parseStandardQuoteFormat = (text: string): QuoteData | null => {
  try {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const lineItems: any[] = [];
    
    // Skip header line if present
    let startIndex = 0;
    if (lines[0] && lines[0].toLowerCase().includes('name') && lines[0].toLowerCase().includes('quantity')) {
      startIndex = 1;
    }
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip summary lines (Subtotal, GST Amount, Total)
      if (line.toLowerCase().includes('subtotal') || 
          line.toLowerCase().includes('gst') || 
          line.toLowerCase().includes('total') ||
          line.match(/^\$[\d,]+\.[\d]+$/)) {
        continue;
      }
      
      // Parse each line - handle various formats
      const parsed = parseQuoteLine(line);
      if (parsed) {
        lineItems.push({
          id: (lineItems.length + 1).toString(),
          ...parsed,
          type: determineItemType(parsed.name),
          tax: 15,
          discount: 0,
          isBigTicket: isBigTicketItem(parsed.name, parsed.cost),
          maxMarkup: isBigTicketItem(parsed.name, parsed.cost) ? 25 : undefined
        });
      }
    }
    
    if (lineItems.length > 0) {
      return {
        gstRate: 0.15,
        lineItems
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing standard quote format:', error);
    return null;
  }
};

// Parse individual quote line with multiple format support
const parseQuoteLine = (line: string) => {
  // Remove extra whitespace and normalize
  line = line.replace(/\s+/g, ' ').trim();
  
  // Try different parsing patterns
  
  // Pattern 1: Tab-separated or multiple spaces
  const tabPattern = /^(.+?)\s+(\d+\.?\d*)\s+\$?([\d,]+\.?\d*)\s+\$?([\d,]+\.?\d*)\s+([\d.]+)%\s+(\d+)%\s+(\d+)%\s+\$?([\d,]+\.?\d*)$/;
  let match = line.match(tabPattern);
  
  if (match) {
    return {
      name: match[1].trim(),
      quantity: parseFloat(match[2]),
      cost: parseFloat(match[3].replace(/,/g, '')),
      price: parseFloat(match[4].replace(/,/g, '')),
      markup: parseFloat(match[5]),
      total: parseFloat(match[8].replace(/,/g, ''))
    };
  }
  
  // Pattern 2: More flexible spacing
  const flexPattern = /^(.+?)\s+(\d+\.?\d*)\s+\$?([\d,]+\.?\d*)\s+\$?([\d,]+\.?\d*)\s+([\d.]+)%/;
  match = line.match(flexPattern);
  
  if (match) {
    const quantity = parseFloat(match[2]);
    const cost = parseFloat(match[3].replace(/,/g, ''));
    const price = parseFloat(match[4].replace(/,/g, ''));
    
    return {
      name: match[1].trim(),
      quantity,
      cost,
      price,
      markup: parseFloat(match[5]),
      total: quantity * price
    };
  }
  
  // Pattern 3: Simple format with just name, quantity, cost, price
  const simplePattern = /^(.+?)\s+(\d+\.?\d*)\s+\$?([\d,]+\.?\d*)\s+\$?([\d,]+\.?\d*)$/;
  match = line.match(simplePattern);
  
  if (match) {
    const quantity = parseFloat(match[2]);
    const cost = parseFloat(match[3].replace(/,/g, ''));
    const price = parseFloat(match[4].replace(/,/g, ''));
    const markup = cost > 0 ? ((price - cost) / cost) * 100 : 0;
    
    return {
      name: match[1].trim(),
      quantity,
      cost,
      price,
      markup,
      total: quantity * price
    };
  }
  
  return null;
};

// Determine if item is labour or material
const determineItemType = (name: string): 'labour' | 'material' => {
  const labourKeywords = ['labour', 'labor', 'electrician', 'technician', 'installer', 'worker'];
  const nameLower = name.toLowerCase();
  
  return labourKeywords.some(keyword => nameLower.includes(keyword)) ? 'labour' : 'material';
};

// Determine if item is big-ticket (high value items that typically have lower margins)
const isBigTicketItem = (name: string, cost: number): boolean => {
  const bigTicketKeywords = ['daikin', 'mitsubishi', 'panasonic', 'heat pump', 'air conditioner', 'hvac unit'];
  const nameLower = name.toLowerCase();
  
  // Check by name keywords or high cost threshold
  return bigTicketKeywords.some(keyword => nameLower.includes(keyword)) || cost > 500;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToSimulator }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [matrixChars, setMatrixChars] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<QuoteData | null>(null);
  const [ocrText, setOcrText] = useState<string | null>(null);
  const [dataConfirmed, setDataConfirmed] = useState(false);
  const [rawLines, setRawLines] = useState('');
  const [parsedItems, setParsedItems] = useState<any[]>([]);

  // Auto-clear all data when component mounts (when navigating back from simulator)
  useEffect(() => {
    setPhoto(null);
    setExtractedData(null);
    setIsProcessing(false);
    setIsCapturing(false);
  }, []); // Empty dependency array means this runs once when component mounts

  // Generate Matrix-style characters
  useEffect(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const generateChars = () => {
      const newChars = [];
      for (let i = 0; i < 50; i++) {
        newChars.push(chars[Math.floor(Math.random() * chars.length)]);
      }
      setMatrixChars(newChars);
    };

    generateChars();
    const interval = setInterval(generateChars, 2000);
    return () => clearInterval(interval);
  }, []);

  const processQuoteImage = async (imageData: string) => {
    setIsProcessing(true);
    
    try {
      // Initialize Tesseract worker
      const worker = await createWorker('eng');
      
      // Configure Tesseract for better accuracy
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$@.,%()[]{}:;-_/\\|+=<>?!"\'`~#&*',
      });
      
      // Perform OCR on the image
      const { data: { text } } = await worker.recognize(imageData);
      
      console.log('Extracted text:', text);
      
      // Parse the extracted text to find quote data
      const parsedData = parseStandardQuoteFormat(text);
      if (parsedData) {
        setExtractedData(parsedData);
      } else {
        // Fallback to sample data if parsing fails
        const quoteTypes = Object.keys(sampleQuotes);
        const randomType = quoteTypes[Math.floor(Math.random() * quoteTypes.length)];
        const selectedQuote = sampleQuotes[randomType as keyof typeof sampleQuotes];
        setExtractedData(selectedQuote);
      }
      
      setOcrText(text);
      setDataConfirmed(false);
      
      await worker.terminate();
      
    } catch (error) {
      console.error('OCR processing error:', error);
      // Fallback to sample data
      const quoteTypes = Object.keys(sampleQuotes);
      const randomType = quoteTypes[Math.floor(Math.random() * quoteTypes.length)];
      const selectedQuote = sampleQuotes[randomType as keyof typeof sampleQuotes];
      setExtractedData(selectedQuote);
    }
    
    setIsProcessing(false);
  };

  const handleScreenCapture = async () => {
    try {
      setIsCapturing(true);
      // Clear previous data immediately when starting new capture
      setExtractedData(null);
      
      // Check if Screen Capture API is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        alert('Screen capture is not supported in this browser. Please use Chrome, Firefox, or Edge.');
        setIsCapturing(false);
        return;
      }

      // Request screen capture
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      // Create video element to capture frame
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      video.addEventListener('loadedmetadata', async () => {
        // Create canvas to capture the frame
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        // Convert to data URL
        const dataURL = canvas.toDataURL('image/png');
        setPhoto(dataURL);
        
        // Stop the stream
        stream.getTracks().forEach(track => track.stop());
        setIsCapturing(false);
        
        // Process the captured image
        await processQuoteImage(dataURL);
      });

    } catch (error) {
      console.error('Error capturing screen:', error);
      setIsCapturing(false);
      
      if (error instanceof Error && error.name === 'NotAllowedError') {
        alert('Screen capture permission was denied. Please allow screen sharing to capture quotes.');
      } else {
        alert('Failed to capture screen. Please try again.');
      }
    }
  };

  const handleFileUpload = async () => {
    // Clear previous data immediately when starting new upload
    setExtractedData(null);
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const imageData = e.target?.result as string;
          setPhoto(imageData);
          await processQuoteImage(imageData);
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  const handleOpenCalculator = () => {
    if (extractedData) {
      onNavigateToSimulator(extractedData);
    }
  };

  const isDataReady = photo && extractedData && !isProcessing;

  // Enhanced parsing function for pasted lines
  function parsePastedLines() {
    const parsedData = parseStandardQuoteFormat(rawLines);
    if (parsedData && parsedData.lineItems.length > 0) {
      setParsedItems(parsedData.lineItems);
      setDataConfirmed(false);
    } else {
      // If parsing fails, show error message
      alert('Could not parse the pasted data. Please check the format and try again.');
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="max-w-4xl w-full mx-auto my-8 p-6 bg-gray-800 rounded-xl border border-green-700">
        <h1 className="text-3xl font-bold text-green-200 mb-4">Quote Data Input</h1>
        <p className="text-green-100 mb-6">
          Copy and paste your quote data below. The app supports standard tabular formats with columns for:
          <br />
          <span className="text-green-300 font-mono text-sm">Name | Quantity | Cost | Price | Markup% | Tax% | Discount% | Total</span>
        </p>
        
        <textarea
          className="w-full h-48 p-4 rounded bg-black text-green-200 border border-green-700 mb-4 font-mono text-sm"
          placeholder="Paste your quote data here...

Example format:
Labour - Dave	8.00	$58.00	$95.00	63.79%	15%	0%	$760.00
Switch isolator 20A	1.00	$12.15	$81.00	566.67%	15%	0%	$81.00
Daikin FTXM35U	1.00	$1,120.00	$1,344.00	20.00%	15%	0%	$1,344.00"
          value={rawLines}
          onChange={e => setRawLines(e.target.value)}
        />
        
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold mb-6 transition-colors"
          onClick={parsePastedLines}
          disabled={!rawLines.trim()}
        >
          Process Quote Data
        </button>

        {parsedItems.length > 0 && (
          <div className="my-6">
            <h3 className="text-green-200 font-semibold mb-4 text-lg">Parsed Line Items ({parsedItems.length} items)</h3>
            
            <div className="bg-black bg-opacity-40 rounded-lg overflow-hidden border border-green-700">
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-green-900 bg-opacity-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-green-200 font-semibold">Name</th>
                      <th className="px-3 py-2 text-center text-green-200 font-semibold">Type</th>
                      <th className="px-3 py-2 text-center text-green-200 font-semibold">Qty</th>
                      <th className="px-3 py-2 text-center text-green-200 font-semibold">Cost</th>
                      <th className="px-3 py-2 text-center text-green-200 font-semibold">Price</th>
                      <th className="px-3 py-2 text-center text-green-200 font-semibold">Markup</th>
                      <th className="px-3 py-2 text-center text-green-200 font-semibold">Total</th>
                      <th className="px-3 py-2 text-center text-green-200 font-semibold">Big Ticket</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-green-900 hover:bg-green-900 hover:bg-opacity-20">
                        <td className="px-3 py-2 text-gray-200 max-w-xs">
                          <div className="truncate" title={item.name}>
                            {item.name}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.type === 'labour' 
                              ? 'bg-blue-900 text-blue-200' 
                              : 'bg-green-900 text-green-200'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center text-gray-200">{item.quantity}</td>
                        <td className="px-3 py-2 text-center text-gray-200">${item.cost.toFixed(2)}</td>
                        <td className="px-3 py-2 text-center text-gray-200">${item.price.toFixed(2)}</td>
                        <td className="px-3 py-2 text-center text-gray-200">{item.markup.toFixed(1)}%</td>
                        <td className="px-3 py-2 text-center text-gray-200">${(item.total || (item.quantity * item.price)).toFixed(2)}</td>
                        <td className="px-3 py-2 text-center">
                          {item.isBigTicket && (
                            <span className="px-2 py-1 bg-amber-900 text-amber-200 rounded text-xs font-medium">
                              Yes
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-3">
              <input 
                type="checkbox" 
                id="confirm-data" 
                checked={dataConfirmed} 
                onChange={e => setDataConfirmed(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
              <label htmlFor="confirm-data" className="text-green-200 text-sm">
                I confirm the parsed data above is correct and ready for simulation
              </label>
            </div>
            
            <button
              className={`mt-6 py-3 px-8 rounded-xl font-semibold text-lg transition-all shadow-lg border ${
                dataConfirmed 
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 border-green-500/30 transform hover:scale-105' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-500/30'
              }`}
              onClick={handleConfirmAndSimulate}
              disabled={!dataConfirmed}
            >
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Launch Margin Simulator
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};