'use client';

import React, { useEffect, useRef, useState } from 'react';

// Random color generator with botanical laboratory palette biasing
const randomColors = (count: number) => {
  const vibrantPalettes = [
    ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'],
    ['#00F5D4', '#7B2CBF', '#F72585', '#4CC9F0', '#FFB703'],
    ['#2EC4B6', '#E71D36', '#FF9F1C', '#011627', '#20A4F3'],
    ['#1F4D3A', '#52B788', '#D8F3DC', '#B7E4C7', '#74C69D'],
    ['#F967FB', '#53BC28', '#6958D5', '#83F36E', '#FE8A2E'],
  ];
  const chosen = vibrantPalettes[Math.floor(Math.random() * vibrantPalettes.length)];
  return new Array(count).fill(0).map((_, i) => chosen[i % chosen.length]);
};

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
  onBackgroundClick?: () => void;
}

export function TubesBackground({
  children,
  className = '',
  enableClickInteraction = true,
  onBackgroundClick,
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setIsLoaded] = useState(false);
  const tubesRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        // Evaluate dynamic import at client runtime to prevent server/bundler issues with CDN URLs
        const loadModule = new Function('url', 'return import(url)');
        const module = await loadModule(
          'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
        );
        const TubesCursor = module.default;

        if (!mounted || !canvasRef.current) return;

        // Size canvas to exact viewport
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ['#00F5D4', '#2EC4B6', '#7B2CBF'],
            lights: {
              intensity: 220,
              colors: ['#83f36e', '#fe8a2e', '#ff008a', '#60aed5'],
            },
          },
        });

        tubesRef.current = app;
        setIsLoaded(true);

        const handleResize = () => {
          if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
          }
        };

        window.addEventListener('resize', handleResize);
        cleanup = () => {
          window.removeEventListener('resize', handleResize);
          try {
            if (tubesRef.current?.destroy) {
              tubesRef.current.destroy();
            }
          } catch {
            // empty
          }
          tubesRef.current = null;
        };
      } catch (err) {
        console.warn('3D TubesCursor WebGL initialization note:', err);
        setIsLoaded(true);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // If a button or link was clicked, let its own click handler run
    if (target.closest('button') || target.closest('a')) return;

    // Shift colors if enabled
    if (enableClickInteraction && tubesRef.current) {
      try {
        const colors = randomColors(3);
        const lightsColors = randomColors(4);

        if (tubesRef.current.tubes?.setColors) {
          tubesRef.current.tubes.setColors(colors);
        }
        if (tubesRef.current.tubes?.setLightsColors) {
          tubesRef.current.tubes.setLightsColors(lightsColors);
        }
      } catch (err) {
        console.error('Error shifting tube colors:', err);
      }
    }

    // Trigger background click (e.g. entering main site)
    if (onBackgroundClick) {
      onBackgroundClick();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-full min-h-dvh max-h-dvh overflow-hidden bg-[#070b08] select-none ${className}`}
      onClick={handleClick}
    >
      {/* 3D WebGL Canvas spanning exact viewport */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-0"
        style={{ touchAction: 'none', width: '100vw', height: '100vh' }}
      />

      {/* Ambient glow overlay */}
      <div className="absolute inset-0 pointer-events-none z-1 bg-radial from-emerald-950/25 via-transparent to-black/85" />

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export default TubesBackground;
