import React from 'react';
import type { Metadata } from 'next';
import { getGalleryItems } from '@/lib/queries';
import { GalleryGrid } from '@/components/site/GalleryGrid';
import { Camera } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manufacturing & Laboratory Gallery | PHBL Plant Archives',
  description:
    'Visual documentation of PHBL bonded plant: electro-polished SS-316 maceration vessels, cleanroom bottling lines, and analytical chromatography workstations.',
};

export const revalidate = 3600;

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3 border-b border-[rgba(18,21,15,0.08)] pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#1F4D3A] uppercase tracking-wider">
            <Camera className="w-4 h-4" />
            <span>Visual Infrastructure Archive</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F]">
            Plant & Laboratory Gallery
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-3xl leading-relaxed">
            Take a visual tour through our bonded manufacturing plant, electro-polished stainless steel maceration tanks, Class 10,000 cleanrooms, and testing facilities in Paschim Medinipur.
          </p>
        </div>

        {/* Interactive Gallery */}
        <GalleryGrid initialItems={items} />
      </div>
    </div>
  );
}
