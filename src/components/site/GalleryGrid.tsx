'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { GalleryItem } from '@/types';
import { MasonryGallery, MasonryItem } from '@/components/ui/MasonryGallery';
import { ImageIcon, X, RefreshCw, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface GalleryGridProps {
  initialItems: GalleryItem[];
}

export function GalleryGrid({ initialItems }: GalleryGridProps) {
  const [activeAlbum, setActiveAlbum] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const albums = ['All', 'Factory', 'Laboratory', 'Exhibitions'];

  const filteredItems = useMemo(() => {
    if (activeAlbum === 'All') return initialItems;
    return initialItems.filter((item) => item.album === activeAlbum);
  }, [initialItems, activeAlbum]);

  // Height pattern for varied, cinematic masonry rhythm
  const heightPresets = [360, 480, 400, 520, 350, 460, 390, 500, 420, 370];

  const masonryItems: MasonryItem[] = useMemo(() => {
    return filteredItems.map((item, idx) => {
      // Calculate realistic aspect ratio or use staggered editorial height presets
      let computedHeight = heightPresets[idx % heightPresets.length];
      if (item.height && item.width && item.width > 0) {
        const ratio = item.height / item.width;
        computedHeight = Math.round(ratio * 420);
        // Ensure within aesthetically pleasing bounds
        computedHeight = Math.max(300, Math.min(computedHeight, 520));
      }

      return {
        id: item.id,
        img: item.imageUrl || '/images/gallery/factory-finished-goods-warehouse.webp',
        height: computedHeight,
        title: item.caption,
        album: item.album,
        caption: item.caption,
        order: item.order,
      };
    });
  }, [filteredItems]);

  const activeLightboxItem =
    lightboxIndex !== null && filteredItems[lightboxIndex]
      ? filteredItems[lightboxIndex]
      : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) =>
        prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1
      );
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) =>
        prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0
      );
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1
        );
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  return (
    <div className="space-y-8">
      {/* Album Filter Tabs & Re-animate Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(18,21,15,0.08)]">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {albums.map((album) => {
            const count =
              album === 'All'
                ? initialItems.length
                : initialItems.filter((i) => i.album === album).length;

            return (
              <button
                key={album}
                onClick={() => {
                  setActiveAlbum(album);
                  setRefreshKey((k) => k + 1);
                }}
                className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeAlbum === album
                    ? 'bg-[#1F4D3A] text-white shadow-xs'
                    : 'bg-white text-[#595C54] hover:bg-[#FAFAF8] hover:text-[#12150F] border border-[rgba(18,21,15,0.08)]'
                }`}
              >
                <span>{album}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeAlbum === album
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#595C54] hidden md:inline">
            Showing {filteredItems.length} records
          </span>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#1F4D3A] bg-[#F0F5F2] hover:bg-[#E2EBE5] transition-colors cursor-pointer"
            title="Re-trigger GSAP masonry entrance"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-animate</span>
          </button>
        </div>
      </div>

      {/* GSAP-Powered Masonry Gallery */}
      {masonryItems.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-xl border border-[rgba(18,21,15,0.08)] p-8">
          <ImageIcon className="w-12 h-12 text-[#1F4D3A]/40 mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#12150F]">
            No photographs found in the &ldquo;{activeAlbum}&rdquo; album.
          </p>
          <p className="text-xs text-[#595C54] mt-1">
            Please check back as new archival documentation is uploaded regularly.
          </p>
        </div>
      ) : (
        <MasonryGallery
          key={`${activeAlbum}-${refreshKey}`}
          items={masonryItems}
          animateFrom="bottom"
          blurToFocus={true}
          stagger={0.06}
          duration={0.7}
          scaleOnHover={true}
          hoverScale={0.97}
          colorShiftOnHover={true}
          onItemClick={(item) => {
            const index = filteredItems.findIndex((i) => i.id === item.id);
            if (index !== -1) setLightboxIndex(index);
          }}
        />
      )}

      {/* High-Resolution Pharmaceutical Lightbox Modal */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="bg-[#12150F] text-white rounded-2xl border border-white/10 max-w-4xl w-full p-4 sm:p-6 space-y-4 relative shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: Title & Close */}
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-emerald-400 uppercase font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                  {activeLightboxItem.album} Division
                </span>
                <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                  Archival Monograph
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-mono mr-2">
                  {lightboxIndex !== null ? lightboxIndex + 1 : 1} / {filteredItems.length}
                </span>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image Stage with Left / Right Navigation */}
            <div className="relative aspect-16/10 rounded-xl bg-black flex items-center justify-center overflow-hidden group">
              {activeLightboxItem.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeLightboxItem.imageUrl}
                  alt={activeLightboxItem.caption}
                  className="w-full h-full object-contain select-none"
                />
              ) : (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-3">
                    <ImageIcon className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="font-serif text-lg font-bold">
                    {activeLightboxItem.caption}
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 mt-1">
                    PHBL Bonded Manufacturing Facility Archive · {activeLightboxItem.album}
                  </span>
                </div>
              )}

              {/* Prev / Next Arrows */}
              {filteredItems.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-emerald-700 transition-colors cursor-pointer opacity-80 hover:opacity-100"
                    title="Previous photo (Left Arrow)"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-emerald-700 transition-colors cursor-pointer opacity-80 hover:opacity-100"
                    title="Next photo (Right Arrow)"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Caption & Plant Metadata */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-300">
              <p className="font-medium text-sm text-neutral-100 max-w-2xl leading-relaxed">
                {activeLightboxItem.caption}
              </p>
              <div className="shrink-0 text-right">
                <span className="font-mono text-[11px] text-emerald-400 block font-semibold">
                  Purusottam Homeo Bikash Lab(Bonded)
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Paschim Medinipur Plant Archive
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryGrid;
