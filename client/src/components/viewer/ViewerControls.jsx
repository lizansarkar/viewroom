import React, { useState } from 'react';
import { ArrowLeft, Maximize, Minimize, ZoomIn, ZoomOut, RotateCcw, Eye, Layers, ChevronDown } from 'lucide-react';

export default function ViewerControls({
  title = 'Property Tour',
  sceneName = 'Living Room',
  scenes = [],
  currentSceneId,
  onSelectScene,
  onBack,
  isFullscreen,
  onToggleFullscreen,
  onZoomIn,
  onZoomOut,
  onResetCamera,
}) {
  const [showSceneSelector, setShowSceneSelector] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Back Button & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="pointer-events-auto p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition-all shadow-xl backdrop-blur-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Exit 360 Viewer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="pointer-events-auto px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 backdrop-blur-md shadow-xl flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-tight line-clamp-1">{title}</span>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <Eye className="w-3 h-3 inline" /> {sceneName}
              </span>
            </div>
          </div>
        </div>

        {/* Scene Switcher Dropdown (Mobile & Compact) */}
        {scenes.length > 0 && (
          <div className="relative pointer-events-auto">
            <button
              onClick={() => setShowSceneSelector(!showSceneSelector)}
              className="px-4 py-2.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold backdrop-blur-md shadow-xl flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Scenes ({scenes.length})</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSceneSelector ? 'rotate-180' : ''}`} />
            </button>

            {showSceneSelector && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-xl p-2 space-y-1 z-30">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Switch Room / Scene
                </div>
                {scenes.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => {
                      if (onSelectScene) onSelectScene(scene.id);
                      setShowSceneSelector(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      currentSceneId === scene.id
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span>{scene.name}</span>
                    {scene.isFunctional ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                        360° Live
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">360°</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Scene Quick Pills Bar (Desktop) */}
      <div className="w-full flex items-end justify-between gap-4">
        {scenes.length > 0 && (
          <div className="hidden md:flex items-center gap-2 pointer-events-auto p-2 rounded-2xl bg-slate-950/80 border border-slate-800/90 backdrop-blur-md shadow-xl overflow-x-auto max-w-2xl scrollbar-none">
            {scenes.map((scene) => (
              <button
                key={scene.id}
                onClick={() => onSelectScene && onSelectScene(scene.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  currentSceneId === scene.id
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                {scene.name}
              </button>
            ))}
          </div>
        )}

        {/* Floating Action Controls (Zoom, Reset, Fullscreen) */}
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          {onResetCamera && (
            <button
              onClick={onResetCamera}
              className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-xl backdrop-blur-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Reset View"
              aria-label="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {onZoomIn && (
            <button
              onClick={onZoomIn}
              className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-xl backdrop-blur-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          )}

          {onZoomOut && (
            <button
              onClick={onZoomOut}
              className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-xl backdrop-blur-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onToggleFullscreen}
            className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white transition-all shadow-lg shadow-emerald-500/25 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
