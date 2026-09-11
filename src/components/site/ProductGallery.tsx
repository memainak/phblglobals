'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

interface ProductGalleryProps {
  images?: string[];
  name: string;
  subCategory: string;
}

export function ProductGallery({ images = [], name, subCategory }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeImage = images[selectedIndex] || images[0];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main Image Frame */}
      <div className="w-full aspect-square rounded-md bg-[#F7F7F4] border border-[rgba(18,21,15,0.06)] flex flex-col items-center justify-center relative p-6 overflow-hidden">
        {activeImage ? (
          <div className="relative w-full h-full">
            <Image
              src={activeImage}
              alt={name}
              fill
              priority
              className="object-contain p-2 transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
        ) : (
          /* Amber bottle representation */
          <div className="w-28 h-48 rounded-lg bg-gradient-to-b from-[#3D2614] via-[#2A180B] to-[#170C05] shadow-lg border border-amber-900/40 flex flex-col items-center justify-between p-3.5 text-white">
            <div className="w-10 h-4 rounded-t-sm bg-neutral-300" />
            <div className="w-full text-center space-y-1 my-auto">
              <span className="text-[9px] font-mono tracking-widest text-[#E3B83F] font-bold block">
                PHBL BONDED
              </span>
              <p className="font-serif text-xs font-bold leading-tight">
                {name}
              </p>
              <span className="text-[8px] font-mono text-emerald-400 block">
                {subCategory.toUpperCase()}
              </span>
            </div>
            <div className="w-full border-t border-white/20 pt-1 text-[7px] font-mono text-white/70 flex justify-between">
              <span>HL-792 M</span>
              <span>ENA BASE</span>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded bg-white/90 backdrop-blur-xs text-[10px] font-mono text-[#1F4D3A] border border-[#1F4D3A]/20">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1F4D3A]" />
          <span>Bonded Laboratory</span>
        </div>
      </div>

      {/* Thumbnails if > 1 image */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-14 h-14 rounded border p-1 bg-white transition-all overflow-hidden ${
                selectedIndex === idx
                  ? 'border-[#1F4D3A] ring-2 ring-[#1F4D3A]/20'
                  : 'border-[rgba(18,21,15,0.12)] opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                className="object-contain p-1"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
