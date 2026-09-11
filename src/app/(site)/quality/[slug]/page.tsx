import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getQualityPillars, getQualityPillarBySlug } from '@/lib/queries';
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QualityPillarProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const pillars = await getQualityPillars();
  return pillars.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: QualityPillarProps): Promise<Metadata> {
  const { slug } = await params;
  const pillar = await getQualityPillarBySlug(slug);

  if (!pillar) {
    return { title: 'Quality Pillar Not Found' };
  }

  return {
    title: `${pillar.title} | PHBL Quality Standards`,
    description: pillar.summary,
  };
}

export const revalidate = 3600;

export default async function QualityPillarDetailPage({
  params,
}: QualityPillarProps) {
  const { slug } = await params;
  const pillar = await getQualityPillarBySlug(slug);

  if (!pillar) {
    notFound();
  }

  const allPillars = await getQualityPillars();
  const currentIndex = allPillars.findIndex((p) => p.slug === pillar.slug);
  const nextPillar = allPillars[(currentIndex + 1) % allPillars.length];

  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/quality"
            className="text-xs font-semibold text-[#1F4D3A] hover:underline inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Quality Pillars</span>
          </Link>
        </div>

        {/* Title & Summary */}
        <div className="space-y-4 border-b border-[rgba(18,21,15,0.08)] pb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#1F4D3A] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Pillar 0{pillar.order} · Schedule M Standard</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F] leading-tight">
            {pillar.title}
          </h1>

          <p className="text-base sm:text-lg text-[#595C54] leading-relaxed">
            {pillar.summary}
          </p>
        </div>

        {/* Technical Content Monograph */}
        <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] p-8 sm:p-10 space-y-6">
          <div className="prose prose-neutral max-w-none text-sm sm:text-base text-[#12150F] leading-relaxed space-y-4 whitespace-pre-line">
            {pillar.body}
          </div>

          <div className="pt-6 border-t border-[rgba(18,21,15,0.08)] flex items-center gap-3 text-xs text-[#595C54]">
            <CheckCircle2 className="w-4 h-4 text-[#1F4D3A]" />
            <span>
              Subject to regular regulatory verification under Drug License HL-792 M.
            </span>
          </div>
        </div>

        {/* Next Pillar Navigation */}
        {nextPillar && (
          <div className="p-6 bg-white rounded-md border border-[rgba(18,21,15,0.08)] flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-[#595C54]">
                Next Quality Pillar
              </span>
              <h4 className="font-serif text-lg font-bold text-[#12150F]">
                {nextPillar.title}
              </h4>
            </div>
            <Link href={`/quality/${nextPillar.slug}`}>
              <Button variant="primary" size="md" className="gap-2 font-medium">
                <span>Next Pillar</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
