import React from 'react';
import { Move3d, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-slate-800/80', className)}
      {...props}
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-4 space-y-4">
      {/* Image thumbnail skeleton */}
      <Skeleton className="w-full h-48 rounded-xl" />

      {/* Title & subtitle skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      {/* Footer info skeleton */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function ViewerSkeleton({ message = 'Loading 360° Panorama Spatial Texture...' }) {
  return (
    <div className="relative w-full h-[60vh] min-h-[420px] rounded-3xl overflow-hidden glass-panel border border-slate-800 bg-slate-950 flex flex-col items-center justify-center p-8">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-emerald-400 animate-spin flex items-center justify-center" />
        <Move3d className="w-8 h-8 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-sm font-semibold text-white tracking-wide animate-pulse">{message}</p>
      <p className="text-xs text-slate-400 mt-1">Preparing WebGL Equirectangular Shader</p>
    </div>
  );
}
