import React from 'react';
import type { Metadata } from 'next';
import { getTestimonials } from '@/lib/queries';
import { TestimonialManagementTable } from '@/components/admin/TestimonialManagementTable';

export const metadata: Metadata = {
  title: 'Clinical & Trade Endorsements | PHBL Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials({ includeUnpublished: true }).catch(() => []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[rgba(18,21,15,0.08)]">
        <span className="text-xs font-mono uppercase text-[#1F4D3A] font-semibold">
          Reputation & Endorsement CMS
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#12150F]">
          Clinical & Trade Endorsements
        </h1>
        <p className="text-xs text-[#595C54] mt-1">
          Manage practitioner and distributor endorsements featured in the &quot;Trusted by Practitioners and Distributors&quot; section on the homepage.
        </p>
      </div>

      {/* Interactive Table */}
      <TestimonialManagementTable initialTestimonials={testimonials} />
    </div>
  );
}
