import React from 'react';
import { cn } from '../../lib/utils';

export default function Badge({
  children,
  variant = 'default',
  status = null,
  size = 'md',
  dot = false,
  className = '',
}) {
  // Status presets map to Section 9 Architecture Requirements
  const statusStyles = {
    DRAFT: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
    SUBMITTED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    UNDER_REVIEW: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    PUBLISHED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    REJECTED: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  const statusDotColors = {
    DRAFT: 'bg-slate-400',
    SUBMITTED: 'bg-blue-400 animate-pulse',
    UNDER_REVIEW: 'bg-amber-400 animate-pulse',
    PUBLISHED: 'bg-emerald-400',
    REJECTED: 'bg-rose-400',
  };

  const variants = {
    default: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10',
    gold: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-sm shadow-amber-500/10',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    outline: 'bg-transparent text-slate-300 border-slate-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm',
  };

  const badgeContent = status || children;
  const activeStyle = status ? statusStyles[status] || variants.default : variants[variant];
  const activeDotColor = status ? statusDotColors[status] || 'bg-slate-400' : 'bg-emerald-400';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold border rounded-full backdrop-blur-sm tracking-wide uppercase',
        activeStyle,
        sizes[size],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', activeDotColor)} />}
      <span>{badgeContent}</span>
    </span>
  );
}
