import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCw, RefreshCw, Compass, Move } from 'lucide-react';

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
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [animKey, setAnimKey] = useState(0);
  const containerRef = useRef(null);

  // Reset transform whenever place changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
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
    e?.stopPropagation();
    setZoom(prev => Math.min(3.5, +(prev + 0.35).toFixed(2)));
  };

  const handleZoomOut = (e) => {
    e?.stopPropagation();
    setZoom(prev => {
      const next = Math.max(0.75, +(prev - 0.35).toFixed(2));
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleRotate = (e) => {
    e?.stopPropagation();
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = (e) => {
    e?.stopPropagation();
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  // Mouse & Touch Pan Handling when Zoomed
  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoom <= 1) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (zoom <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - pan.x,
      y: e.touches[0].clientY - pan.y
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || zoom <= 1 || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
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
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full aspect-square max-h-[380px] sm:max-h-[420px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/80 dark:from-slate-900/90 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800/80 shadow-inner flex items-center justify-center select-none ${
        zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
      } ${className}`}
    >
      
      {/* Background Cartographic Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:60px_60px]" />

      {/* Interactive Controls Overlay */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In (+)"
          className="p-2 rounded-xl bg-white/85 dark:bg-slate-800/85 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out (-)"
          className="p-2 rounded-xl bg-white/85 dark:bg-slate-800/85 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        {allowRotation && (
          <button
            type="button"
            onClick={handleRotate}
            title="Rotate Shape (90°)"
            className="p-2 rounded-xl bg-white/85 dark:bg-slate-800/85 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        )}
        {(zoom !== 1 || rotation !== 0 || pan.x !== 0 || pan.y !== 0) && (
          <button
            type="button"
            onClick={handleReset}
            title="Reset View"
            className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 shadow-sm hover:bg-brand-100 transition backdrop-blur-sm border border-brand-200 dark:border-brand-800"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Compass & Zoom Indicator */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[11px] font-semibold text-slate-400 dark:text-slate-600 pointer-events-none">
        <div className="flex items-center gap-1">
          <Compass className="w-3.5 h-3.5" />
          <span>N</span>
        </div>
        {zoom > 1 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
            <Move className="w-3 h-3" />
            <span>{zoom.toFixed(1)}x (Drag to pan)</span>
          </div>
        )}
      </div>

      {/* High-Resolution SVG Silhouette */}
      <div
        key={animKey}
        className={`w-full h-full p-4 sm:p-6 flex items-center justify-center transition-transform duration-150 ease-out ${
          enableAnimations && zoom === 1 ? 'animate-scale-in' : ''
        }`}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`
        }}
      >
        <svg
          viewBox={place.viewBox || "0 0 500 500"}
          className={`w-full h-full max-w-[360px] max-h-[360px] transition-all duration-300 ${shadowClass}`}
        >
          <path
            d={place.svgPath}
            className={`${fillColor} ${strokeColor} transition-colors duration-300`}
            strokeWidth="1.2"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            fillRule="evenodd"
          />
        </svg>
      </div>

    </div>
  );
}
