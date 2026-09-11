'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BatchSearchWidgetProps {
  className?: string;
  placeholder?: string;
  buttonText?: string;
}

export function BatchSearchWidget({
  className = '',
  placeholder = 'Enter Batch No. (e.g. BL-2024-0101)',
  buttonText = 'Verify Batch',
}: BatchSearchWidgetProps) {
  const [batchNo, setBatchNo] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = batchNo.trim();
    if (!clean) return;
    router.push(`/batches/${encodeURIComponent(clean)}`);
  };

  return (
    <form onSubmit={handleSearch} className={`relative flex flex-col sm:flex-row gap-2 ${className}`}>
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#595C54]/70">
          <ShieldCheck className="w-4 h-4 text-[#1F4D3A]" />
        </div>
        <input
          type="text"
          value={batchNo}
          onChange={(e) => setBatchNo(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 pl-10 pr-4 text-sm font-mono tracking-wider uppercase rounded-md border border-[rgba(18,21,15,0.18)] bg-white text-[#12150F] placeholder:text-[#595C54]/50 placeholder:font-sans placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-[#1F4D3A] focus:border-[#1F4D3A] transition-colors"
          required
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="h-12 px-6 shrink-0 gap-2 font-medium"
      >
        <span>{buttonText}</span>
        <ArrowRight className="w-4 h-4" />
      </Button>
    </form>
  );
}
