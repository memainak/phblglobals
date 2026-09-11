import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Microscope, CheckCircle2, ShieldCheck, Atom, Dna } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Research & Development, Analytical Chemistry & Testing | PHBL',
  description:
    'In-house research and development division at PHBL: phytochemistry, HPTLC chromatography, stability studies, and standardisation of classical homoeopathy.',
};

export const revalidate = 3600;

export default function ResearchPage() {
  const researchPillars = [
    {
      title: 'Phytochemical Fingerprinting via HPTLC',
      description:
        'Characterising characteristic biomarker bands across mother tinctures to distinguish genuine species from wild substitutes. Every batch of Arnica, Berberis, and Kalmegh is fingerprinted prior to bulk succussion.',
    },
    {
      title: 'Accelerated & Real-Time Stability Studies',
      description:
        'Conducted under ICH climatic zone IV guidelines (30°C / 75% RH) to evaluate active constituent retention, specific gravity stability, and alcohol loss across amber glass and HDPE dispensing containers over 60 months.',
    },
    {
      title: 'Solvent Neutrality & Trace Aldehyde Screening',
      description:
        'Utilizing fractional micro-distillation and refractive index metrics to ensure our bonded Extra Neutral Alcohol contains zero aromatic esters or fusel oils that could distort subtle dynamic potencies.',
    },
    {
      title: 'Residue-Free Homoeo Vet Therapeutics',
      description:
        'Formulating high-efficiency veterinary homoeopathic liquid dilutions that clear clinical conditions such as bovine mastitis without antibiotic milk discarding or chemical meat withdrawal periods.',
    },
  ];

  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/about"
            className="text-xs font-semibold text-[#1F4D3A] hover:underline inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to About Company</span>
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-3 border-b border-[rgba(18,21,15,0.08)] pb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#1F4D3A] uppercase tracking-wider">
            <Microscope className="w-4 h-4" />
            <span>Analytical Division · Paschim Medinipur</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F]">
            Research, Development & Standardisation
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-3xl leading-relaxed">
            Bridging classical pharmacognosy with contemporary analytical chemistry. Our in-house research laboratory develops validated methods for potency verification, phytoconstituent retention, and non-destructive testing.
          </p>
        </div>

        {/* Analytical Suite Capabilities */}
        <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.08)] p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#F0F5F2] text-[#1F4D3A] flex items-center justify-center">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#12150F]">
                Laboratory Instrumentation & Testing Capabilities
              </h2>
              <p className="text-xs text-[#595C54]">
                Conforming to GLP (Good Laboratory Practice) guidelines.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-md bg-[#FAFAF8] border border-[rgba(18,21,15,0.06)] space-y-2">
              <h4 className="font-serif font-bold text-base text-[#12150F]">
                Physical & Gravimetric Testing
              </h4>
              <ul className="text-xs text-[#595C54] space-y-1.5 list-disc pl-4">
                <li>Specific gravity determination at calibrated 20°C and 25°C</li>
                <li>Total solids determination via vacuum desiccated gravimetry</li>
                <li>Alcohol content percentage (% v/v) determination via distillation pycnometry</li>
                <li>Refractive index and optical rotation bench metrics</li>
              </ul>
            </div>

            <div className="p-5 rounded-md bg-[#FAFAF8] border border-[rgba(18,21,15,0.06)] space-y-2">
              <h4 className="font-serif font-bold text-base text-[#12150F]">
                Chemical & Microbiological Testing
              </h4>
              <ul className="text-xs text-[#595C54] space-y-1.5 list-disc pl-4">
                <li>High-Performance Thin Layer Chromatography (HPTLC)</li>
                <li>Microbial Limit Testing (Total Aerobic Microbial Count, Yeasts, Molds)</li>
                <li>Absence of specified pathogens: E. coli, Salmonella, Pseudomonas</li>
                <li>Heavy metal trace detection (Pb, Cd, As, Hg)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4 Research Thrust Areas */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12150F]">
            Key Research Focus Areas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchPillars.map((area, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-md border border-[rgba(18,21,15,0.08)] space-y-3 hover:border-[#1F4D3A]/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-xs bg-[#F0F5F2] text-[#1F4D3A] font-mono text-xs font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#12150F]">
                    {area.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#595C54] leading-relaxed">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Monograph Adherence */}
        <div className="p-6 bg-[#F0F5F2] rounded-md border border-[#1F4D3A]/15 text-xs text-[#1F4D3A] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1F4D3A] shrink-0" />
            <span>
              All R&D validation studies conform to the provisions of Schedule M-I and the Homoeopathic Pharmacopoeia Laboratory (HPL), Ministry of AYUSH, Govt. of India.
            </span>
          </div>
          <Link
            href="/quality"
            className="font-bold underline whitespace-nowrap hover:text-[#16382A]"
          >
            Explore Quality Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
