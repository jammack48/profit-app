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

// OCR Text Parsing Functions
const parseQuoteText = (text: string): QuoteData | null => {
  try {
    const lines = text.split('\n').filter(line => line.trim());
    
    // Look for common quote patterns
    const lineItems: any[] = [];
    let gstRate = 0.15; // Default GST rate
    
    // Extract line items (items with quantities and prices)
    lines.forEach((line, index) => {
      // Look for patterns like: "Item Name Qty: 2 Price: $100"
      const quantityMatch = line.match(/(\d+(?:\.\d+)?)\s*(?:x|@|qty|quantity)/i);
      const priceMatch = line.match(/\$?(\d+(?:\.\d+)?)/g);
      
      if (quantityMatch && priceMatch && priceMatch.length >= 2) {
        const quantity = parseFloat(quantityMatch[1]);
        const cost = parseFloat(priceMatch[0].replace('$', ''));
        const price = parseFloat(priceMatch[1].replace('$', ''));
        
        // Extract item name (everything before the quantity)
        const name = line.substring(0, line.indexOf(quantityMatch[0])).trim();
        
        if (name && quantity && cost && price) {
          lineItems.push({
            id: (index + 1).toString(),
            name: name,
            type: 'material' as const,
            quantity: quantity,
            cost: cost,
            price: price,
            markup: ((price - cost) / cost) * 100,
            tax: 15,
            discount: 0
          });
        }
      }
    });
    
    // If we found line items, return the parsed data
    if (lineItems.length > 0) {
      return {
        gstRate,
        lineItems
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing quote text:', error);
    return null;
  }
};

const parseQuoteTextEnhanced = (text: string): QuoteData | null => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const lineItems: any[] = [];

  for (const line of lines) {
    // Find the index of the first digit (quantity)
    const firstDigitIdx = line.search(/\d/);
    if (firstDigitIdx === -1) continue;
    const name = line.slice(0, firstDigitIdx).trim();
    const rest = line.slice(firstDigitIdx);
    // More flexible regex: allow optional $ and commas, flexible spaces
    const match = rest.match(/^(\d+(?:\.\d+)?)\s*\$?([\d,]+\.\d+)\s*\$?([\d,]+\.\d+)\s*([\d.]+)%\s*([\d.]+)%\s*([\d.]+)%\s*\$?([\d,]+\.\d+)/);
    if (match) {
      lineItems.push({
        name,
        quantity: parseFloat(match[1]),
        cost: parseFloat(match[2].replace(/,/g, '')),
        price: parseFloat(match[3].replace(/,/g, '')),
        markup: parseFloat(match[4]),
        tax: parseFloat(match[5]),
        discount: parseFloat(match[6]),
        total: parseFloat(match[7].replace(/,/g, '')),
      });
    } else {
      // For debugging: log lines that don't match
      if (rest.length > 0) {
        // Only log if there's something after the name
        // eslint-disable-next-line no-console
        console.log('No match for line:', line);
      }
    }
  }
  return { gstRate: 0.15, lineItems };
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
      const parsedData = parseQuoteTextEnhanced(text);
      if (!parsedData) {
        const fallbackData = parseQuoteText(text);
        if (fallbackData) {
          setExtractedData(fallbackData);
        } else {
          // Fallback to sample data if parsing fails
          const quoteTypes = Object.keys(sampleQuotes);
          const randomType = quoteTypes[Math.floor(Math.random() * quoteTypes.length)];
          const selectedQuote = sampleQuotes[randomType as keyof typeof sampleQuotes];
          setExtractedData(selectedQuote);
        }
      } else {
        setExtractedData(parsedData);
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

  // Parsing function for pasted lines
  function parsePastedLines() {
    const lines = rawLines.split('\n').map(l => l.trim()).filter(Boolean);
    const items: any[] = [];
    for (const line of lines) {
      // Find the index of the first digit (quantity)
      const firstDigitIdx = line.search(/\d/);
      if (firstDigitIdx === -1) continue;
      const name = line.slice(0, firstDigitIdx).trim();
      const rest = line.slice(firstDigitIdx);
      // Extract all numbers, including those with commas, decimals, and percentages
      // This will match numbers, numbers with $, and numbers with %
      const matches = [...rest.matchAll(/(\d+(?:,\d{3})*(?:\.\d+)?)/g)];
      const percentMatches = [...rest.matchAll(/([\d.]+)%/g)];
      // Fallback: If we have at least 7 numbers, assign them in order
      if (matches.length >= 7) {
        const [quantity, cost, price, markup, tax, discount, total] = matches.map(m => m[1].replace(/,/g, ''));
        items.push({
          name,
          quantity: parseFloat(quantity),
          cost: parseFloat(cost),
          price: parseFloat(price),
          markup: percentMatches[0] ? parseFloat(percentMatches[0][1]) : parseFloat(markup),
          tax: percentMatches[1] ? parseFloat(percentMatches[1][1]) : parseFloat(tax),
          discount: percentMatches[2] ? parseFloat(percentMatches[2][1]) : parseFloat(discount),
          total: parseFloat(total),
        });
      }
    }
    setParsedItems(items);
    setDataConfirmed(false);
  }

  function handleConfirmAndSimulate() {
    if (parsedItems.length > 0) {
      onNavigateToSimulator({
        gstRate: 0.15,
        lineItems: parsedItems.map((item, idx) => ({
          id: (idx + 1).toString(),
          name: item.name,
          type: 'material', // or infer from name if needed
          quantity: item.quantity,
          cost: item.cost,
          price: item.price,
          markup: item.markup,
          tax: item.tax,
          discount: item.discount,
          total: item.total,
        })),
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="max-w-2xl w-full mx-auto my-8 p-6 bg-gray-800 rounded-xl border border-green-700">
        <h1 className="text-3xl font-bold text-green-200 mb-4">Paste Quote Data</h1>
        <p className="text-green-100 mb-4">Copy and paste your quote lines below, then process and go to the calculator.</p>
        <textarea
          className="w-full h-40 p-2 rounded bg-black text-green-200 border border-green-700 mb-2"
          placeholder="Paste each line from your quote here..."
          value={rawLines}
          onChange={e => setRawLines(e.target.value)}
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold mb-4"
          onClick={parsePastedLines}
        >
          Process Data
        </button>
        {parsedItems.length > 0 && (
          <div className="my-4">
            <h3 className="text-green-200 font-semibold mb-2">Parsed Line Items</h3>
            <table className="min-w-full text-xs border border-green-700 bg-black bg-opacity-40 rounded">
              <thead>
                <tr>
                  <th className="px-2 py-1 border-b border-green-700">Name</th>
                  <th className="px-2 py-1 border-b border-green-700">Quantity</th>
                  <th className="px-2 py-1 border-b border-green-700">Cost</th>
                  <th className="px-2 py-1 border-b border-green-700">Price</th>
                  <th className="px-2 py-1 border-b border-green-700">Markup</th>
                  <th className="px-2 py-1 border-b border-green-700">Tax</th>
                  <th className="px-2 py-1 border-b border-green-700">Discount</th>
                  <th className="px-2 py-1 border-b border-green-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {parsedItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-2 py-1 border-b border-green-900">{item.name}</td>
                    <td className="px-2 py-1 border-b border-green-900">{item.quantity}</td>
                    <td className="px-2 py-1 border-b border-green-900">{item.cost}</td>
                    <td className="px-2 py-1 border-b border-green-900">{item.price}</td>
                    <td className="px-2 py-1 border-b border-green-900">{item.markup}</td>
                    <td className="px-2 py-1 border-b border-green-900">{item.tax}</td>
                    <td className="px-2 py-1 border-b border-green-900">{item.discount}</td>
                    <td className="px-2 py-1 border-b border-green-900">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 flex items-center gap-2">
              <input type="checkbox" id="confirm-data" checked={dataConfirmed} onChange={e => setDataConfirmed(e.target.checked)} />
              <label htmlFor="confirm-data" className="text-green-200 text-xs">I confirm the data above is correct</label>
            </div>
            <button
              className={`mt-4 py-2 px-6 rounded-xl font-semibold text-lg transition-all shadow-lg border ${
                dataConfirmed ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 border-green-500/30' : 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-500/30'
              }`}
              onClick={handleConfirmAndSimulate}
              disabled={!dataConfirmed}
            >
              Go to Calculator
            </button>
          </div>
        )}
      </div>
    </div>
  );
};