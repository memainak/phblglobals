'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Mail, X, ShieldCheck } from 'lucide-react';

interface AnnouncementBarProps {
  tollFree?: string;
  email?: string;
}

export function AnnouncementBar({
  tollFree = '9800011545',
  email = 'phblkn@gmail.com',
}: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(true); // default true to prevent SSR hydration flicker

  useEffect(() => {
    const isDismissed = localStorage.getItem('phbl_announcement_dismissed');
    if (!isDismissed) {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('phbl_announcement_dismissed', 'true');
  };

  if (dismissed) return null;

  return (
    <aside aria-label="Announcement" className="bg-[#1F4D3A] text-white text-xs py-2 px-4 border-b border-[#16382A]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-flex items-center gap-1.5 text-emerald-200 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bonded Mfg Lic: HL-792 M</span>
            <span className="sm:hidden">Lic: HL-792 M</span>
          </span>

          <span className="text-white/40 hidden md:inline">|</span>

          <a
            href={`tel:${tollFree}`}
            className="hidden md:inline-flex items-center gap-1.5 hover:text-white/90 text-white/80 transition-colors"
          >
            <Phone className="w-3 h-3 text-emerald-300" />
            <span>Toll-Free: {tollFree}</span>
          </a>

          <span className="text-white/40 hidden lg:inline">|</span>

          <a
            href={`mailto:${email}`}
            className="hidden lg:inline-flex items-center gap-1.5 hover:text-white/90 text-white/80 transition-colors"
          >
            <Mail className="w-3 h-3 text-emerald-300" />
            <span>{email}</span>
          </a>

          <span className="text-white/90 truncate">
            GMP & ISO 9001:2015 Certified Homoeopathic Manufacturing Facility · Estd. 2003
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/contact"
            className="underline underline-offset-2 hover:text-emerald-200 font-medium transition-colors"
          >
            Contact Plant
          </Link>
          <button
            onClick={handleDismiss}
            className="text-white/60 hover:text-white p-0.5 rounded transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
