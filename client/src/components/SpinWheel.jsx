import React, { useState, useEffect, useRef } from 'react';
import { sounds } from './AudioEffects';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

const COLORS = [
  '#00f0ff', '#7000ff', '#ff007f', '#00ff88', '#ff9900',
  '#3366ff', '#e600ff', '#00ffcc', '#ff3366', '#ffcc00'
];

export default function SpinWheel({ topics = [], onSpin, isSpinning, disabled, statusMessage }) {
  const [currentRotation, setCurrentRotation] = useState(0);
  const lastTickSegmentRef = useRef(-1);
  const containerRef = useRef(null);

  const numSegments = topics.length || 10;
  const segmentAngle = 360 / numSegments;

  // Render SVG slice paths
  const renderSlices = () => {
    return topics.map((topic, i) => {
      const startAngle = i * segmentAngle - 90; // Start from top (12 o'clock)
      const endAngle = (i + 1) * segmentAngle - 90;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = 200 + 190 * Math.cos(startRad);
      const y1 = 200 + 190 * Math.sin(startRad);
      const x2 = 200 + 190 * Math.cos(endRad);
      const y2 = 200 + 190 * Math.sin(endRad);

      const pathData = `M 200 200 L ${x1} ${y1} A 190 190 0 0 1 ${x2} ${y2} Z`;

      const textAngle = startAngle + segmentAngle / 2;
      const textX = 200 + 115; // Along radial axis
      const textY = 200;

      const color = COLORS[i % COLORS.length];

      return (
        <g key={topic.id || i}>
          <path
            d={pathData}
            fill={color}
            fillOpacity="0.88"
            stroke="#0a0b10"
            strokeWidth="3"
            className="transition-all duration-300 hover:fill-opacity-100"
          />
          {/* Radially aligned label text */}
          <text
            x={textX}
            y={textY}
            fill="#ffffff"
            fontSize="12"
            fontWeight="800"
            textAnchor="middle"
            dominantBaseline="central"
            transform={`rotate(${textAngle}, 200, 200)`}
            style={{
              textShadow: '0px 2px 5px rgba(0,0,0,0.95)',
              fontFamily: 'Outfit, sans-serif',
              letterSpacing: '0.02em'
            }}
          >
            {topic.topicName}
          </text>
        </g>
      );
    });
  };

  const handleSpinClick = async () => {
    if (disabled || isSpinning) return;

    sounds.init();
    
    // Call backend API to obtain assigned target topic
    const result = await onSpin();
    if (!result || typeof result.segmentIndex === 'undefined') return;

    const targetSegIndex = result.segmentIndex;

    // Calculate rotation angle
    // Target stop angle = 360 - (targetSegIndex * segmentAngle + segmentAngle / 2)
    const baseTargetAngle = 360 - (targetSegIndex * segmentAngle + segmentAngle / 2);
    const fullSpins = 5 * 360; // 5 full rotations (1800 deg)
    
    // Ensure rotation is always progressive
    const newRotation = currentRotation + fullSpins + ((baseTargetAngle - (currentRotation % 360) + 360) % 360);

    setCurrentRotation(newRotation);

    // Track tick sounds during spin animation
    const startTime = performance.now();
    const duration = 5000; // 5 seconds spin duration
    const startRot = currentRotation;
    const totalDist = newRotation - startRot;

    const checkTicks = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // cubic-bezier easing (deceleration)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRot = startRot + totalDist * easeOut;

      // Calculate which segment is currently passing pointer (top = 0 deg)
      const normalizedAngle = (360 - (currentRot % 360)) % 360;
      const currentSeg = Math.floor(normalizedAngle / segmentAngle);

      if (currentSeg !== lastTickSegmentRef.current && progress < 0.98) {
        lastTickSegmentRef.current = currentSeg;
        sounds.playTick();
      }

      if (progress < 1) {
        requestAnimationFrame(checkTicks);
      } else {
        sounds.playVictory();
      }
    };

    requestAnimationFrame(checkTicks);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-4" ref={containerRef}>
      
      {/* Outer Wheel Container */}
      <div className="relative p-4 rounded-full glass-panel-glow border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.2)]">
        
        {/* Spinning SVG Wheel */}
        <div className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] rounded-full overflow-hidden shadow-2xl relative">
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full transform transition-transform"
            style={{
              transform: `rotate(${currentRotation}deg)`,
              transitionDuration: isSpinning ? '5000ms' : '0ms',
              transitionTimingFunction: 'cubic-bezier(0.15, 0.85, 0.35, 1.0)'
            }}
          >
            {/* Outer border ring */}
            <circle cx="200" cy="200" r="198" fill="none" stroke="#00f0ff" strokeWidth="4" />
            {renderSlices()}
          </svg>

          {/* Wheel Center Button / Hub with Pointer Arrow on top */}
          <button
            onClick={handleSpinClick}
            disabled={disabled || isSpinning}
            className={`absolute inset-0 m-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-950/90 border-4 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.6)] flex items-center justify-center z-20 transition-all duration-300 ${
              disabled || isSpinning
                ? 'cursor-not-allowed opacity-80'
                : 'cursor-pointer hover:scale-110 hover:shadow-[0_0_35px_rgba(0,240,255,0.9)] active:scale-95'
            }`}
            title="Click to Spin!"
          >
            {/* Pointer Arrow positioned directly ABOVE the center round circle pointing UP */}
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center drop-shadow-[0_0_15px_rgba(0,240,255,0.9)] animate-pulse pointer-events-none">
              <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[26px] border-b-cyan-400" />
              <div className="w-3.5 h-3.5 bg-cyan-300 rounded-full shadow-[0_0_10px_#00f0ff] -mt-1" />
            </div>

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-full flex flex-col items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="text-[10px] font-extrabold text-cyan-200 tracking-wider">DOPPEL</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-sm font-medium animate-fade-in shadow-lg">
          <AlertCircle className="w-4 h-4 text-cyan-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Spin Button */}
      <div className="mt-6 w-full flex justify-center">
        <button
          onClick={handleSpinClick}
          disabled={disabled || isSpinning}
          className={`
            relative group px-10 py-4 rounded-2xl font-display font-black text-xl tracking-widest uppercase transition-all duration-300 shadow-2xl flex items-center gap-3
            ${disabled || isSpinning
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75'
              : 'bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white hover:scale-105 hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] border border-cyan-300/50 active:scale-95'
            }
          `}
        >
          {isSpinning ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
              <span>SPINNING...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 text-yellow-300 group-hover:rotate-12 transition-transform" />
              <span>SPIN THE WHEEL</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
