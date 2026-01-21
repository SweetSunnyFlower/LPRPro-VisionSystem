import React, { useState, useCallback } from 'react';
import { Background } from './components/Background';
import { CameraFeed } from './components/CameraFeed';
import { PlateCard } from './components/PlateCard';
import { HistoryLog } from './components/HistoryLog';
import { Button } from './components/Button';
import { AppStatus, PlateRecord } from './types';
import { analyzeFrame } from './services/ai';
import { speakPlate } from './services/tts';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [history, setHistory] = useState<PlateRecord[]>([]);
  const [lastPlate, setLastPlate] = useState<string | null>(null);

  // Core processing logic
  const handleFrameCapture = useCallback(async (base64Image: string) => {
    // Prevent overlapping requests strictly
    if (status === AppStatus.PROCESSING) return;

    setStatus(AppStatus.PROCESSING);

    try {
      const result = await analyzeFrame(base64Image);
      
      if (result.plate) {
        // Clean the plate string (remove spaces, basic validation)
        const cleanPlate = result.plate.toUpperCase().replace(/\s/g, '');
        
        // Basic validation: must have at least 5 chars for a plate
        if (cleanPlate.length >= 5 && cleanPlate !== lastPlate) {
            const newRecord: PlateRecord = {
                id: crypto.randomUUID(),
                plateNumber: cleanPlate,
                timestamp: new Date(),
            };

            setHistory(prev => [newRecord, ...prev]);
            setLastPlate(cleanPlate);
            speakPlate(cleanPlate);
        }
      }
    } catch (error) {
      console.error("Processing error", error);
    } finally {
      // Return to scanning state only if we haven't stopped the app
      setStatus(prev => prev !== AppStatus.IDLE ? AppStatus.SCANNING : AppStatus.IDLE);
    }
  }, [status, lastPlate]);

  const toggleScan = () => {
    if (status === AppStatus.IDLE) {
      setStatus(AppStatus.SCANNING);
      // Speak welcome message
      if (window.speechSynthesis) {
         // silent warmup
      }
    } else {
      setStatus(AppStatus.IDLE);
    }
  };

  return (
    <div className="relative min-h-screen text-foreground font-sans selection:bg-accent/30 selection:text-white">
      <Background />

      <main className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white/95 to-white/70 mb-2">
              LPR Vision
            </h1>
            <p className="text-foreground-muted text-lg max-w-xl">
              Intelligent License Plate Recognition System powered by Gemini 2.5 Vision.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:block px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                <span className="text-xs font-mono text-foreground-subtle flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status !== AppStatus.IDLE ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${status !== AppStatus.IDLE ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                    </span>
                    SYSTEM {status === AppStatus.IDLE ? 'READY' : 'ACTIVE'}
                </span>
             </div>
             <Button onClick={toggleScan} variant={status === AppStatus.IDLE ? 'primary' : 'secondary'}>
                {status === AppStatus.IDLE ? 'Start Scanning' : 'Stop Camera'}
             </Button>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Camera & Display (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <CameraFeed 
                isActive={status !== AppStatus.IDLE} 
                isProcessing={status === AppStatus.PROCESSING}
                onFrameCapture={handleFrameCapture} 
            />
            <PlateCard latestRecord={history[0] || null} />
          </div>

          {/* Right Column: Logs (4 cols) */}
          <div className="lg:col-span-4 h-[500px] lg:h-auto">
            <HistoryLog history={history} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;