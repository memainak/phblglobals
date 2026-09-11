'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  ChevronDown,
  Menu,
  X,
  FileCheck2,
  FlaskConical,
  Building2,
  Boxes,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleMegaMenu = (menuName: string) => {
    setActiveMegaMenu(activeMegaMenu === menuName ? null : menuName);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-200 border-b',
        scrolled
          ? 'bg-[#FAFAF8]/95 backdrop-blur-md border-[rgba(18,21,15,0.08)] shadow-xs'
          : 'bg-[#FAFAF8] border-[rgba(18,21,15,0.06)]'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group focus:outline-none py-1">
            <div className="relative py-0.5 flex items-center">
              <Image
                src="/images/phbl-logo.png"
                alt="Purusottam Homeo Bikash Lab(Bonded)"
                width={240}
                height={42}
                className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation with Flat Mega-Menu Triggers */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => toggleMegaMenu('products')}
              onMouseEnter={() => setActiveMegaMenu('products')}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-md transition-colors',
                activeMegaMenu === 'products'
                  ? 'text-[#1F4D3A] bg-[#F0F5F2]'
                  : 'text-[#12150F] hover:text-[#1F4D3A] hover:bg-[#FAFAF8]'
              )}
            >
              <span>Formulary & Products</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => toggleMegaMenu('quality')}
              onMouseEnter={() => setActiveMegaMenu('quality')}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-md transition-colors',
                activeMegaMenu === 'quality'
                  ? 'text-[#1F4D3A] bg-[#F0F5F2]'
                  : 'text-[#12150F] hover:text-[#1F4D3A] hover:bg-[#FAFAF8]'
              )}
            >
              <span>Quality & Standards</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => toggleMegaMenu('company')}
              onMouseEnter={() => setActiveMegaMenu('company')}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-md transition-colors',
                activeMegaMenu === 'company'
                  ? 'text-[#1F4D3A] bg-[#F0F5F2]'
                  : 'text-[#12150F] hover:text-[#1F4D3A] hover:bg-[#FAFAF8]'
              )}
            >
              <span>Company</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            <Link
              href="/batches"
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-md transition-colors',
                pathname.startsWith('/batches')
                  ? 'text-[#1F4D3A] bg-[#F0F5F2]'
                  : 'text-[#12150F] hover:text-[#1F4D3A]'
              )}
            >
              <FileCheck2 className="w-4 h-4 text-[#1F4D3A]" />
              <span>Batch Traceability</span>
            </Link>

            <Link
              href="/downloads"
              className="px-3.5 py-2 text-sm font-medium text-[#12150F] hover:text-[#1F4D3A] rounded-md transition-colors"
            >
              Downloads
            </Link>
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/batches"
              className="p-2 text-[#595C54] hover:text-[#12150F] hover:bg-[#F5F5F2] rounded-md transition-colors"
              title="Search Batch No."
            >
              <Search className="w-4 h-4" />
            </Link>

            <Link href="/contact">
              <Button variant="primary" size="md" className="gap-1.5">
                <span>Enquire Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/batches"
              className="p-2 text-[#12150F] hover:bg-[#F5F5F2] rounded-md"
              aria-label="Batch verification"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#12150F] hover:bg-[#F5F5F2] rounded-md"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Flat Mega-Menu Panel */}
      {activeMegaMenu && (
        <div
          onMouseLeave={() => setActiveMegaMenu(null)}
          className="absolute top-full left-0 w-full bg-white border-b border-[rgba(18,21,15,0.1)] shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="max-w-7xl mx-auto p-8">
            {activeMegaMenu === 'products' && (
              <div className="grid grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[rgba(18,21,15,0.08)]">
                    <Boxes className="w-4 h-4 text-[#1F4D3A]" />
                    <span className="font-serif font-semibold text-base text-[#12150F]">
                      Homoeopathic Range
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="/products/homoeopathy"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Mother Tinctures (Q Extract)
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/homoeopathy"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Patent Syrups & Tonics
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/homoeopathy"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Clinical Specialty Drops
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/homoeopathy"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Biochemic Tissue Salts & 6X
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/homoeopathy"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Dilutions & Potencies
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[rgba(18,21,15,0.08)]">
                    <FlaskConical className="w-4 h-4 text-[#1F4D3A]" />
                    <span className="font-serif font-semibold text-base text-[#12150F]">
                      Cosmetics & Vet Care
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="/products/cosmetics"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Protectin Hand Sanitizer Rub
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/cosmetics"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Puro Herbal Therapeutic Body Oil
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/homoeovet"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Homoeo Vet Animal Health Range
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/homoeovet"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Bovine Mastitis & Lactation Care
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[rgba(18,21,15,0.08)]">
                    <FileCheck2 className="w-4 h-4 text-[#1F4D3A]" />
                    <span className="font-serif font-semibold text-base text-[#12150F]">
                      Trade & Monograph
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="/products"
                        className="text-[#1F4D3A] font-medium flex items-center gap-1 hover:underline"
                      >
                        Browse All 350+ Formulations <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/downloads"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Therapeutic Index (PDF Edition)
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/distributor-enquiry"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Wholesale & Institutional Orders
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#F0F5F2] p-5 rounded-md border border-[#1F4D3A]/20 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-semibold text-[#1F4D3A] tracking-wider">
                      Regulatory Assurance
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#12150F] mt-1">
                      Bonded Alcohol Standards
                    </h4>
                    <p className="text-xs text-[#595C54] mt-1.5 leading-relaxed">
                      Every batch is manufactured with 100% pure Extra Neutral Alcohol (ENA) with zero synthetic additives.
                    </p>
                  </div>
                  <Link
                    href="/quality/extra-neutral-alcohol"
                    className="text-xs font-semibold text-[#1F4D3A] hover:underline inline-flex items-center gap-1 mt-4"
                  >
                    Read ENA Extraction Story <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {activeMegaMenu === 'quality' && (
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="pb-3 mb-3 border-b border-[rgba(18,21,15,0.08)]">
                    <span className="font-serif font-semibold text-base text-[#12150F]">
                      Quality Pillars
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="/quality/authentic-feedstock"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Authentic Botanical Feedstock
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/quality/extra-neutral-alcohol"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Bonded Extra Neutral Alcohol (ENA)
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/quality/laboratories-chromatography"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        QC Labs & HPTLC Chromatography
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/quality/demineralized-water"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Multi-Stage Demineralized Water (WFI)
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/quality/stainless-steel-vessels"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        SS-316 Fabrication & Succussion
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="pb-3 mb-3 border-b border-[rgba(18,21,15,0.08)]">
                    <span className="font-serif font-semibold text-base text-[#12150F]">
                      Regulatory & Accreditations
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="/certifications"
                        className="text-[#1F4D3A] font-medium flex items-center gap-1 hover:underline"
                      >
                        View All Quality Certificates <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/certifications"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        ISO 9001:2015 Quality Management
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/certifications"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Good Manufacturing Practices (GMP Schedule M)
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/certifications"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        HACCP Assurance
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/batches"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Public Batch Traceability Portal
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#FAF8F2] p-5 rounded-md border border-[#C9A227]/25 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-semibold text-[#8C6D13] tracking-wider">
                      Regulatory Compliance
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#12150F] mt-1">
                      Drugs & Cosmetics Act
                    </h4>
                    <p className="text-xs text-[#595C54] mt-1.5 leading-relaxed">
                      All manufacturing operations are continuously audited under Drug License No. HL-792 M conforming to Schedule M-I.
                    </p>
                  </div>
                  <Link
                    href="/quality"
                    className="text-xs font-semibold text-[#8C6D13] hover:underline inline-flex items-center gap-1 mt-4"
                  >
                    Quality Overview Hub <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {activeMegaMenu === 'company' && (
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="pb-3 mb-3 border-b border-[rgba(18,21,15,0.08)]">
                    <span className="font-serif font-semibold text-base text-[#12150F]">
                      Company Profile
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="/about"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Company History & Heritage (2003)
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/founder"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Founder’s Interview: Dr. Tarak Prasad Chatterjee
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/vision-mission"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Vision, Mission & Guiding Values
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about/research"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Research & Development Division
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="pb-3 mb-3 border-b border-[rgba(18,21,15,0.08)]">
                    <span className="font-serif font-semibold text-base text-[#12150F]">
                      Engagement & Media
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="/gallery"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Plant & Laboratory Gallery
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/distributor-enquiry"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Become an Authorized Distributor
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        className="text-[#595C54] hover:text-[#1F4D3A] block transition-colors"
                      >
                        Plant Location & Coordinates
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#F5F5F2] p-5 rounded-md border border-[rgba(18,21,15,0.08)]">
                  <span className="text-xs uppercase font-semibold text-[#595C54] tracking-wider">
                    Founding Principle
                  </span>
                  <blockquote className="font-serif italic text-sm text-[#12150F] mt-2">
                    &ldquo;Every physician should prepare his own medicine.&rdquo;
                  </blockquote>
                  <p className="text-xs text-[#595C54] mt-2">
                    — Dr. T. P. Chatterjee, Former HOD, Obstetrics & Gynaecology, Medinipur Homoeopathic Medical College.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-[#FAFAF8] z-50 overflow-y-auto p-6 border-t border-[rgba(18,21,15,0.08)] flex flex-col justify-between">
          <div className="space-y-4">
            {/* Products Accordion */}
            <div className="border-b border-[rgba(18,21,15,0.08)] pb-3">
              <button
                onClick={() =>
                  setMobileAccordion(mobileAccordion === 'products' ? null : 'products')
                }
                className="w-full flex items-center justify-between text-left font-serif text-lg font-semibold text-[#12150F]"
              >
                <span>Products & Formulary</span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 transition-transform',
                    mobileAccordion === 'products' && 'rotate-180'
                  )}
                />
              </button>
              {mobileAccordion === 'products' && (
                <div className="mt-3 pl-2 space-y-2 text-sm text-[#595C54]">
                  <Link href="/products" className="block py-1 hover:text-[#1F4D3A]">
                    All Products (350+ SKUs)
                  </Link>
                  <Link href="/products/homoeopathy" className="block py-1 hover:text-[#1F4D3A]">
                    Homoeopathy (Tinctures, Tonics, Drops)
                  </Link>
                  <Link href="/products/cosmetics" className="block py-1 hover:text-[#1F4D3A]">
                    Cosmetics & Protectin
                  </Link>
                  <Link href="/products/homoeovet" className="block py-1 hover:text-[#1F4D3A]">
                    Homoeo Vet Animal Care
                  </Link>
                </div>
              )}
            </div>

            {/* Quality Accordion */}
            <div className="border-b border-[rgba(18,21,15,0.08)] pb-3">
              <button
                onClick={() =>
                  setMobileAccordion(mobileAccordion === 'quality' ? null : 'quality')
                }
                className="w-full flex items-center justify-between text-left font-serif text-lg font-semibold text-[#12150F]"
              >
                <span>Quality & Standards</span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 transition-transform',
                    mobileAccordion === 'quality' && 'rotate-180'
                  )}
                />
              </button>
              {mobileAccordion === 'quality' && (
                <div className="mt-3 pl-2 space-y-2 text-sm text-[#595C54]">
                  <Link href="/quality" className="block py-1 hover:text-[#1F4D3A]">
                    Quality Overview Hub
                  </Link>
                  <Link href="/certifications" className="block py-1 hover:text-[#1F4D3A]">
                    ISO, GMP & HACCP Certificates
                  </Link>
                  <Link href="/quality/authentic-feedstock" className="block py-1 hover:text-[#1F4D3A]">
                    Authentic Feedstock
                  </Link>
                  <Link href="/quality/extra-neutral-alcohol" className="block py-1 hover:text-[#1F4D3A]">
                    Bonded Extra Neutral Alcohol
                  </Link>
                  <Link href="/quality/laboratories-chromatography" className="block py-1 hover:text-[#1F4D3A]">
                    Laboratories & HPTLC
                  </Link>
                </div>
              )}
            </div>

            {/* Company Accordion */}
            <div className="border-b border-[rgba(18,21,15,0.08)] pb-3">
              <button
                onClick={() =>
                  setMobileAccordion(mobileAccordion === 'company' ? null : 'company')
                }
                className="w-full flex items-center justify-between text-left font-serif text-lg font-semibold text-[#12150F]"
              >
                <span>Company</span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 transition-transform',
                    mobileAccordion === 'company' && 'rotate-180'
                  )}
                />
              </button>
              {mobileAccordion === 'company' && (
                <div className="mt-3 pl-2 space-y-2 text-sm text-[#595C54]">
                  <Link href="/about" className="block py-1 hover:text-[#1F4D3A]">
                    Company Profile
                  </Link>
                  <Link href="/about/founder" className="block py-1 hover:text-[#1F4D3A]">
                    Founder & Chairman Interview
                  </Link>
                  <Link href="/about/vision-mission" className="block py-1 hover:text-[#1F4D3A]">
                    Vision & Mission
                  </Link>
                  <Link href="/about/research" className="block py-1 hover:text-[#1F4D3A]">
                    R&D Division
                  </Link>
                  <Link href="/gallery" className="block py-1 hover:text-[#1F4D3A]">
                    Photo Gallery
                  </Link>
                </div>
              )}
            </div>

            {/* Direct Links */}
            <div className="pt-1 space-y-3">
              <Link
                href="/batches"
                className="flex items-center justify-between font-serif text-lg font-semibold text-[#1F4D3A]"
              >
                <span>Public Batch Traceability</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/downloads"
                className="flex items-center justify-between font-serif text-lg font-semibold text-[#12150F]"
              >
                <span>Downloads & Vade-Mecum</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/distributor-enquiry"
                className="flex items-center justify-between font-serif text-lg font-semibold text-[#12150F]"
              >
                <span>Distributor Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-between font-serif text-lg font-semibold text-[#12150F]"
              >
                <span>Contact & Plant Map</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-[rgba(18,21,15,0.08)] mt-6">
            <Link href="/contact" className="w-full block">
              <Button variant="primary" size="lg" className="w-full">
                Submit Regulatory / Trade Enquiry
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
