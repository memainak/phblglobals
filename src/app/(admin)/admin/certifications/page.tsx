import React from 'react';
import type { Metadata } from 'next';
import { getCertificationsList } from '@/lib/queries';
import { CertificateManagementTable } from '@/components/admin/CertificateManagementTable';

export const metadata: Metadata = {
  title: 'Accreditations & Certificates | PHBL Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminCertificationsPage() {
  const certifications = await getCertificationsList().catch(() => []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[rgba(18,21,15,0.08)]">
        <span className="text-xs font-mono uppercase text-[#1F4D3A] font-semibold">
          Quality & Accreditation CMS
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#12150F]">
          Accreditation & Certificate Management
        </h1>
        <p className="text-xs text-[#595C54] mt-1">
          Upload, update, and manage official regulatory certificates (ISO 9001:2015, GMP Schedule M-I, HACCP, Drug Manufacturing Licenses).
        </p>
      </div>

      {/* Interactive Table */}
      <CertificateManagementTable initialCertifications={certifications} />
    </div>
  );
}
