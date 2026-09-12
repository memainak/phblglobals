import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, ArrowRight, ShieldCheck, CheckCircle2, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Company Profile & Story (Estd. 2003) | PHBL',
  description:
    'The history, leadership, and bonded manufacturing footprint of Purusottam Homeo Bikash Lab(Bonded), founded by Dr. Tarak Prasad Chatterjee in Paschim Medinipur.',
};

export const revalidate = 3600;

export default function AboutPage() {
  const milestones = [
    {
      year: '2003',
      title: 'Foundation & Research Laboratory',
      description:
        'Established by Dr. Tarak Prasad Chatterjee at Saratpally, Paschim Medinipur to investigate alcohol purity and standardisation in homoeopathic pharmacy.',
    },
    {
      year: '2005',
      title: 'Bonded Manufacturing License (HL-792 M)',
      description:
        'Awarded official state excise and drug control licensing as a Bonded Manufacturer, enabling direct access to pure Extra Neutral Alcohol (ENA).',
    },
    {
      year: '2011',
      title: 'Schedule M-I Cleanroom Expansion',
      description:
        'Commissioned Class 10,000 filling cleanrooms, multi-stage RO demineralized water plant, and electro-polished SS-316 maceration vessels.',
    },
    {
      year: '2016',
      title: 'ISO 9001:2015 & HACCP Accreditations',
      description:
        'Formalized comprehensive Standard Operating Procedures (SOPs), in-house chromatographic profiling, and environmental bioburden monitoring.',
    },
    {
      year: '2020',
      title: 'Protectin & Veterinary Ranges Launched',
      description:
        'Engineered high-purity hospital antiseptic hand rubs (Protectin) and residue-free veterinary homoeopathic formulations for livestock.',
    },
    {
      year: '2024',
      title: 'Public Batch Traceability Portal',
      description:
        'Launched direct QR-linked public regulatory batch repository, bringing complete verification transparency to clinicians and drug controllers.',
    },
  ];

  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3 border-b border-[rgba(18,21,15,0.08)] pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#1F4D3A] uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Institutional Profile · Estd. 2003</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F]">
            Purusottam Homeo Bikash Lab(Bonded)
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-3xl leading-relaxed">
            A licensed bonded pharmaceutical manufacturing facility dedicated to standardisation, clinical integrity, and classical pharmacopoeial fidelity.
          </p>
        </div>

        {/* The Hahnemannian Principle Pull-Quote */}
        <div className="p-8 sm:p-12 rounded-lg bg-[#F0F5F2] border border-[#1F4D3A]/20 text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[#1F4D3A] font-bold">
            The Founding Monograph
          </span>
          <blockquote className="font-serif italic text-2xl sm:text-3xl text-[#12150F] max-w-2xl mx-auto leading-tight">
            &ldquo;Every physician should prepare his own medicine.&rdquo;
          </blockquote>
          <p className="text-xs text-[#595C54] max-w-xl mx-auto leading-relaxed">
            In his classical aphorisms, Samuel Hahnemann emphasized that therapeutic failure often stems not from an inaccurate simillimum, but from adulterated or inconsistent medicinal preparation. PHBL was established to provide the homoeopathic physician with absolute pharmacological fidelity.
          </p>
        </div>

        {/* Editorial Story */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 space-y-4 sticky top-28">
            <div className="bg-white p-6 rounded-md border border-[rgba(18,21,15,0.08)] space-y-3">
              <div className="relative rounded-sm overflow-hidden aspect-3/2 mb-3 border border-neutral-200">
                <Image
                  src="/images/gallery/factory-bottling-line.webp"
                  alt="PHBL Bonded Manufacturing Plant & Cleanroom Bottling Line"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-mono uppercase text-[#1F4D3A] font-semibold">
                Facility Overview
              </span>
              <h3 className="font-serif font-bold text-lg text-[#12150F]">
                Bonded Plant & Grounds
              </h3>
              <div className="text-xs text-[#595C54] space-y-2">
                <p>Location: L/3, Saratpally, Paschim Medinipur, WB</p>
                <p>Drug Mfg License: HL-792 M (Bonded)</p>
                <p>Active SKUs: 350+ Classical & Patent Formulations</p>
                <p>Distribution: 18 Indian States & Territories</p>
              </div>
            </div>

            <div className="p-4 rounded-md bg-[#FAF8F2] border border-[#C9A227]/30 text-xs text-[#8C6D13] space-y-2">
              <strong>Founder’s Perspective:</strong>
              <p className="leading-relaxed">
                Read Dr. T. P. Chatterjee&apos;s personal interview on the founding challenges of homoeopathic drug manufacturing in India.
              </p>
              <Link
                href="/about/founder"
                className="font-semibold underline inline-flex items-center gap-1"
              >
                <span>Read Chairman’s Interview</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-8 space-y-6 text-sm sm:text-base text-[#595C54] leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12150F]">
              Two Decades of Dedicated Pharmacognosy
            </h2>
            <p>
              In 2003, when <strong>Dr. Tarak Prasad Chatterjee</strong>—then Head of Obstetrics & Gynaecology at Medinipur Homoeopathic Medical College & Hospital—sought to verify the potency of commercial homoeopathic mother tinctures, he observed significant disparities in specific gravity, total solids, and alcohol purity across available brands.
            </p>
            <p>
              Homoeopathic active constituents are volatile phytochemical complexes. When extracted in substandard, aldehyde-laden rectified spirits or diluted with non-demineralized tap water, their therapeutic action is compromised. PHBL was established with a singular directive: to manufacture medicines under strict excise bonded control, ensuring only 100% grain-derived Extra Neutral Alcohol (ENA) touches the botanical feedstock.
            </p>
            <p>
              Over the past two decades, the plant has grown from a regional research initiative into an advanced facility with Class 10,000 cleanroom filling stations, continuous RO-EDI water purification loops, and automated mechanised succussion units.
            </p>

            <div className="pt-6 border-t border-[rgba(18,21,15,0.08)] space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#12150F]">
                Our Institutional Leadership
              </h3>
              <p className="text-sm">
                The laboratory is guided by seasoned homoeopathic academicians, analytical chemists, and pharmacologists committed to upholding the Homoeopathic Pharmacopoeia of India (HPI) and the German Homoeopathic Pharmacopoeia (GHP).
              </p>

              {/* Founder Profile Card */}
              <div className="bg-[#F8FAF9] rounded-lg border border-[#1F4D3A]/15 p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  <div className="sm:col-span-4">
                    <div className="relative rounded-md overflow-hidden border border-[rgba(18,21,15,0.1)] bg-[#12150F]">
                      <Image
                        src="/images/founder-portrait.png"
                        alt="Dr. Tarak Prasad Chatterjee"
                        width={583}
                        height={389}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-8 space-y-2">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#1F4D3A] bg-[#1F4D3A]/10 px-2 py-0.5 rounded-xs inline-block">
                      Founder & Chairman
                    </span>
                    <h4 className="font-serif text-lg font-bold text-[#12150F]">
                      Dr. Tarak Prasad Chatterjee
                    </h4>
                    <p className="text-xs text-[#595C54] leading-relaxed">
                      Former Head of Obstetrics & Gynaecology, Medinipur Homoeopathic Medical College & Hospital. Over 40 years of clinical and academic research in pharmacopoeial standardization.
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-[rgba(18,21,15,0.08)]">
                      <div>
                        <Image
                          src="/images/founder-signature.jpg"
                          alt="Signature of Dr. Tarak Prasad Chatterjee"
                          width={140}
                          height={30}
                          className="h-6 w-auto mix-blend-multiply"
                        />
                      </div>
                      <Link
                        href="/about/founder"
                        className="text-xs font-semibold text-[#1F4D3A] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Full Interview</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Timeline Component */}
        <div className="space-y-8 pt-8 border-t border-[rgba(18,21,15,0.08)]">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1F4D3A]">
              Chronicle of Growth
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12150F]">
              Milestones (2003 — Present)
            </h2>
          </div>

          <div className="relative border-l-2 border-[#1F4D3A]/20 ml-4 pl-6 space-y-10">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#1F4D3A] border-2 border-white shadow-xs group-hover:scale-125 transition-transform" />

                <div className="space-y-1">
                  <span className="font-mono text-xs font-bold text-[#1F4D3A] px-2 py-0.5 rounded-xs bg-[#F0F5F2] inline-block">
                    {m.year}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#12150F]">
                    {m.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#595C54] leading-relaxed max-w-2xl">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
