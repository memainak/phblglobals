import React from 'react';
import { FlaskConical, Factory, Network } from 'lucide-react';

export function Capabilities() {
  const capabilities = [
    {
      icon: FlaskConical,
      title: 'Homoeopathic Formulation & Potentisation',
      description:
        'Standardised extraction under strict HPI guidelines. Combining botanical microscopy, organoleptic validation, and calibrated mechanised succussion.',
      badge: 'Classical Science',
    },
    {
      icon: Factory,
      title: 'Bonded Cleanroom Manufacturing',
      description:
        'Operating licensed bonded facilities (HL-792 M) utilizing 100% Extra Neutral Alcohol, Class 10,000 cleanrooms, and automated SS-316 filling lines.',
      badge: 'Schedule M-I',
    },
    {
      icon: Network,
      title: 'Institutional & Wholesale Distribution',
      description:
        'Supplying over 120 authorized stockists, medical college hospitals, government AYUSH dispensaries, and retail pharmacies across 18 states.',
      badge: 'Nationwide Reach',
    },
  ];

  return (
    <section className="py-20 bg-[#FAFAF8] border-b border-[rgba(18,21,15,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1F4D3A]">
            Core Competencies
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#12150F]">
            Integrated Pharmaceutical Infrastructure
          </h2>
          <p className="text-sm text-[#595C54]">
            Precision engineering and regulatory discipline applied across every phase of the homoeopathic life-cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-md border border-[rgba(18,21,15,0.08)] space-y-4 hover:border-[#1F4D3A]/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-sm bg-[#F0F5F2] text-[#1F4D3A] flex items-center justify-center border border-[#1F4D3A]/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#595C54] bg-[#F5F5F2] px-2 py-0.5 rounded-xs">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#12150F]">
                  {item.title}
                </h3>

                <p className="text-sm text-[#595C54] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
