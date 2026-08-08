import React from 'react';
import { Eye, Sparkles } from 'lucide-react';

export default function ViewerLoading({ message = 'Loading 360° Equirectangular Panorama...' }) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl p-6 text-center select-none">
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <Eye className="w-8 h-8 text-emerald-400 absolute" />
      </div>

      <div className="space-y-2 max-w-sm">
        <h4 className="text-lg font-bold text-white tracking-tight flex items-center justify-center gap-2">
          <span>Preparing 360° Spatial Scene</span>
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
        </h4>
        <p className="text-xs text-slate-400">{message}</p>
      </div>

      <div className="mt-6 w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-pulse" />
      </div>
    </div>
  );
}
