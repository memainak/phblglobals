import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Award, GraduationCap, Stethoscope, Quote } from 'lucide-react';

export const metadata: Metadata = {
  title: "Founder & Chairman's Monograph | Dr. Tarak Prasad Chatterjee | PHBL",
  description:
    'In-depth interview with Dr. Tarak Prasad Chatterjee, former HOD, Obstetrics & Gynaecology, Medinipur Homoeopathic Medical College and Founder of PHBL.',
};

export const revalidate = 3600;

export default function FounderInterviewPage() {
  const interviewQuestions = [
    {
      q: 'Doctor, what inspired you to establish Purusottam Homeo Bikash Lab(Bonded) after decades of senior academic practice?',
      a: 'During my tenure as Head of Obstetrics & Gynaecology at Medinipur Homoeopathic Medical College, I repeatedly treated obstinate maternal and pediatric conditions. Frequently, two bottles of the same mother tincture purchased from different markets gave entirely disparate clinical results. When you diagnose correctly and choose the precise simillimum, an ineffective medicine breaks the physician’s heart and the patient’s trust. I realized that unless someone manufactured medicine with total reverence for purity—sacrificing commercial shortcutting—homoeopathy would suffer. PHBL was born from this moral necessity.',
    },
    {
      q: 'You often quote the Hahnemannian dictum: "Every physician should prepare his own medicine." How does PHBL fulfill this?',
      a: 'In Hahnemann’s time, a physician gathered his own fresh Pulsatilla or Arnica blossoms and macerated them in wine spirits. In our complex modern world, no practicing doctor has the physical time or excise licenses to harvest, test, and succuss hundreds of drugs. Therefore, PHBL acts as the physician’s personal surrogate laboratory. We operate with the exact standard of scrupulous integrity that a conscientious doctor would employ if he were standing at the maceration vat himself.',
    },
    {
      q: 'Why did you insist on obtaining a Bonded Manufacturing License (HL-792 M) right from the outset?',
      a: 'Because the vehicle of extraction is not just a carrier; it is half the medicine. Ordinary industrial alcohol carries volatile esters, fusel oils, and aldehydes that alter the energetic and chemical constitution of plant alkaloids. A bonded license allows us to source 100% grain-distilled Extra Neutral Alcohol under direct excise supervision. It is odourless, sulphur-free, and neutral. Our medicine carries only the herb, never the chemical impurities of crude spirit.',
    },
    {
      q: 'How does PHBL ensure standardization across batches of organic botanicals that naturally vary by season?',
      a: 'We combine classical organoleptic botanical verification with contemporary analytical chemistry. In our QC laboratories, every mother tincture undergoes High-Performance Thin Layer Chromatography (HPTLC) to establish its unique phytoconstituent fingerprint. If an Arnica or Berberis harvest does not meet our active biomarker curve, it is rejected before bottling. Standardisation is not a buzzword; it is measured in micrograms and nanometers.',
    },
    {
      q: 'What is your vision for the future of homoeopathic pharmaceutical manufacturing in India?',
      a: 'My hope is that regulatory transparency becomes universal. That is why we introduced the Public Batch Traceability Portal. When any doctor in Delhi, Kolkata, or rural Bengal can enter a batch number on their phone and see the complete manufacturing record, expiry data, and authority certifications, the dignity of homoeopathic science is elevated. Purity and truth are our greatest assets.',
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
            <Quote className="w-4 h-4" />
            <span>Chairman&apos;s Monograph & Interview</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F]">
            The Physician Behind the Pharmacy
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-3xl leading-relaxed">
            An academic dialogue with <strong>Dr. Tarak Prasad Chatterjee</strong> on the philosophy of homoeopathic drug standardisation, bonded laboratory discipline, and clinical responsibility.
          </p>
        </div>

        {/* 2-Column Layout: Bio Sidebar + Q&A Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Bio Sidebar */}
          <aside className="lg:col-span-4 bg-white p-6 rounded-lg border border-[rgba(18,21,15,0.08)] space-y-6 sticky top-28">
            <div className="space-y-4 text-center sm:text-left">
              {/* Founder Official Portrait */}
              <div className="relative rounded-md overflow-hidden border border-[rgba(18,21,15,0.12)] shadow-xs bg-[#12150F]">
                <Image
                  src="/images/founder-portrait.png"
                  alt="Dr. Tarak Prasad Chatterjee, Founder & Chairman of PHBL"
                  width={583}
                  height={389}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="p-2.5 bg-white border-t border-[rgba(18,21,15,0.08)]">
                  <span className="text-[10px] font-mono text-[#595C54] block">
                    Dr. T. P. Chatterjee at the laboratory desk, Paschim Medinipur
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-serif font-bold text-xl text-[#12150F]">
                  Dr. Tarak Prasad Chatterjee
                </h3>
                <p className="text-xs text-[#1F4D3A] font-medium mt-0.5">
                  Founder & Chairman, PHBL (Bonded)
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(18,21,15,0.08)] space-y-3 text-xs text-[#595C54]">
              <div className="flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-[#1F4D3A] shrink-0 mt-0.5" />
                <span>
                  Former Head of Department, Obstetrics & Gynaecology, Medinipur Homoeopathic Medical College & Hospital.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Stethoscope className="w-4 h-4 text-[#1F4D3A] shrink-0 mt-0.5" />
                <span>
                  Over 40 years of active clinical practice and postgraduate medical training in West Bengal.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Award className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>
                  Pioneer of bonded ENA extraction in Eastern India under Drug License HL-792 M.
                </span>
              </div>
            </div>

            {/* Foundational Tenet & Handwritten Signature */}
            <div className="p-4 rounded-md bg-[#F0F5F2] border border-[#1F4D3A]/15 space-y-3">
              <blockquote className="text-xs text-[#1F4D3A] italic leading-relaxed">
                &ldquo;When a physician places a drop on a child’s tongue, his honour and the law of similia are on trial. We will never compromise.&rdquo;
              </blockquote>
              <div className="pt-2 border-t border-[#1F4D3A]/15 flex items-center justify-between">
                <div>
                  <Image
                    src="/images/founder-signature.jpg"
                    alt="Signature of Dr. Tarak Prasad Chatterjee"
                    width={150}
                    height={32}
                    className="h-7 w-auto mix-blend-multiply"
                  />
                  <span className="text-[10px] font-mono text-[#595C54] block mt-0.5">
                    Authorized Signatory
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#1F4D3A] font-semibold uppercase">
                  HL-792 M
                </span>
              </div>
            </div>
          </aside>

          {/* Right Q&A Body */}
          <main className="lg:col-span-8 space-y-8">
            {interviewQuestions.map((item, idx) => (
              <article
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-md border border-[rgba(18,21,15,0.08)] space-y-4"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-bold text-[#1F4D3A]">
                    Q{idx + 1}.
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1F4D3A] leading-snug">
                    {item.q}
                  </h3>
                </div>

                <div className="pl-6 border-l-2 border-[rgba(18,21,15,0.1)] text-sm sm:text-base text-[#12150F] leading-relaxed">
                  <p>{item.a}</p>
                </div>
              </article>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
