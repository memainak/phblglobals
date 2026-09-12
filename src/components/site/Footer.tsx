'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Phone, Mail, MapPin, Printer } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#12150F] text-[#FAFAF8] pt-16 pb-12 border-t border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Licensing */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block bg-white px-3 py-1.5 rounded-sm border border-white/20 shadow-xs hover:opacity-95 transition-opacity">
              <Image
                src="/images/phbl-logo.png"
                alt="Purusottam Homeo Bikash Lab(Bonded)"
                width={220}
                height={38}
                className="h-8 w-auto object-contain"
              />
            </Link>

            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Purusottam Homeo Bikash Lab(Bonded). Licensed manufacturer of homoeopathic, herbal, cosmetic, and veterinary pharmaceutical preparations since 2003.
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-neutral-300 font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Drug Mfg License: HL-792 M (Bonded)</span>
              </div>
              <div className="text-neutral-400">
                Certifications: ISO 9001:2015 · GMP (Schedule M-I) · HACCP
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Formulary & Data
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Product Catalogue (350+)
                </Link>
              </li>
              <li>
                <Link href="/products/homoeopathy" className="hover:text-white transition-colors">
                  Mother Tinctures & Tonics
                </Link>
              </li>
              <li>
                <Link href="/batches" className="hover:text-white transition-colors flex items-center gap-1.5 text-emerald-300 font-medium">
                  Public Batch Verification
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="hover:text-white transition-colors">
                  Therapeutic Index (PDF)
                </Link>
              </li>
              <li>
                <Link href="/quality" className="hover:text-white transition-colors">
                  Quality Pillars & Lab
                </Link>
              </li>
              <li>
                <Link href="/certifications" className="hover:text-white transition-colors">
                  Accreditation Certificates
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Institution
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Company Profile & Story
                </Link>
              </li>
              <li>
                <Link href="/about/founder" className="hover:text-white transition-colors">
                  Founder: Dr. T. P. Chatterjee
                </Link>
              </li>
              <li>
                <Link href="/about/vision-mission" className="hover:text-white transition-colors">
                  Vision, Mission & Values
                </Link>
              </li>
              <li>
                <Link href="/about/research" className="hover:text-white transition-colors">
                  R&D & Standardization
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Plant & Cleanroom Gallery
                </Link>
              </li>
              <li>
                <Link href="/distributor-enquiry" className="hover:text-white transition-colors">
                  Distributor Application
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Coordinates */}
          <div className="space-y-3 text-sm text-neutral-400">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Plant Coordinates
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-neutral-300">
                  L/3, Saratpally, Paschim Medinipur, Pin 721101, West Bengal, India
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-xs text-neutral-300">
                  <a href="tel:9800011545" className="hover:text-white font-medium">9800011545</a> (Helpline)
                  <span className="mx-1">/</span>
                  <a href="tel:9933301021" className="hover:text-white">9933301021</a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-neutral-400">Fax: 8250461569</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:phblkn@gmail.com" className="text-xs text-neutral-300 hover:text-white">
                  phblkn@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Regulatory Disclaimer Section (India Drugs & Magic Remedies Act 1954 Compliance) */}
        <div className="pt-8 pb-6 border-b border-white/10 text-xs text-neutral-400 space-y-2 leading-relaxed">
          <p className="font-semibold text-neutral-300">
            STATUTORY MEDICAL & PHARMACEUTICAL DISCLAIMER:
          </p>
          <p>
            The information contained on this website is intended solely for educational, technical, and professional reference by registered homoeopathic practitioners, distributors, retailers, and regulatory drug authorities. This information is not intended to diagnose, treat, prevent, or cure any disease. Under no circumstances should information here be used as a substitute for professional medical advice from a registered healthcare physician.
          </p>
          <p>
            In compliance with the <strong>Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954</strong> and the <strong>Drugs and Cosmetics Act & Rules, 1945</strong>, PHBL does not make any claims of magical, instantaneous, or guaranteed cures. All formulations are manufactured in strict conformance with the Homoeopathic Pharmacopoeia of India (HPI) and standard pharmacopoeial codices.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Legal Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} Purusottam Homeo Bikash Lab(Bonded). All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-neutral-300 transition-colors">
              Privacy Policy (DPDP Act)
            </Link>
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">
              Terms of Supply
            </Link>
            <Link href="/disclaimer" className="hover:text-neutral-300 transition-colors">
              Legal Disclaimer
            </Link>
            <Link href="/admin" className="hover:text-neutral-300 transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
