import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Statutory Medical & Legal Disclaimer | PHBL',
  description:
    'Mandatory statutory compliance disclosure under the Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954.',
};

export default function DisclaimerPage() {
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
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-700 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Statutory Legal & Medical Notification</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#12150F]">
            Statutory Legal Disclaimer
          </h1>
          <p className="text-xs text-[#595C54]">
            Mandatory notice under the Drugs & Cosmetics Act, 1940 and Drugs & Magic Remedies Act, 1954.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg border border-[rgba(18,21,15,0.08)] text-sm text-[#595C54] leading-relaxed space-y-6">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#12150F]">
              1. Professional Practitioner Audience Only
            </h2>
            <p>
              The product monographs, indications, posology guides, and therapeutic indices provided on this website are compiled strictly for academic, technical, and commercial reference by registered homoeopathic medical practitioners, licensed chemists, druggists, and regulatory authorities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#12150F]">
              2. No Direct Medical Advice or Self-Prescription
            </h2>
            <p>
              Information published on this platform is not intended to be a substitute for professional medical examination, diagnosis, or personalized prescription by a qualified healthcare professional. Patients and consumers should under no circumstance discontinue prescribed treatments or self-administer homoeopathic medicines without consulting a qualified medical doctor.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#12150F]">
              3. Compliance with Drugs and Magic Remedies Act, 1954
            </h2>
            <p>
              In strict adherence to the <strong>Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954</strong>, PHBL does not publish any claims of guaranteed, miraculous, or instantaneous cures. References to therapeutic areas in our monographs are restricted strictly to pharmacopoeial indications as recognized in the Homoeopathic Pharmacopoeia of India (HPI) and official homoeopathic repertories.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-[#12150F]">
              4. No Consumer E-Commerce Gateway
            </h2>
            <p>
              In compliance with applicable Indian pharmaceutical drug sales regulations, this website does not operate an automated retail e-commerce cart or direct consumer checkout. All inquiry buttons route to our commercial sales office for verification of business licensing before order execution.
            </p>
          </section>

          <div className="p-4 rounded-md bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)] font-mono text-xs text-[#12150F]">
            Purusottam Homoeo Bikash Laboratory (Bonded) · Drug Mfg Lic: HL-792 M
          </div>
        </div>
      </div>
    </div>
  );
}
