import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Supply & Commercial Distribution | PHBL',
  description:
    'Commercial terms, drug licensing covenants, and trade conditions for Purusottam Homeo Bikash Lab(Bonded).',
};

export default function TermsPage() {
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
            <Scale className="w-4 h-4" />
            <span>Commercial Supply Covenants</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#12150F]">
            Terms of Supply & Trade
          </h1>
          <p className="text-xs text-[#595C54]">
            Governing wholesale orders, hospital supply, and authorized stockist agreements.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg border border-[rgba(18,21,15,0.08)] text-sm text-[#595C54] leading-relaxed space-y-6">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#12150F]">
              1. Regulatory Eligibility
            </h2>
            <p>
              Supply of homoeopathic tinctures, dilutions, and patent medicines is restricted to entities holding a valid Drug License (Form 20B/21B or Form 20C/20D) and active GST registration under the Drugs & Cosmetics Rules, 1945. No retail consumer transactions are fulfilled directly through this portal.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#12150F]">
              2. Batch Traceability & Packaging Integrity
            </h2>
            <p>
              All shipments dispatched from our Paschim Medinipur bonded unit are sealed with tamper-evident holograms and labeled with batch numbers verifiable in our online public repository. Distributors must verify outer carton QR seals upon receipt.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#12150F]">
              3. Storage Mandates
            </h2>
            <p>
              Purchasers and stockists agree to store all formulations under temperature-controlled conditions (below 25°C), away from direct sunlight, volatile chemicals, and magnetic emanations, to preserve the dynamic potency of homoeopathic actives.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#12150F]">
              4. Jurisdiction
            </h2>
            <p>
              All commercial agreements and supply disputes are subject to the exclusive jurisdiction of the civil courts at Paschim Medinipur, West Bengal, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
