import React from 'react';
import { PlateRecord } from '../types';

interface PlateCardProps {
  latestRecord: PlateRecord | null;
}

export const PlateCard: React.FC<PlateCardProps> = ({ latestRecord }) => {
  if (!latestRecord) {
    return (
      <div className="h-full min-h-[200px] flex flex-col items-center justify-center p-8 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
        <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
            <span className="text-2xl opacity-20">#</span>
        </div>
        <p className="text-foreground-muted text-sm">No plate detected yet</p>
      </div>
    );
  }

  return (
    <div className="relative group overflow-hidden p-8 rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_40px_rgba(0,0,0,0.5),0_0_80px_rgba(94,106,210,0.1)] transition-all duration-300">
      {/* Background Accent Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent opacity-[0.15] blur-[60px] rounded-full" />
      
      <div className="relative z-10 flex flex-col items-center">
        <span className="text-xs font-mono tracking-widest text-accent uppercase mb-2">Detected License Plate</span>
        
        {/* The Plate Number - Visual style mimicking a physical plate roughly but modernized */}
        <div className="relative mt-2 mb-6 px-8 py-4 bg-[#1a1b26] border-2 border-white/10 rounded-lg shadow-inner">
            <h2 className="text-5xl md:text-6xl font-mono font-bold tracking-wider text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {latestRecord.plateNumber}
            </h2>
            {/* Gloss reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none rounded-lg" />
        </div>

        <div className="flex items-center gap-4 text-xs text-foreground-muted font-mono">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {latestRecord.timestamp.toLocaleTimeString()}
          </div>
          <div className="w-1 h-1 bg-white/20 rounded-full" />
          <span>ID: {latestRecord.id.slice(0, 8)}</span>
        </div>
      </div>
    </div>
  );
};