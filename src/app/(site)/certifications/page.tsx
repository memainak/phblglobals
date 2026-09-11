import React from 'react';
import type { Metadata } from 'next';
import { getCertifications } from '@/lib/queries';
import { CertificateViewer } from '@/components/site/CertificateViewer';
import { Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Accreditations & Certificates (ISO, GMP, HACCP) | PHBL',
  description:
    'Statutory certifications held by Purusottam Homeo Bikash Lab(Bonded): ISO 9001:2015, Good Manufacturing Practices (Schedule M), HACCP, and Drug Mfg Lic HL-792 M.',
};

export const revalidate = 3600;

export default async function CertificationsPage() {
  const certifications = await getCertifications();

  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3 border-b border-[rgba(18,21,15,0.08)] pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#1F4D3A] uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#C9A227]" />
            <span>Statutory Compliance & Standards</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F]">
            Certifications & Accreditations
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-3xl leading-relaxed">
            Every process at PHBL is governed by codified Quality Management Systems, Schedule M cleanroom validations, and annual state drug authority audits. Inspect our primary certificates and validity parameters below.
          </p>
        </div>

        {/* Certificate Cards */}
        <CertificateViewer certifications={certifications} />
      </div>
    </div>
  );
}
