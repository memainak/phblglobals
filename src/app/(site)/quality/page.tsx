import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getQualityPillars } from '@/lib/queries';
import { ShieldCheck, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Quality Assurance, Standardisation & Laboratories | PHBL',
  description:
    'Detailed overview of the 7 quality pillars governing PHBL bonded manufacturing: Feedstock, Extra Neutral Alcohol, cleanrooms, chromatography, and GMP Schedule M.',
};

export const revalidate = 3600;

export default async function QualityHubPage() {
  const pillars = await getQualityPillars();

  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3 border-b border-[rgba(18,21,15,0.08)] pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#1F4D3A] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Good Manufacturing Practice (Schedule M-I)</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F]">
            Quality Architecture & Standardisation
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-3xl leading-relaxed">
            Standardisation is the cornerstone of clinical efficacy. At Purusottam Homoeo Bikash Laboratory, quality is designed into the plant architecture, air handling units, solvent rectifiers, and botanical validation protocols.
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="bg-[#12150F] text-white p-8 rounded-lg border border-black grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#C9A227] uppercase">Licensing</span>
            <h3 className="font-serif text-xl font-bold">Bonded Mfg HL-792 M</h3>
            <p className="text-xs text-neutral-300">
              Excise bonded facility with direct distillation of Extra Neutral Alcohol.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono text-emerald-400 uppercase">Pharmacopoeia</span>
            <h3 className="font-serif text-xl font-bold">HPI & GHP Standards</h3>
            <p className="text-xs text-neutral-300">
              Strict compliance with Homoeopathic Pharmacopoeia of India specifications.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#C9A227] uppercase">Accreditations</span>
            <h3 className="font-serif text-xl font-bold">ISO 9001, GMP & HACCP</h3>
            <p className="text-xs text-neutral-300">
              Independently audited management, cleanroom, and hazard control systems.
            </p>
          </div>
        </div>

        {/* 7 Quality Pillars Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12150F]">
              The 7 Quality Pillars
            </h2>
            <Link href="/certifications">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Award className="w-4 h-4 text-[#C9A227]" />
                <span>View Certificates</span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, idx) => (
              <div
                key={pillar.id}
                className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] p-6 space-y-4 hover:border-[#1F4D3A]/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-sm bg-[#F0F5F2] text-[#1F4D3A] font-mono text-xs font-bold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-[#595C54]">
                      GMP Pillar
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#12150F]">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#595C54] leading-relaxed">
                    {pillar.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[rgba(18,21,15,0.06)]">
                  <Link
                    href={`/quality/${pillar.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F4D3A] hover:underline"
                  >
                    <span>Read Monograph & Protocols</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
