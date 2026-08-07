import React from 'react';
import { cn } from '../../lib/utils';

export function Input({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          className={cn(
            'w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors',
            Icon && 'pl-10',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/50',
            className
          )}
          {...props}
        />
      </div>

      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  className = '',
  id,
  rows = 4,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}

      <textarea
        id={inputId}
        rows={rows}
        className={cn(
          'w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors resize-y',
          error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/50',
          className
        )}
        {...props}
      />

      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
}
