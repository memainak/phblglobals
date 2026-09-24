import React from 'react';
import type { Metadata } from 'next';
import { ReferenceManager } from '@/components/admin/ReferenceManager';

export const metadata: Metadata = {
  title: 'Catalogue Reference Indexes | PHBL Admin',
};

export const dynamic = 'force-dynamic';

export default function AdminReferencePage() {
  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[rgba(18,21,15,0.08)]">
        <span className="text-xs font-mono uppercase text-[#1F4D3A] font-semibold">
          Catalogue Reference Data
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#12150F]">
          Mother Tincture, Dilution &amp; Biochemic Indexes
        </h1>
        <p className="text-xs text-[#595C54] mt-1">
          These lists power the searchable reference tables on the Homoeopathy Products page.
          They are catalogue indexes, not sellable products — pricing comes from the grade and
          potency schedules. Paste a whole list in at once with the bulk importer.
        </p>
      </div>

      <ReferenceManager />
    </div>
  );
}
