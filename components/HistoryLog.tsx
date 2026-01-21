import React from 'react';
import { PlateRecord } from '../types';

interface HistoryLogProps {
  history: PlateRecord[];
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ history }) => {
  return (
    <div className="flex flex-col h-full bg-background-elevated/50 backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground tracking-tight">Recent Scans</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] text-foreground-muted font-mono">{history.length}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {history.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-40 text-foreground-subtle text-sm">
             <span className="opacity-50">Log empty</span>
           </div>
        ) : (
          history.map((record) => (
            <div key={record.id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.04] border border-transparent hover:border-white/[0.04] transition-colors">
              <div className="flex flex-col">
                <span className="font-mono font-medium text-foreground group-hover:text-white transition-colors">
                    {record.plateNumber}
                </span>
                <span className="text-[10px] text-foreground-muted mt-0.5">
                    {record.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="w-2 h-2 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_rgba(94,106,210,0.6)]" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};