import React, { useRef, useEffect, useState } from 'react';

interface CameraFeedProps {
  onFrameCapture: (base64: string) => void;
  isActive: boolean;
  isProcessing: boolean;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ onFrameCapture, isActive, isProcessing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            facingMode: 'environment' // Use rear camera on mobile
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setHasPermission(false);
      }
    };

    if (isActive) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);

  // Capture loop
  useEffect(() => {
    let intervalId: any;

    if (isActive && !isProcessing && hasPermission) {
      intervalId = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Compression to speed up API transfer
            const base64 = canvas.toDataURL('image/jpeg', 0.6);
            onFrameCapture(base64);
          }
        }
      }, 2500); // Capture every 2.5s to allow processing time
    }

    return () => clearInterval(intervalId);
  }, [isActive, isProcessing, hasPermission, onFrameCapture]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_12px_40px_rgba(0,0,0,0.6)] group">
      {/* Container for Video */}
      <div className="absolute inset-0 flex items-center justify-center">
        {!isActive && hasPermission !== false && (
            <div className="text-foreground-muted flex flex-col items-center">
                <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p>Camera Idle</p>
            </div>
        )}
        
        {hasPermission === false && (
             <div className="text-red-400 flex flex-col items-center">
                <p>Permission Denied</p>
             </div>
        )}

        <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`} 
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Cinematic Overlays (Only visible when active) */}
      {isActive && (
        <>
          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
          
          {/* Scan Line Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
             <div className="absolute w-full h-[2px] bg-accent shadow-[0_0_20px_rgba(94,106,210,0.8)] animate-scan-line" />
          </div>

          {/* Corner Markers */}
          <div className="absolute inset-4 pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br-lg" />
          </div>

          {/* Status Label */}
          <div className="absolute top-6 left-6 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
            <span className="text-xs font-mono tracking-widest text-white/80 uppercase">
                {isProcessing ? 'Analyzing...' : 'Live Feed'}
            </span>
          </div>
        </>
      )}
    </div>
  );
};