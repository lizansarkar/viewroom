import React from 'react';
import { cn } from '../../lib/utils';

export default function IconButton({
  icon: Icon,
  label = '',
  onClick,
  active = false,
  danger = false,
  className = '',
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'pointer-events-auto p-3 rounded-2xl border backdrop-blur-md shadow-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed',
        active
          ? 'bg-amber-500/25 border-amber-400/60 text-amber-300'
          : danger
            ? 'bg-rose-950/80 hover:bg-rose-900 border-rose-800 text-rose-300 hover:text-white'
            : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800 text-slate-300 hover:text-white',
        className
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
