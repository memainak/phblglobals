import React from 'react';
import { SiteSettings } from '@/types';

interface TrustStatsProps {
  stats: SiteSettings['stats'];
}

export function TrustStats({ stats }: TrustStatsProps) {
  return (
    <section className="bg-white border-b border-[rgba(18,21,15,0.08)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[rgba(18,21,15,0.08)]">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center md:items-start text-center md:text-left ${
                idx > 0 ? 'pt-6 md:pt-0 md:pl-8' : ''
              }`}
            >
              <div className="flex items-baseline font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F4D3A] tracking-tight">
                <span>{item.value}</span>
                <span className="text-2xl text-[#C9A227] ml-0.5">{item.suffix}</span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-[#595C54] font-medium leading-snug">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
