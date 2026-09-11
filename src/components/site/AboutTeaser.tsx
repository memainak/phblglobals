import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutTeaser() {
  return (
    <section className="py-20 bg-[#FAFAF8] border-b border-[rgba(18,21,15,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Column: Authentic Archival Portrait & Handwritten Signature */}
          <div className="lg:col-span-5">
            <div className="relative rounded-lg border border-[rgba(18,21,15,0.1)] bg-white p-5 shadow-sm space-y-4">
              {/* Archival Portrait Photo */}
              <div className="relative overflow-hidden rounded-md border border-[rgba(18,21,15,0.08)] bg-[#12150F]">
                <Image
                  src="/images/founder-portrait.png"
                  alt="Dr. Tarak Prasad Chatterjee, Founder & Chairman of PHBL"
                  width={583}
                  height={389}
                  className="w-full h-auto object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                  priority
                />
                <div className="absolute top-3 left-3 bg-[#12150F]/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-xs text-[10px] font-mono font-semibold uppercase tracking-wider border border-white/20">
                  Historical Foundation · 2003
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-6 text-white text-left">
                  <div className="font-serif font-bold text-sm sm:text-base">
                    Dr. Tarak Prasad Chatterjee
                  </div>
                  <div className="text-[11px] text-neutral-300">
                    Ex-HOD, Obstetrics & Gynaecology, Medinipur Homoeopathic Medical College
                  </div>
                </div>
              </div>

              {/* Foundational Tenet & Handwritten Signature Card */}
              <div className="p-4 rounded-md bg-[#F8FAF9] border border-[#1F4D3A]/15 space-y-3">
                <div className="flex items-start gap-2">
                  <Quote className="w-4 h-4 text-[#1F4D3A] shrink-0 mt-0.5" />
                  <blockquote className="font-serif italic text-sm text-[#12150F] leading-snug">
                    &ldquo;Every physician should prepare his own medicine.&rdquo;
                  </blockquote>
                </div>

                <div className="pt-2 border-t border-[rgba(18,21,15,0.08)] flex items-center justify-between gap-4">
                  <div>
                    <Image
                      src="/images/founder-signature.jpg"
                      alt="Handwritten Signature of Dr. Tarak Prasad Chatterjee"
                      width={160}
                      height={34}
                      className="h-7 w-auto mix-blend-multiply"
                    />
                    <span className="text-[10px] font-mono text-[#595C54] block mt-0.5">
                      Founder & Chairman, PHBL
                    </span>
                  </div>

                  <Link
                    href="/about/founder"
                    className="text-[11px] font-semibold text-[#1F4D3A] hover:underline inline-flex items-center gap-1 shrink-0"
                  >
                    <span>Monograph</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Content Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1F4D3A]">
              <span>Company Heritage</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#12150F] leading-tight">
              Two Decades of Clinical Precision and Pharmacopoeial Rigour.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#595C54] leading-relaxed">
              <p>
                Established in 2003 in Paschim Medinipur, West Bengal, <strong>Purusottam Homeo Bikash Lab(Bonded)</strong> was established to bridge a critical deficit: the availability of truly unadulterated, batch-standardised homoeopathic medicines crafted from pure Extra Neutral Alcohol (ENA).
              </p>
              <p>
                Under the guidance of <strong>Dr. Tarak Prasad Chatterjee</strong>, former Head of Obstetrics & Gynaecology at Medinipur Homoeopathic Medical College, our facility transformed from a clinician’s research laboratory into a full-scale GMP-certified manufacturing plant holding Drug License <strong>HL-792 M</strong>.
              </p>
              <p>
                Today, PHBL manufactures over 350 formulations—from classical mother tinctures macerated in electro-polished SS-316 vats to biochemic tissue salts and clinical tonics—supplying government dispensaries, institutions, and independent practitioners across India.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-sm text-[#12150F] font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F4D3A]" />
                <span>Zero Aldehyde & Sulphur ENA</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F4D3A]" />
                <span>Microbial Limit Tested (MLT)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F4D3A]" />
                <span>Public Batch Traceability</span>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/about">
                <Button variant="outline" size="md" className="gap-2 font-medium">
                  <span>Read Our Complete Story & Growth Timeline</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
