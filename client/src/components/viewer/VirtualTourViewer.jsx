import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import PanoramaScene from './PanoramaScene';
import ViewerControls from './ViewerControls';
import ViewerError from './ViewerError';

export default function VirtualTourViewer({
  panoramaUrl,
  title = '360° Virtual Property Tour',
  sceneName = 'Living Room',
  scenes = [],
  currentSceneId,
  onSelectScene,
  onBack,
  className = '',
}) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage] = useState('');

  // Handle container fullscreen toggle
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[500px] bg-slate-950 overflow-hidden select-none touch-none ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* UI Overlay Controls */}
      <ViewerControls
        title={title}
        sceneName={sceneName}
        scenes={scenes}
        currentSceneId={currentSceneId}
        onSelectScene={onSelectScene}
        onBack={onBack}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Error Overlay */}
      {hasError && (
        <ViewerError
          message={errorMessage}
          onRetry={() => setHasError(false)}
          onBack={onBack}
        />
      )}

      {/* Three.js R3F Canvas */}
      <Canvas
        camera={{ position: [0, 0, 0.1], fov: 75 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <PanoramaScene
            panoramaUrl={panoramaUrl}
            sceneName={sceneName}
            onError={(err) => {
              console.warn('PanoramaScene texture warning:', err);
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
