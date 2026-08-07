import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Select({
  label,
  error,
  options = [],
  className = '',
  id,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        <select
          id={selectId}
          className={cn(
            'w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors appearance-none cursor-pointer',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/50',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
}
