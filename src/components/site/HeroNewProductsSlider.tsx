'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Leaf,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroNewProductsSliderProps {
  products: Product[];
}

export function HeroNewProductsSlider({ products }: HeroNewProductsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Take up to 8 newly launched products
  const displayProducts = products.slice(0, 8);
  const total = displayProducts.length;

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-slide every 3.8 seconds if not hovered
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3800);

    return () => clearInterval(timer);
  }, [handleNext, isPaused, total]);

  if (total === 0) return null;

  const current = displayProducts[currentIndex];
  const primaryImage = current.images?.[0] || '/images/products/bottle-default.webp';
  const packSizeText = current.packSizes?.[0]?.size || '100 ml';
  const mrpText = current.packSizes?.[0]?.mrp ? `₹${current.packSizes[0].mrp}` : null;

  return (
    <div
      className="relative rounded-2xl border border-[rgba(18,21,15,0.12)] bg-gradient-to-b from-white via-[#FCFCFA] to-[#F5F7F5] shadow-xl p-5 sm:p-6 overflow-hidden transition-all group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar: Badge + Slide Counter + Controls */}
      <div className="relative z-10 flex items-center justify-between gap-2 pb-3 border-b border-[rgba(18,21,15,0.08)]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF5EE] border border-[#1F4D3A]/25 text-[#1F4D3A] text-[11px] font-mono font-semibold tracking-wide shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Sparkles className="w-3 h-3 text-[#1F4D3A]" />
            <span>NEW LAUNCH</span>
          </span>
          <span className="hidden sm:inline text-[11px] font-mono text-[#595C54] uppercase tracking-wider">
            PHBL Naturals
          </span>
        </div>

        {/* Counter and Arrow Buttons */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-[#1F4D3A] px-2 py-0.5 rounded bg-white border border-[rgba(18,21,15,0.08)] shadow-2xs">
            {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous newly launched product"
              className="p-1.5 rounded-md bg-white hover:bg-[#1F4D3A] text-[#12150F] hover:text-white border border-[rgba(18,21,15,0.1)] transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next newly launched product"
              className="p-1.5 rounded-md bg-white hover:bg-[#1F4D3A] text-[#12150F] hover:text-white border border-[rgba(18,21,15,0.1)] transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="relative z-10 pt-4 flex flex-col items-center">
        {/* Packshot Image Stage */}
        <Link
          href={`/products/${current.category}/${current.slug}`}
          className="relative w-full aspect-4/3 sm:aspect-16/10 rounded-xl bg-white border border-[rgba(18,21,15,0.06)] shadow-xs flex items-center justify-center overflow-hidden group/img transition-transform hover:scale-[1.01]"
        >
          <div className="relative w-full h-full p-2">
            <Image
              key={current.id}
              src={primaryImage}
              alt={current.name}
              fill
              priority
              className="object-contain p-2 drop-shadow-md transition-transform duration-500 group-hover/img:scale-105"
              sizes="(max-width: 768px) 100vw, 450px"
            />
          </div>

          {/* Top category label */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-white/90 backdrop-blur-xs text-[10px] font-mono text-[#1F4D3A] border border-[#1F4D3A]/20 shadow-2xs">
            <Leaf className="w-3 h-3 text-[#1F4D3A]" />
            <span className="capitalize">{current.subCategory.replace(/-/g, ' ')}</span>
          </div>

          {/* Size & Price badge */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#12150F]/90 backdrop-blur-xs text-white text-[11px] font-mono shadow-md">
            <span>{packSizeText}</span>
            {mrpText && (
              <>
                <span className="text-white/40">·</span>
                <span className="text-[#E3B83F] font-bold">{mrpText}</span>
              </>
            )}
          </div>
        </Link>

        {/* Product Details Section */}
        <div className="w-full mt-3 space-y-2 text-left">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href={`/products/${current.category}/${current.slug}`}
                className="font-serif text-base sm:text-lg font-bold text-[#12150F] hover:text-[#1F4D3A] transition-colors leading-snug line-clamp-1"
                title={current.name}
              >
                {current.name}
              </Link>
              <p className="text-xs text-[#595C54] line-clamp-2 mt-0.5 leading-relaxed">
                {current.indications || current.shortDescription}
              </p>
            </div>
          </div>

          {/* Key Trust Highlights & CTA */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-[rgba(18,21,15,0.06)]">
            <div className="flex items-center gap-3 text-[11px] text-[#595C54]">
              <span className="flex items-center gap-1 text-[#1F4D3A] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Herbal Actives</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[#595C54]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1F4D3A]" />
                <span>Paraben-Free</span>
              </span>
            </div>

            <Link href={`/products/${current.category}/${current.slug}`}>
              <Button
                variant="primary"
                size="sm"
                className="gap-1.5 text-xs bg-[#1F4D3A] text-white hover:bg-[#16382A] px-3.5 h-8 shadow-xs"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Thumbnail Selector & Pagination Dots */}
        <div className="w-full mt-4 pt-3 border-t border-[rgba(18,21,15,0.08)] flex items-center justify-between gap-2">
          {/* 8 Dot Indicators */}
          <div className="flex items-center gap-1.5">
            {displayProducts.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Jump to new product ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-6 h-1.5 bg-[#1F4D3A]'
                    : 'w-1.5 h-1.5 bg-neutral-300 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>

          {/* Quick Mini Thumbnails Strip */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {displayProducts.map((p, idx) => {
              const thumbImg = p.images?.[0] || '/images/products/bottle-default.webp';
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-8 h-8 rounded border p-0.5 bg-white transition-all overflow-hidden cursor-pointer ${
                    currentIndex === idx
                      ? 'border-[#1F4D3A] ring-2 ring-[#1F4D3A]/20 scale-105'
                      : 'border-neutral-200 opacity-60 hover:opacity-100'
                  }`}
                  title={p.name}
                >
                  <Image
                    src={thumbImg}
                    alt={p.name}
                    fill
                    className="object-contain p-0.5"
                    sizes="32px"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
