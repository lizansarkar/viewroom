import React from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function ViewerError({ message = 'Unable to load 360° Panorama asset', onRetry, onBack }) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl p-6 text-center select-none">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h4 className="text-xl font-bold text-white mb-2">360° Scene Load Failed</h4>
      <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">{message}</p>

      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Property
          </button>
        )}

        {onRetry && (
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Loading
          </button>
        )}
      </div>
    </div>
  );
}
