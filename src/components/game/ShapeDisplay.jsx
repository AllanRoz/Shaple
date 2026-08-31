import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, RefreshCw, Compass } from 'lucide-react';

export default function ShapeDisplay({
  place,
  isRevealed = false,
  isCorrect = false,
  allowRotation = false,
  enableAnimations = true,
  className = ""
}) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  // Reset transform whenever place changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setAnimKey(prev => prev + 1);
  }, [place?.id]);

  if (!place || !place.svgPath) {
    return (
      <div className="w-full aspect-square max-h-[380px] sm:max-h-[440px] flex items-center justify-center bg-slate-100 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-800">
        <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 animate-spin" />
      </div>
    );
  }

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoom(prev => Math.min(2.2, prev + 0.25));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoom(prev => Math.max(0.75, prev - 0.25));
  };

  const handleRotate = (e) => {
    e.stopPropagation();
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setZoom(1);
    setRotation(0);
  };

  // Status color styles for silhouette
  let fillColor = "fill-slate-800 dark:fill-slate-100";
  let strokeColor = "stroke-slate-700 dark:stroke-slate-300";
  let shadowClass = "drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_10px_25px_rgba(255,255,255,0.08)]";

  if (isCorrect) {
    fillColor = "fill-emerald-500 dark:fill-emerald-400";
    strokeColor = "stroke-emerald-600 dark:stroke-emerald-300";
    shadowClass = "drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]";
  } else if (isRevealed) {
    fillColor = "fill-amber-500 dark:fill-amber-400";
    strokeColor = "stroke-amber-600 dark:stroke-amber-300";
    shadowClass = "drop-shadow-[0_0_20px_rgba(245,158,11,0.35)]";
  }

  return (
    <div className={`relative w-full aspect-square max-h-[380px] sm:max-h-[420px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/80 dark:from-slate-900/90 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800/80 shadow-inner flex items-center justify-center select-none ${className}`}>
      
      {/* Background Cartographic Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:60px_60px]" />

      {/* Interactive Controls Overlay */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In (+)"
          className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out (-)"
          className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        {allowRotation && (
          <button
            type="button"
            onClick={handleRotate}
            title="Rotate Shape (90°)"
            className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        )}
        {(zoom !== 1 || rotation !== 0) && (
          <button
            type="button"
            onClick={handleReset}
            title="Reset View"
            className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shadow-sm hover:bg-brand-100 transition backdrop-blur-sm border border-brand-200 dark:border-brand-800"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Subtle Compass Indicator */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-600 pointer-events-none">
        <Compass className="w-3.5 h-3.5" />
        <span>N</span>
      </div>

      {/* SVG Silhouette */}
      <div
        key={animKey}
        className={`w-full h-full p-6 sm:p-8 flex items-center justify-center transition-transform duration-300 ease-out ${
          enableAnimations ? 'animate-scale-in' : ''
        }`}
        style={{
          transform: `scale(${zoom}) rotate(${rotation}deg)`
        }}
      >
        <svg
          viewBox={place.viewBox || "0 0 500 500"}
          className={`w-full h-full max-w-[340px] max-h-[340px] transition-all duration-300 ${shadowClass}`}
        >
          <path
            d={place.svgPath}
            className={`${fillColor} ${strokeColor} transition-colors duration-300`}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            fillRule="evenodd"
          />
        </svg>
      </div>

    </div>
  );
}
