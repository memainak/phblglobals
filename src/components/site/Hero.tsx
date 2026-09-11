import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BatchSearchWidget } from '@/components/site/BatchSearchWidget';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-[rgba(18,21,15,0.08)] bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial & Positioning */}
          <div className="lg:col-span-7 space-y-6">
            {/* Regulatory Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0F5F2] border border-[#1F4D3A]/20 text-[#1F4D3A] text-xs font-mono tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>ESTD. 2003 · BONDED MFG LIC: HL-792 M</span>
            </div>

            {/* H1 Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.75rem] font-bold text-[#12150F] leading-[1.08] tracking-tight">
              Precision Homoeopathy. <br />
              <span className="text-[#1F4D3A] font-normal italic">
                Rooted in Classical Science,
              </span>{' '}
              Manufactured for Modern Medicine.
            </h1>

            {/* Lead Positioning Copy */}
            <p className="text-base sm:text-lg text-[#595C54] leading-relaxed max-w-2xl">
              Founded by <strong>Dr. Tarak Prasad Chatterjee</strong> on the Hahnemannian tenet that every physician deserves untainted standardisation. Operating a licensed bonded pharmaceutical laboratory powered by 100% Extra Neutral Alcohol and continuous chromatographic scrutiny.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/products">
                <Button variant="primary" size="lg" className="gap-2 text-base px-6">
                  <span>Explore Formulary (350+ SKUs)</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/batches">
                <Button variant="outline" size="lg" className="gap-2 text-base px-5">
                  <ShieldCheck className="w-4 h-4 text-[#1F4D3A]" />
                  <span>Verify Batch Record</span>
                </Button>
              </Link>
            </div>

            {/* Direct Inline Batch Verification Bar */}
            <div className="pt-4 max-w-xl">
              <div className="p-3 bg-white rounded-lg border border-[rgba(18,21,15,0.12)] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#12150F] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1F4D3A]" />
                    Instant Public Batch Verification Portal:
                  </span>
                  <span className="text-[10px] uppercase font-mono text-[#595C54]">
                    Regulatory Mandate
                  </span>
                </div>
                <BatchSearchWidget />
              </div>
            </div>

            {/* Regulatory Strip */}
            <div className="pt-4 border-t border-[rgba(18,21,15,0.08)] flex flex-wrap items-center gap-6 text-xs text-[#595C54] font-medium">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#C9A227]" />
                <span>ISO 9001:2015 Quality Certified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1F4D3A]" />
                <span>GMP Compliant (Schedule M-I)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#1F4D3A]" />
                <span>HACCP Assured Cleanrooms</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Clinical Photography & Lab Credibility Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-lg border border-[rgba(18,21,15,0.1)] bg-white p-6 shadow-sm overflow-hidden">
              {/* Background ambient pattern */}
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-[#F0F5F2] rounded-full blur-2xl pointer-events-none" />

              {/* Central Clinical Glassware Composition */}
              <div className="aspect-4/3 rounded-md bg-[#F7F7F4] border border-[rgba(18,21,15,0.06)] flex flex-col items-center justify-center relative p-8 text-center">
                {/* Visual Representation of Amber Apothecary Flask & Pipette */}
                <div className="relative flex items-center justify-center">
                  <div className="w-28 h-44 rounded-lg bg-gradient-to-b from-[#3D2614] via-[#2A180B] to-[#170C05] shadow-lg border border-amber-900/40 flex flex-col items-center justify-between p-3.5 text-white">
                    <div className="w-10 h-4 rounded-t-sm bg-neutral-300 border-b border-neutral-400" />
                    <div className="w-full text-center space-y-1 my-auto">
                      <span className="text-[9px] font-mono tracking-widest text-[#E3B83F] font-bold block">
                        PHBL BONDED
                      </span>
                      <p className="font-serif text-xs font-bold leading-tight">
                        Arnica Montana Ø
                      </p>
                      <span className="text-[8px] font-mono text-emerald-400 block">
                        HPI / GHP GRADE
                      </span>
                    </div>
                    <div className="w-full border-t border-white/20 pt-1 text-[7px] font-mono text-white/70 flex justify-between">
                      <span>450 ML</span>
                      <span>100% ENA</span>
                    </div>
                  </div>

                  {/* Pipette & Dropper accent */}
                  <div className="absolute -right-6 top-8 w-6 h-32 rounded-full bg-white/70 backdrop-blur-xs border border-[rgba(18,21,15,0.1)] shadow-md flex flex-col items-center py-2">
                    <div className="w-3 h-5 rounded-full bg-[#1F4D3A]" />
                    <div className="w-1 h-20 bg-amber-600/60 mt-1 rounded-full" />
                  </div>
                </div>

                <div className="mt-6 text-center space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#1F4D3A] font-semibold">
                    In-House Bonded Laboratory
                  </span>
                  <p className="font-serif text-sm font-semibold text-[#12150F]">
                    Saratpally, Paschim Medinipur Plant
                  </p>
                </div>
              </div>

              {/* Floating Quality Attribute Cards */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-md bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)]">
                  <span className="text-[10px] uppercase font-mono text-[#595C54] block">
                    Extraction Vehicle
                  </span>
                  <span className="text-xs font-semibold text-[#1F4D3A]">
                    100% Extra Neutral Alcohol
                  </span>
                </div>
                <div className="p-3 rounded-md bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)]">
                  <span className="text-[10px] uppercase font-mono text-[#595C54] block">
                    Standardisation
                  </span>
                  <span className="text-xs font-semibold text-[#12150F]">
                    HPTLC Fingerprinted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
