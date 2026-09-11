import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Protection (DPDP Act 2023) | PHBL',
  description:
    'Privacy Policy of Purusottam Homoeo Bikash Laboratory in accordance with India’s Digital Personal Data Protection Act 2023.',
};

export default function PrivacyPage() {
  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/"
            className="text-xs font-semibold text-[#1F4D3A] hover:underline inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>

        <div className="space-y-3 border-b border-[rgba(18,21,15,0.08)] pb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#1F4D3A] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>DPDP Act 2023 Compliance</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#12150F]">
            Privacy Policy & Data Stewardship
          </h1>
          <p className="text-xs text-[#595C54]">
            Last Updated: September 2024 · Effective for Purusottam Homoeo Bikash Laboratory (Bonded)
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg border border-[rgba(18,21,15,0.08)] text-sm text-[#595C54] leading-relaxed space-y-6">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#12150F]">
              1. Overview & Data Fiduciary Details
            </h2>
            <p>
              Purusottam Homoeo Bikash Laboratory (Bonded) (&ldquo;PHBL&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) operates this website in compliance with the Digital Personal Data Protection Act (DPDP), 2023. Our registered address is L/3, Saratpally, Paschim Medinipur, Pin 721101, West Bengal, India.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#12150F]">
              2. Data We Collect
            </h2>
            <p>
              We collect personal data strictly when explicitly submitted through our communication forms, distributor onboarding forms, or hard copy booklet requests:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Doctor / Firm Name and Medical Registration / Council number.</li>
              <li>Official email address, telephony contact number, and postal clinic address.</li>
              <li>Wholesale statutory identifiers: GSTIN and Drug License numbers (Form 20B/21B).</li>
              <li>Technical analytics telemetry (page views, browser type) via privacy-compliant Google Analytics / Firebase without selling personal identifiers.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#12150F]">
              3. Purpose of Processing
            </h2>
            <p>
              Personal and commercial data is processed solely for answering clinical enquiries, verifying pharmaceutical wholesale credentials, dispatching requested physical therapeutic indices, and adhering to drug regulatory records. We do NOT monetize or disclose data to third-party marketing brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#12150F]">
              4. Data Retention & Security
            </h2>
            <p>
              Data is stored securely on encrypted enterprise cloud infrastructure (Firebase / Google Cloud Platform). Commercial distributor records are retained in compliance with standard Indian tax and pharmaceutical archiving mandates.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#12150F]">
              5. Grievance Redressal
            </h2>
            <p>
              In accordance with the DPDP Act 2023, data subjects may request verification, correction, or deletion of their personal data by writing to our Grievance Officer at <strong>phblkn@gmail.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
