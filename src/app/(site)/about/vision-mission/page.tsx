import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Compass, Eye, ShieldCheck, HeartPulse, Scale, Microscope, Sparkles, Quote } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Vision, Mission & Core Values | PHBL',
  description:
    'The guiding institutional mission and ethical values shaping Purusottam Homoeo Bikash Laboratory since 2003.',
};

export const revalidate = 3600;

export default function VisionMissionPage() {
  const values = [
    {
      icon: Scale,
      title: 'Pharmacopoeial Fidelity',
      description:
        'Every tincture, dilution, and trituration strictly adheres to the Homoeopathic Pharmacopoeia of India (HPI) without synthetic shortcuts.',
    },
    {
      icon: Microscope,
      title: 'Chromatographic Transparency',
      description:
        'We validate raw herbs and finished batches through analytical chromatography (HPTLC), eliminating batch-to-batch variations.',
    },
    {
      icon: ShieldCheck,
      title: 'Bonded Solvent Purity',
      description:
        'Utilizing solely 100% grain Extra Neutral Alcohol (ENA) to protect the subtle dynamic bio-energy of botanical actives.',
    },
    {
      icon: HeartPulse,
      title: 'Physician Empowerment',
      description:
        'Equipping clinicians with reliable, predictable therapeutic tools so treatment failure is never caused by medicinal impurity.',
    },
    {
      icon: Compass,
      title: 'Public Regulatory Openness',
      description:
        'Pioneering open batch traceability where every doctor and regulator can inspect batch certificates of analysis instantly.',
    },
    {
      icon: Sparkles,
      title: 'Ethical Herbal Stewardship',
      description:
        'Sourcing botanicals from sustainable, organic wild-crafting partnerships that respect the regional agrarian ecosystem.',
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
            <Compass className="w-4 h-4" />
            <span>Institutional Charter</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F]">
            Vision, Mission & Guiding Tenets
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-3xl leading-relaxed">
            Founded on the conviction that homoeopathy requires uncompromising scientific fidelity, PHBL operates under a clear mandate of standardisation and clinical trust.
          </p>
        </div>

        {/* Two-Panel Split: Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision Panel */}
          <div className="bg-white p-8 sm:p-10 rounded-lg border border-[rgba(18,21,15,0.08)] space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-sm bg-[#F0F5F2] text-[#1F4D3A] flex items-center justify-center border border-[#1F4D3A]/20">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase font-semibold text-[#1F4D3A] tracking-wider block">
                Our Institutional Vision
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#12150F]">
                To Elevate Homoeopathic Medicine to Absolute Standardisation.
              </h2>
              <p className="text-sm text-[#595C54] leading-relaxed">
                To establish an Indian benchmark where every homoeopathic practitioner can administer tinctures, potencies, and biochemic formulations with total certainty that every batch is chemically pure, biologically potent, and completely standardized.
              </p>
            </div>
            <div className="pt-4 border-t border-[rgba(18,21,15,0.06)] text-xs text-[#1F4D3A] font-semibold">
              The Physician&apos;s Surrogate Laboratory
            </div>
          </div>

          {/* Mission Panel */}
          <div className="bg-[#12150F] text-white p-8 sm:p-10 rounded-lg border border-black space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-sm bg-[#1F4D3A] text-emerald-300 flex items-center justify-center border border-emerald-800">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase font-semibold text-[#C9A227] tracking-wider block">
                Our Operational Mission
              </span>
              <h2 className="font-serif text-2xl font-bold text-white">
                Pharmacological Rigour from Soil to Amber Bottle.
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                To maintain state-of-the-art bonded manufacturing units complying with WHO-GMP and Schedule M-I rules; to source only authentic certified botanicals and pure Extra Neutral Alcohol; and to empower healthcare providers through open batch traceability.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 text-xs text-[#C9A227] font-semibold">
              Estd. 2003 · Paschim Medinipur
            </div>
          </div>
        </div>

        {/* 6 Core Values Grid */}
        <div className="space-y-8 pt-8 border-t border-[rgba(18,21,15,0.08)]">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1F4D3A]">
              Pillars of Integrity
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12150F]">
              Our Guiding Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-md border border-[rgba(18,21,15,0.08)] space-y-3 hover:border-[#1F4D3A]/30 transition-colors"
                >
                  <div className="w-9 h-9 rounded-sm bg-[#F0F5F2] text-[#1F4D3A] flex items-center justify-center border border-[#1F4D3A]/20">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#12150F]">
                    {v.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#595C54] leading-relaxed">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Founder's Credo & Signature Card */}
        <div className="bg-[#F8FAF9] rounded-lg border border-[#1F4D3A]/20 p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#1F4D3A]">
            <Quote className="w-4 h-4" />
            <span>The Founder’s Clinical Credo</span>
          </div>

          <blockquote className="font-serif italic text-lg sm:text-xl text-[#12150F] max-w-3xl leading-relaxed">
            &ldquo;Every physician should prepare his own medicine. Where modern complexity prevents him from standing at the maceration tank, PHBL stands in his place—guided by the identical clinical reverence, chemical purity, and moral responsibility.&rdquo;
          </blockquote>

          <div className="pt-4 border-t border-[rgba(18,21,15,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Image
                src="/images/founder-signature.jpg"
                alt="Signature of Dr. Tarak Prasad Chatterjee"
                width={160}
                height={34}
                className="h-8 w-auto mix-blend-multiply"
              />
              <div className="font-serif font-bold text-sm text-[#12150F] mt-1">
                Dr. Tarak Prasad Chatterjee
              </div>
              <div className="text-xs text-[#595C54]">
                Founder & Chairman · Purusottam Homoeo Bikash Laboratory (Bonded)
              </div>
            </div>

            <div className="text-xs font-mono text-[#1F4D3A] bg-white px-3 py-2 rounded-xs border border-[#1F4D3A]/15 self-start sm:self-center">
              Drug Mfg License: HL-792 M · Estd. 2003
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
