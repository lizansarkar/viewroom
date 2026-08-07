import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'glass-panel rounded-2xl border border-slate-800/80 overflow-hidden bg-[#0e1629]/90 text-slate-100 shadow-xl',
        hover && 'hover:border-emerald-500/40 hover:scale-[1.01] transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('p-6 border-b border-slate-800/60 space-y-1.5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('text-xl font-bold text-white tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-sm text-slate-400 font-normal leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return <div className={cn('p-6 space-y-4', className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('p-6 border-t border-slate-800/60 bg-slate-950/40 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
}
