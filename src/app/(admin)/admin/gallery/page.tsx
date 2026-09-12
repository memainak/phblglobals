import React from 'react';
import type { Metadata } from 'next';
import { getGalleryList } from '@/lib/queries';
import { GalleryManagementTable } from '@/components/admin/GalleryManagementTable';

export const metadata: Metadata = {
  title: 'Plant & Lab Gallery CMS | PHBL Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const gallery = await getGalleryList().catch(() => []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[rgba(18,21,15,0.08)]">
        <span className="text-xs font-mono uppercase text-[#1F4D3A] font-semibold">
          Visual Infrastructure CMS
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#12150F]">
          Plant & Cleanroom Gallery Management
        </h1>
        <p className="text-xs text-[#595C54] mt-1">
          Upload, organize, and manage visual documentation of maceration tanks, Class 10,000 cleanrooms, and analytical testing labs.
        </p>
      </div>

      {/* Interactive Table */}
      <GalleryManagementTable initialGallery={gallery} />
    </div>
  );
}
