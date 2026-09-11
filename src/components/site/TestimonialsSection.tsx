import React from 'react';
import { Testimonial } from '@/types';
import { Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-20 bg-white border-b border-[rgba(18,21,15,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1F4D3A]">
            Clinical & Trade Endorsements
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#12150F]">
            Trusted by Practitioners and Distributors
          </h2>
          <p className="text-sm text-[#595C54]">
            Practitioners rely on standardisation to achieve predictable therapeutic outcomes across chronic and acute clinical presentations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-md bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)] flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <Quote className="w-6 h-6 text-[#1F4D3A]/40" />
                <blockquote className="font-serif italic text-sm sm:text-base text-[#12150F] leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              <div className="pt-4 border-t border-[rgba(18,21,15,0.08)] space-y-0.5">
                <h4 className="font-bold text-sm text-[#12150F]">
                  {item.author}
                </h4>
                <p className="text-xs text-[#1F4D3A] font-medium">
                  {item.role}
                </p>
                {item.clinicOrInstitution && (
                  <p className="text-xs text-[#595C54]">
                    {item.clinicOrInstitution}, {item.location}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
