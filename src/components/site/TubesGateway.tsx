'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TubesBackground } from './TubesBackground';
import { ArrowRight, Sparkles, MousePointer2, ShieldCheck, Award } from 'lucide-react';
import Image from 'next/image';

interface TubesGatewayProps {
  onEnter?: () => void;
}

export function TubesGateway({ onEnter }: TubesGatewayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  useEffect(() => {
    // Check if user already dismissed gateway in this browser session
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('intro') === '1') {
          setIsVisible(true);
          setHasCheckedSession(true);
          return;
        }
      }
      const dismissed = sessionStorage.getItem('phbl_gateway_dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
    setHasCheckedSession(true);
  }, []);

  const handleEnterSite = () => {
    try {
      sessionStorage.setItem('phbl_gateway_dismissed', 'true');
    } catch {
      // empty
    }
    setIsVisible(false);
    if (onEnter) onEnter();
  };

  // Lock body scroll while gateway is active for true full-page immersion
  useEffect(() => {
    if (isVisible) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isVisible]);

  // Allow keyboard Enter, Space, or Escape to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isVisible && (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ')) {
        handleEnterSite();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  // Don't render until session check completes to avoid hydration flash
  if (!hasCheckedSession) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="phbl-tubes-gateway"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(12px)',
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[99999] w-full h-full min-h-dvh max-h-dvh overflow-hidden bg-[#070b08] text-white flex flex-col justify-between"
        >
          <TubesBackground
            className="w-full h-full absolute inset-0"
            onBackgroundClick={handleEnterSite}
          >
            <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-10 pointer-events-none">
              {/* Top Bar / Regulatory Badges */}
              <div className="flex items-center justify-between w-full z-20 pointer-events-auto">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-white/10 backdrop-blur-md p-1 border border-white/20 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/images/phbl-logo.png"
                      alt="PHBL Logo"
                      width={36}
                      height={36}
                      className="object-contain filter brightness-110"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] tracking-widest uppercase text-emerald-400 font-semibold block">
                      PHBL (BONDED) · ESTD. 2003
                    </span>
                    <span className="text-xs text-white/80 font-medium">
                      Purusottam Homoeo Bikash Laboratory
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-white/70 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>GMP Schedule M-I · ISO 9001:2015 · HL-792 M</span>
                </div>
              </div>

              {/* Main Center Stage */}
              <div className="flex flex-col items-center justify-center text-center my-auto max-w-4xl mx-auto z-20 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                  className="space-y-4"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-wider backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>Pure Homoeopathic & Ayurvedic Manufacturing</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold uppercase tracking-tight text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.85)] select-none">
                    Purusottam
                    <span className="block text-emerald-400 text-3xl sm:text-5xl md:text-6xl font-sans font-light tracking-wide mt-1">
                      Laboratory
                    </span>
                  </h1>

                  <p className="font-serif italic text-white/80 text-sm sm:text-lg max-w-xl mx-auto drop-shadow-md">
                    &ldquo;Every physician should prepare his own medicine&rdquo;
                  </p>
                  <p className="text-white/60 text-xs tracking-widest uppercase font-mono">
                    — Dr. Tarak Prasad Chatterjee (Founder)
                  </p>
                </motion.div>

                {/* Enter Action Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="pt-4 pointer-events-auto"
                >
                  <button
                    id="enter-lab-site-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEnterSite();
                    }}
                    className="relative group cursor-pointer inline-flex items-center gap-3 px-8 py-4 rounded-full bg-linear-to-r from-[#1F4D3A] via-[#2E7D32] to-[#1F4D3A] text-white font-semibold text-sm sm:text-base tracking-wide shadow-[0_0_35px_rgba(46,125,50,0.5)] hover:shadow-[0_0_50px_rgba(46,125,50,0.85)] border border-emerald-400/40 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <span>ENTER LABORATORY SITE</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </button>
                  <div className="text-[11px] text-white/50 font-mono mt-2.5">
                    Click button or anywhere on screen to enter
                  </div>
                </motion.div>
              </div>

              {/* Bottom Instructions / Interactivity Hint */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full z-20 text-white/60 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <MousePointer2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                  <span>Move cursor to guide 3D neon tubes · Click anywhere to enter</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-emerald-400/80">
                    <Award className="w-3.5 h-3.5" />
                    <span>Govt. Approved Bonded Manufacturing</span>
                  </div>
                  <button
                    id="skip-intro-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEnterSite();
                    }}
                    className="pointer-events-auto hover:text-white underline underline-offset-4 cursor-pointer text-white/70"
                  >
                    Skip Intro →
                  </button>
                </div>
              </div>
            </div>
          </TubesBackground>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TubesGateway;
