'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

export function WhatsAppButton() {
  const phoneNumber = '919800011545';
  const prefilledMessage = encodeURIComponent(
    'Hello PHBL Team, I am inquiring regarding pharmaceutical product availability, batch verification, or distributorship.'
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${prefilledMessage}`;

  return (
    <aside aria-label="WhatsApp Quick Inquiry" className="fixed bottom-6 right-6 z-50 no-print">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with PHBL on WhatsApp"
        className="flex items-center gap-2.5 bg-[#1F4D3A] hover:bg-[#16382A] text-white py-3 px-4 rounded-full shadow-lg border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95 group"
      >
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 group-hover:text-white">
          <MessageSquare className="w-4 h-4 fill-current" />
        </div>
        <span className="text-xs font-semibold tracking-wide hidden sm:inline">
          Trade Inquiry via WhatsApp
        </span>
      </a>
    </aside>
  );
}
