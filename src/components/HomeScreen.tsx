import React, { useState, useEffect } from 'react';
import { Camera, Calculator, ArrowRight, Monitor, Square } from 'lucide-react';

interface HomeScreenProps {
  onNavigateToSimulator: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToSimulator }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [matrixChars, setMatrixChars] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

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

  const handleScreenCapture = async () => {
    try {
      setIsCapturing(true);
      
      // Check if Screen Capture API is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        alert('Screen capture is not supported in this browser. Please use Chrome, Firefox, or Edge.');
        setIsCapturing(false);
        return;
      }

      // Request screen capture
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      // Create video element to capture frame
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      video.addEventListener('loadedmetadata', () => {
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
      });

    } catch (error) {
      console.error('Error capturing screen:', error);
      setIsCapturing(false);
      
      if (error.name === 'NotAllowedError') {
        alert('Screen capture permission was denied. Please allow screen sharing to capture quotes.');
      } else {
        alert('Failed to capture screen. Please try again.');
      }
    }
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhoto(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Matrix Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-green-900">
        {/* Animated Matrix Characters */}
        <div className="absolute inset-0 opacity-10">
          {matrixChars.map((char, index) => (
            <div
              key={index}
              className="absolute text-green-400 font-mono text-sm animate-pulse"
              style={{
                left: `${(index * 7) % 100}%`,
                top: `${(index * 13) % 100}%`,
                animationDelay: `${index * 0.1}s`,
                animationDuration: `${2 + (index % 3)}s`
              }}
            >
              {char}
            </div>
          ))}
        </div>
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Scanning Line Effect */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-30 animate-pulse" 
               style={{ 
                 top: '30%',
                 animation: 'scan 4s linear infinite'
               }} />
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen bg-black bg-opacity-40 p-6">
        {/* Landscape optimized layout */}
        <div className="flex items-center justify-between h-full max-w-6xl mx-auto">
          
          {/* Left side - App info */}
          <div className="flex-1 pr-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4 shadow-lg shadow-green-500/25">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
              Margin Calculator
            </h1>
            <p className="text-green-200 text-xl mb-8 drop-shadow-md">
              Professional quote analysis tool for trade professionals
            </p>
            
            {/* Continue Button */}
            <button
              onClick={onNavigateToSimulator}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 px-8 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all shadow-lg hover:shadow-xl shadow-green-500/25 hover:shadow-green-500/40 border border-green-500/30"
            >
              <span>Open Calculator</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right side - Capture section */}
          <div className="flex-1 flex justify-center">
            <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 text-center shadow-xl shadow-green-500/10">
              <h3 className="text-xl font-semibold text-green-100 mb-6 drop-shadow-md">
                Import Quote Data
              </h3>
              
              <div className="mb-6">
                {photo ? (
                  <div className="relative">
                    <img 
                      src={photo} 
                      alt="Captured Quote" 
                      className="w-48 h-32 rounded-2xl mx-auto object-cover border-4 border-green-500 shadow-lg shadow-green-500/25"
                    />
                    <div className="absolute -bottom-3 -right-3 flex gap-2">
                      <button
                        onClick={handleScreenCapture}
                        disabled={isCapturing}
                        className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center border-4 border-black hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
                        title="Take Screenshot"
                      >
                        <Monitor className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={handleFileUpload}
                        className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center border-4 border-black hover:from-green-700 hover:to-blue-700 transition-all shadow-lg shadow-green-500/25"
                        title="Upload Image"
                      >
                        <Camera className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={handleScreenCapture}
                      disabled={isCapturing}
                      className="w-full h-32 bg-black bg-opacity-60 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-blue-500/50 hover:border-blue-400 hover:bg-opacity-80 transition-all group shadow-lg shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCapturing ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-2"></div>
                          <span className="text-blue-300 text-sm">Capturing...</span>
                        </>
                      ) : (
                        <>
                          <Monitor className="w-8 h-8 text-blue-400 group-hover:text-blue-300 mb-2" />
                          <span className="text-blue-300 text-sm font-medium">Take Screenshot</span>
                          <span className="text-blue-400 text-xs">Capture quote from screen</span>
                        </>
                      )}
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>
                      <span className="text-green-300 text-xs">or</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>
                    </div>
                    
                    <button
                      onClick={handleFileUpload}
                      className="w-full h-20 bg-black bg-opacity-60 rounded-xl flex items-center justify-center border border-green-500/30 hover:border-green-400 hover:bg-opacity-80 transition-all group shadow-lg shadow-green-500/10"
                    >
                      <Camera className="w-6 h-6 text-green-400 group-hover:text-green-300 mr-2" />
                      <span className="text-green-300 text-sm">Upload Image</span>
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-green-300 text-sm drop-shadow-sm">
                {photo ? 
                  'Quote captured! Use buttons to retake or upload different image' : 
                  'Capture your quote directly from screen or upload an image'
                }
              </p>
              
              {photo && (
                <div className="mt-4 p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                  <p className="text-green-200 text-xs">
                    <Square className="w-3 h-3 inline mr-1" />
                    Quote data ready for processing
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};