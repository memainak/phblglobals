import React from 'react';
import type { Metadata } from 'next';
import { getEnquiriesList, getDistributorEnquiriesList } from '@/lib/queries';
import { EnquiriesInbox } from '@/components/admin/EnquiriesInbox';

export const metadata: Metadata = {
  title: 'Enquiries & Distributor Applications Inbox | PHBL Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminEnquiriesPage() {
  const [enquiries, distributorEnquiries] = await Promise.all([
    getEnquiriesList().catch(() => []),
    getDistributorEnquiriesList().catch(() => []),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[rgba(18,21,15,0.08)]">
        <span className="text-xs font-mono uppercase text-[#1F4D3A] font-semibold">
          Commercial Communications
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#12150F]">
          Enquiry & Distributor Inbox
        </h1>
        <p className="text-xs text-[#595C54]">
          Review doctor queries, retail store enquiries, and wholesale distributor onboarding dossiers.
        </p>
      </div>

      <EnquiriesInbox
        initialEnquiries={enquiries}
        initialDistributorEnquiries={distributorEnquiries}
      />
    </div>
  );
}
