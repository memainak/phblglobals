import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Microscope,
  Atom,
  ShieldCheck,
  Sparkles,
  Layers,
  RefreshCw,
  FlaskConical,
  Cpu,
  Globe2,
  BookOpen,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Research & Development (R&D) & Standardization | PHBL',
  description:
    'Basic research in homoeopathy, structural information systems, and continuous product and process development at Purusottam Homoeo Bikash Laboratory.',
};

export const revalidate = 3600;

export default function ResearchPage() {
  const corePillars = [
    {
      title: 'STANDARDIZATION',
      icon: Layers,
      description:
        'In-house specifications of herbs and other inputs and finished products are developed and updated constantly for optimal advantage.',
    },
    {
      title: 'UPGRADATION OF EXISTING PRODUCTS',
      icon: RefreshCw,
      description:
        'Efficacy of products in the company’s portfolio is kept under constant review and means are developed for enhancing the same.',
    },
    {
      title: 'NEW PRODUCT DEVELOPMENT',
      icon: FlaskConical,
      description:
        'New remedies are developed for common and chronic diseases, wherever appropriate.',
    },
    {
      title: 'PROCESS DEVELOPMENT',
      icon: Cpu,
      description:
        'Manufacturing and testing methods are upgraded as an ongoing activity.',
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

        {/* Title Header */}
        <div className="space-y-3 border-b border-[rgba(18,21,15,0.08)] pb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#1F4D3A] uppercase tracking-wider font-semibold">
            <Microscope className="w-4 h-4" />
            <span>Scientific Innovation & Basic Research</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F]">
            Research & Development
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-3xl leading-relaxed">
            Continuous Research & Development are the backbone of PURUSOTTAM HOMOEO BIKASH
            LABORATORY’s product and process development, testing methods and validation of efficacy
            of existing and new products.
          </p>
        </div>

        {/* Fundamental Research Statement */}
        <div className="bg-white rounded-xl border border-[rgba(18,21,15,0.08)] p-6 sm:p-10 space-y-6 shadow-xs">
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1F4D3A]">
              Pioneering Investigation
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12150F]">
              Basic Research in Homoeopathy
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#12150F] leading-relaxed">
            At <strong>Purusottam Homoeo Bikash Laboratory</strong>, research goes beyond product
            improvement or new product development. For more than fifteen years, our company has been
            one of the very few in the world that are actively engaged in the field of{' '}
            <strong>basic research in homoeopathy</strong>.
          </p>

          <div className="p-5 sm:p-6 rounded-lg bg-[#F0F5F2] border-l-4 border-[#1F4D3A] space-y-2">
            <h3 className="font-serif font-bold text-base text-[#1F4D3A]">
              The 200-Year-Old Fundamental Question
            </h3>
            <p className="text-sm text-[#1F4D3A] leading-relaxed italic">
              &ldquo;The primary goal of our research work is trying to answer a question that has been
              unresolved for two centuries: how is it possible that substances are effective and make a
              difference after they have been diluted to an extreme degree by way of
              potentiation?&rdquo;
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#595C54] leading-relaxed">
            We are challenged to develop new models of thinking, a new understanding of cause and effect,
            mainly by investigating into <strong>physical systems that are able to save specific pieces of
            structural information</strong> without requiring the existence of a special carrier
            matter. In order to explain the action mechanisms of homeopathic drugs, such systems are now
            discussed on a global scale.
          </p>

          <div className="p-5 rounded-lg bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)] flex items-start gap-3.5">
            <Globe2 className="w-5 h-5 text-[#1F4D3A] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-sm text-[#12150F]">
                International Symposia & Academic Forums
              </h4>
              <p className="text-xs sm:text-sm text-[#595C54] leading-relaxed">
                International symposia are organized at regular intervals, which provide an information
                platform on recent research development and serve as an exchange forum for medical
                practitioners.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars of R&D */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1F4D3A]">
              Operational Framework
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12150F]">
              Four Pillars of Continuous R&D
            </h2>
            <p className="text-xs sm:text-sm text-[#595C54]">
              Systematic protocols driving standardisation, efficacy, and ongoing manufacturing innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {corePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 sm:p-7 rounded-lg border border-[rgba(18,21,15,0.08)] space-y-3 hover:border-[#1F4D3A]/40 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-[#F0F5F2] text-[#1F4D3A] flex items-center justify-center border border-[#1F4D3A]/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#1F4D3A]">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#12150F] tracking-wide">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#595C54] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testing Methods & Quality Assurance */}
        <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.08)] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#F0F5F2] text-[#1F4D3A] flex items-center justify-center">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#12150F]">
                Testing Methods & Validation of Efficacy
              </h3>
              <p className="text-xs text-[#595C54]">
                Strict Schedule M-I and GLP (Good Laboratory Practice) conformance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded bg-[#FAFAF8] border border-[rgba(18,21,15,0.06)] space-y-2">
              <strong className="font-serif text-[#12150F] block text-sm">
                Physical & Gravimetric Assay
              </strong>
              <ul className="space-y-1 text-[#595C54] list-disc pl-4">
                <li>Specific gravity at calibrated 20°C and 25°C</li>
                <li>Vacuum desiccated total solids gravimetry</li>
                <li>Pycnometric alcohol percentage (% v/v) testing</li>
                <li>Refractive index and optical rotation metrics</li>
              </ul>
            </div>

            <div className="p-4 rounded bg-[#FAFAF8] border border-[rgba(18,21,15,0.06)] space-y-2">
              <strong className="font-serif text-[#12150F] block text-sm">
                Chromatographic & Microbial Control
              </strong>
              <ul className="space-y-1 text-[#595C54] list-disc pl-4">
                <li>High-Performance Thin Layer Chromatography (HPTLC) fingerprinting</li>
                <li>Total Aerobic Microbial & Pathogen Exclusion assays</li>
                <li>Screening for heavy metal traces (Pb, Cd, As, Hg)</li>
                <li>Solvent purity verification for bonded 100% grain ENA</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Regulatory Banner */}
        <div className="p-6 bg-[#F0F5F2] rounded-lg border border-[#1F4D3A]/20 text-xs text-[#1F4D3A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1F4D3A] shrink-0" />
            <span className="leading-relaxed">
              All formulation development and analytical validation adhere to the Homoeopathic
              Pharmacopoeia of India (HPI) and Schedule M-I drug manufacturing rules.
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
