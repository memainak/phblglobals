'use client';

import React, { useState } from 'react';
import { GalleryItem } from '@/types';
import { ImageIcon, X } from 'lucide-react';

interface GalleryGridProps {
  initialItems: GalleryItem[];
}

export function GalleryGrid({ initialItems }: GalleryGridProps) {
  const [activeAlbum, setActiveAlbum] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const albums = ['All', 'Factory', 'Laboratory', 'Products', 'Exhibitions'];

  const filteredItems =
    activeAlbum === 'All'
      ? initialItems
      : initialItems.filter((item) => item.album === activeAlbum);

  return (
    <div className="space-y-8">
      {/* Album Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[rgba(18,21,15,0.08)]">
        {albums.map((album) => (
          <button
            key={album}
            onClick={() => setActiveAlbum(album)}
            className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeAlbum === album
                ? 'bg-[#1F4D3A] text-white'
                : 'bg-white text-[#595C54] hover:bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)]'
            }`}
          >
            {album}
          </button>
        ))}
      </div>

      {/* Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setLightboxItem(item)}
            className="group bg-white rounded-md border border-[rgba(18,21,15,0.08)] overflow-hidden cursor-pointer hover:border-[#1F4D3A]/40 transition-all"
          >
            <div className="aspect-4/3 bg-[#F5F5F2] flex flex-col items-center justify-center p-6 relative group-hover:bg-[#EFEFEA] transition-colors">
              <div className="w-16 h-16 rounded-full bg-[#1F4D3A]/10 text-[#1F4D3A] flex items-center justify-center mb-2">
                <ImageIcon className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono uppercase text-[#1F4D3A] font-semibold">
                {item.album} Division
              </span>
              <span className="text-[11px] font-semibold text-[#12150F] text-center mt-1 px-4 line-clamp-1">
                {item.caption}
              </span>
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-mono text-[#595C54] uppercase block">
                Album: {item.album}
              </span>
              <p className="text-xs text-[#12150F] font-medium leading-snug">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.12)] max-w-2xl w-full p-6 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 text-[#595C54] hover:text-[#12150F] p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-16/10 rounded bg-[#12150F] text-white flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <ImageIcon className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="font-serif text-lg font-bold">
                {lightboxItem.caption}
              </h3>
              <span className="text-xs font-mono text-emerald-400 mt-1">
                PHBL Bonded Manufacturing Facility Archive · {lightboxItem.album}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#595C54]">
              <span>Album: <strong>{lightboxItem.album}</strong></span>
              <span className="font-mono">Paschim Medinipur Plant</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
