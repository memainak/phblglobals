'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  RefreshCcw,
  ExternalLink,
  Leaf,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BatchSearchWidget } from '@/components/site/BatchSearchWidget';
import { InteractiveCardStack } from '@/components/ui/InteractiveCardStack';
import { Product } from '@/types';

interface HeroProps {
  newProducts?: Product[];
}

export function Hero({ newProducts = [] }: HeroProps) {
  const [stackKey, setStackKey] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Curate products to display in the card stack (prioritize new & patents)
  const displayProducts = useMemo(() => {
    return newProducts.length > 0 ? newProducts.slice(0, 6) : [];
  }, [newProducts]);

  // If no new products or fallback, provide rich pharmaceutical showcase cards
  const fallbackCards = [
    {
      id: 'card-neem-tulsi',
      name: "Dr. Trinath's PHBL Naturals Neem & Tulsi Face Wash",
      category: 'cosmetics',
      slug: 'dr-trinaths-phbl-naturals-neem-tulsi-face-wash',
      badge: 'NEW LAUNCH · BOTANICAL CARE',
      indications: 'Anti-acne, deep pore purifying botanical facewash with pure Azadirachta Indica and Ocimum Sanctum.',
      packSize: '100 ml',
      mrp: '₹145',
      image: '/images/products/neem-tulsi-facewash.webp',
    },
    {
      id: 'card-asthma-forte',
      name: 'Asthma Forte Bronchial Syrup',
      category: 'homoeopathy',
      slug: 'asthma-forte',
      badge: 'PATENT TONIC · HPI GRADE',
      indications: 'Formulated for asthmatic bronchitis, suffocative attacks, spasmodic cough, and respiratory wheezing.',
      packSize: '115 ml, 450 ml',
      mrp: '₹135',
      image: '/images/products/asthma-forte.webp',
    },
    {
      id: 'card-arnica-q',
      name: 'Arnica Montana Mother Tincture (Ø)',
      category: 'homoeopathy',
      slug: 'arnica-montana-q',
      badge: 'CLASSICAL MONOGRAPH · 100% ENA',
      indications: 'Primary trauma remedy, muscular soreness, haematoma, physical fatigue, and capillary extravasation.',
      packSize: '30 ml, 100 ml, 450 ml',
      mrp: '₹120',
      image: '/images/products/arnica-q.webp',
    },
    {
      id: 'card-gastrin',
      name: 'Gastrin Improved Digestive Liquid',
      category: 'homoeopathy',
      slug: 'gastrin',
      badge: 'GASTRIC RESTORATIVE',
      indications: 'Rapid relief from hyperacidity, flatulence, heartburn, and post-prandial gastric burning sensation.',
      packSize: '200 ml, 450 ml',
      mrp: '₹165',
      image: '/images/products/gastrin.webp',
    },
    {
      id: 'card-arnica-oil',
      name: "Dr. Trinath's PHBL Naturals Arnica & Rosemary Hair Oil",
      category: 'cosmetics',
      slug: 'dr-trinaths-phbl-naturals-arnica-with-rosemary-hibiscus-oil',
      badge: 'HAIR VITALITY FORMULA',
      indications: 'Herbal follicle nourishment oil preventing premature greying, hair thinning, and dandruff.',
      packSize: '100 ml, 200 ml',
      mrp: '₹195',
      image: '/images/products/arnica-hair-oil.webp',
    },
    {
      id: 'card-mastitis-care',
      name: 'Mastitis-Care Homoeo Vet Liquid',
      category: 'homoeovet',
      slug: 'mastitis-care-vet',
      badge: 'VETERINARY HEALTHCARE',
      indications: 'Organic veterinary homoeopathic drops for bovine udder inflammation and optimal milk output.',
      packSize: '100 ml, 450 ml',
      mrp: '₹220',
      image: '/images/products/mastitis-care.webp',
    },
  ];

  const cardsData = useMemo(() => {
    return displayProducts.length > 0
      ? displayProducts.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          slug: p.slug,
          badge: p.isNew
            ? 'NEW LAUNCH · PHBL NATURALS'
            : p.category === 'homoeopathy'
            ? 'HPI PHARMACOPOEIA'
            : p.category === 'cosmetics'
            ? 'BOTANICAL CARE'
            : 'HOMOEO VET',
          indications: p.indications || p.shortDescription,
          packSize: p.packSizes?.[0]?.size || '100 ml',
          mrp: p.packSizes?.[0]?.mrp ? `₹${p.packSizes[0].mrp}` : 'MRP on Monograph',
          image: p.images?.[0] || '/images/products/bottle-default.webp',
        }))
      : fallbackCards;
  }, [displayProducts]);

  const stackCards = useMemo(() => {
    return cardsData.map((item) => (
      <div
        key={item.id}
        className="w-full h-full flex flex-col justify-between bg-white p-5 sm:p-6 select-none relative overflow-hidden group"
      >
        {/* Top Header: Badge + MRP */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[rgba(18,21,15,0.08)]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF5EE] border border-[#1F4D3A]/20 text-[#1F4D3A] text-[10px] sm:text-[11px] font-mono font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <Sparkles className="w-3 h-3 text-[#1F4D3A]" />
            <span>{item.badge}</span>
          </span>
          <span className="font-mono text-xs font-semibold text-[#1F4D3A] px-2 py-0.5 rounded bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)]">
            {item.packSize} · {item.mrp}
          </span>
        </div>

        {/* Center: Image Stage */}
        <div className="relative my-auto py-4 w-full flex items-center justify-center">
          <div className="relative w-full aspect-square max-h-96 rounded-2xl bg-gradient-to-b from-[#F7F9F7] to-[#EEF4F0] border border-[rgba(18,21,15,0.06)] flex items-center justify-center p-2 overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 320px, 420px"
              className="object-contain p-1 drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Bottom: Details & Monograph Link */}
        <div className="pt-3 border-t border-[rgba(18,21,15,0.08)] space-y-2">
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#12150F] leading-snug line-clamp-1 group-hover:text-[#1F4D3A] transition-colors">
              {item.name}
            </h3>
            <p className="text-xs text-[#595C54] line-clamp-2 mt-1 leading-relaxed">
              {item.indications}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href={`/products/${item.category}/${item.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F4D3A] hover:underline cursor-pointer"
            >
              <span>Read Monograph</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <span className="text-[10px] font-mono text-neutral-400">
              Swipe or use arrows to cycle
            </span>
          </div>
        </div>
      </div>
    ));
  }, [cardsData]);

  return (
    <section className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-28 pb-24 sm:pb-28 lg:pb-36 border-b border-[rgba(18,21,15,0.08)] bg-[#FAFAF8]">
      {/* Atmospheric Ambient Lighting */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100/50 via-[#1F4D3A]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-amber-100/40 via-emerald-50/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Subtle Precision Background Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #12150F 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-center">
          {/* Left Column: Editorial & Authoritative Positioning */}
          <div className="order-2 lg:order-1 lg:col-span-6 space-y-7">
            {/* Regulatory Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#1F4D3A]/25 text-[#1F4D3A] text-xs font-mono tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>ESTD. 2003 · BONDED PHARMACEUTICAL MFG LIC: HL-792 M</span>
            </div>

            {/* Refined H1 Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold text-[#12150F] leading-[1.1] tracking-tight">
              Precision Homoeopathy. <br />
              <span className="text-[#1F4D3A] font-normal italic font-serif">
                Rooted in Classical Science,
              </span>{' '}
              Manufactured for Modern Medicine.
            </h1>

            {/* Lead Positioning Copy */}
            <p className="text-base sm:text-lg lg:text-xl text-[#595C54] leading-relaxed max-w-2xl">
              Founded by <strong>Dr. Tarak Prasad Chatterjee</strong> on the Hahnemannian tenet that every physician deserves untainted standardisation. Operating a licensed bonded pharmaceutical laboratory powered by 100% Extra Neutral Alcohol and continuous chromatographic assay.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link href="/products">
                <Button variant="primary" size="lg" className="gap-2 text-base px-7 py-3.5 shadow-md hover:shadow-lg">
                  <span>Explore Formulary (350+ SKUs)</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/batches">
                <Button variant="outline" size="lg" className="gap-2 text-base px-6 py-3.5 bg-white">
                  <ShieldCheck className="w-4 h-4 text-[#1F4D3A]" />
                  <span>Verify Batch Record</span>
                </Button>
              </Link>
            </div>

            {/* Direct Inline Batch Verification Bar */}
            <div className="pt-2 max-w-xl">
              <div className="p-3.5 bg-white rounded-xl border border-[rgba(18,21,15,0.12)] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#12150F] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#1F4D3A]" />
                    Instant Public Batch Verification Portal:
                  </span>
                  <span className="text-[10px] uppercase font-mono text-[#595C54] bg-[#F5F5F2] px-2 py-0.5 rounded">
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

          {/* Right Column: InteractiveCardStack Showcase */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col items-center justify-center relative">
            {/* Ambient Stack Backdrop Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-100/40 via-emerald-50/20 to-transparent rounded-[2.5rem] blur-2xl pointer-events-none -z-10" />

            {/* Section Tag */}
            <div className="w-full max-w-[400px] sm:max-w-[460px] lg:max-w-[520px] flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1F4D3A]" />
                <span className="text-xs font-mono uppercase font-bold text-[#1F4D3A] tracking-wider">
                  Featured Formulary Stack
                </span>
              </div>
              <span className="text-xs font-mono text-[#595C54]">
                {stackCards.length} Monographs
              </span>
            </div>

            {/* The InteractiveCardStack Container */}
            <div className="w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[580px] h-[580px] sm:h-[640px] lg:h-[700px] relative">
              <InteractiveCardStack
                key={stackKey}
                cards={stackCards}
                randomRotation={true}
                sendToBackOnClick={false}
                sensitivity={110}
                autoplay={true}
                autoplayDelay={3600}
                pauseOnHover={true}
                mobileClickOnly={false}
                showArrows={true}
                onCycle={(idx) => setActiveCardIndex(idx)}
              />
            </div>

            {/* Stack Micro-Controls & Interaction Hint */}
            <div className="w-full max-w-[400px] sm:max-w-[460px] lg:max-w-[520px] mt-6 flex items-center justify-between px-3 text-xs text-[#595C54]">
              <div className="flex items-center gap-2">
                {stackCards.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeCardIndex === idx
                        ? 'w-6 bg-[#1F4D3A]'
                        : 'w-1.5 bg-neutral-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-[#595C54] hidden sm:inline">
                  Drag card to cycle
                </span>
                <button
                  type="button"
                  onClick={() => setStackKey((k) => k + 1)}
                  className="p-2 rounded-full bg-white hover:bg-[#F0F5F2] text-[#1F4D3A] border border-[rgba(18,21,15,0.1)] shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                  title="Reset Card Stack"
                  aria-label="Reset Card Stack"
                >
                  <RefreshCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
