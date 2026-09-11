import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QualityPolicy() {
  const commitments = [
    'Zero compromise on raw feedstock: 100% botanical authenticity validated by microscopy.',
    'Exclusively pharmaceutical-grade Extra Neutral Alcohol (ENA) with zero aromatic fusel oils.',
    'Automated Class 10,000 cleanrooms and closed-loop continuous Aqua Demineralata RO loops.',
    'Electro-polished SS-316L fabrication preventing cross-batch metallurgical contamination.',
    'Public batch verification portal ensuring total regulatory transparency for drug inspectors and doctors.',
  ];

  return (
    <section className="py-20 bg-[#12150F] text-white border-b border-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Quality Assurance Protocol</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Standardisation is Not an Option in Medicine. <br />
          <span className="text-[#C9A227] italic font-normal">
            It is a Fundamental Clinical Right.
          </span>
        </h2>

        <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          At PHBL, our operations under Drug Manufacturing License HL-792 M conform strictly to the Drugs & Cosmetics Rules (Schedule M-I) and ISO 9001:2015 benchmarks.
        </p>

        {/* Commitments List */}
        <div className="pt-4 text-left max-w-2xl mx-auto space-y-3">
          {commitments.map((text, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-md bg-white/5 border border-white/10"
            >
              <div className="w-5 h-5 rounded-full bg-[#1F4D3A] text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <span className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                {text}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link href="/quality">
            <Button variant="gold" size="lg" className="gap-2 font-medium">
              <span>Explore All 7 Quality Pillars</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/certifications">
            <Button variant="outline" size="lg" className="border-white/20 text-white bg-transparent hover:bg-white/10 gap-2">
              <span>View Regulatory Certificates</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
