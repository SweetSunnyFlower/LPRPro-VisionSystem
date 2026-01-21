import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background-base pointer-events-none">
      {/* Layer 1: Base Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a0a0f_0%,#050506_50%,#020203_100%)]" />

      {/* Layer 2: Noise Texture */}
      <svg className="absolute inset-0 opacity-[0.03] w-full h-full">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* Layer 3: Animated Gradient Blobs */}
      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[1200px] h-[800px] bg-accent opacity-[0.15] blur-[150px] rounded-full animate-blob-float mix-blend-screen" />
      <div className="absolute top-[20%] left-[-10%] w-[800px] h-[600px] bg-indigo-900 opacity-[0.1] blur-[120px] rounded-full animate-blob-float delay-1000 mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[700px] bg-blue-900 opacity-[0.1] blur-[100px] rounded-full animate-blob-float delay-2000 mix-blend-screen" />

      {/* Layer 4: Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
        }}
      />
    </div>
  );
};