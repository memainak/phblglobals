import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { ArrowRight, CheckCircle2, FlaskConical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const packSizeDisplay = product.packSizes
    .slice(0, 3)
    .map((p) => p.size)
    .join(' · ');

  const activeComposition = product.composition
    .slice(0, 2)
    .map((c) => `${c.ingredient} (${c.strength})`)
    .join(', ');

  const formatSubCategory = (sub: string) => {
    return sub.replace(/-/g, ' ').toUpperCase();
  };

  const primaryImage = product.images?.[0];

  return (
    <article className="group bg-white rounded-md border border-[rgba(18,21,15,0.08)] hover:border-[#1F4D3A]/40 transition-all duration-200 flex flex-col justify-between overflow-hidden hover:-translate-y-1">
      <div>
        {/* Top Header with Badges */}
        <div className="p-4 pb-0 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Badge variant="botanical" className="text-[10px] tracking-wider font-semibold">
              {formatSubCategory(product.subCategory)}
            </Badge>
            {(product.isNew || (product.category === 'cosmetics' && (product.id.startsWith('prod-1') || product.id === 'prod-20'))) && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-[9px] font-bold tracking-tight shadow-2xs">
                NEW LAUNCH
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-[#595C54] tracking-tight">
            {packSizeDisplay}
          </span>
        </div>

        {/* Product Visual Container (Clean Clinical Staging) */}
        <Link
          href={`/products/${product.category}/${product.slug}`}
          className="block px-6 py-6"
        >
          <div className="w-full aspect-square rounded-sm bg-[#F5F5F2] border border-[rgba(18,21,15,0.04)] flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-[#EFEFEA] transition-colors">
            {primaryImage ? (
              <div className="relative w-full h-full p-2">
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ) : (
              /* Fallback Graphic */
              <div className="w-20 h-28 rounded-sm bg-gradient-to-b from-[#2A241B] to-[#120F0B] shadow-md border border-amber-900/30 flex flex-col items-center justify-between p-2 text-center text-white/90">
                <div className="w-6 h-3 rounded-t-sm bg-neutral-300 mx-auto" />
                <div className="space-y-1">
                  <span className="text-[7px] tracking-widest uppercase font-mono text-amber-200">
                    PHBL
                  </span>
                  <p className="text-[8px] font-serif leading-none line-clamp-2 px-1 text-white font-bold">
                    {product.name}
                  </p>
                </div>
                <span className="text-[6px] font-mono text-emerald-400">
                  BONDED MFG
                </span>
              </div>
            )}

            {/* Micro overlay icon */}
            <div className="absolute bottom-2 right-2 p-1 rounded bg-white/80 backdrop-blur-xs text-[#595C54] z-10">
              <FlaskConical className="w-3 h-3 text-[#1F4D3A]" />
            </div>
          </div>
        </Link>

        {/* Content Details */}
        <div className="px-5 pb-4 space-y-2.5">
          <h3 className="font-serif font-bold text-lg text-[#12150F] group-hover:text-[#1F4D3A] transition-colors leading-tight">
            <Link href={`/products/${product.category}/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          {/* Legal Wording: Indications (Not Cures) */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#595C54]">
              Indications:
            </span>
            <p className="text-xs text-[#595C54] line-clamp-2 leading-relaxed">
              {product.indications}
            </p>
          </div>

          {/* Active Composition Monograph */}
          <div className="text-[11px] text-[#1F4D3A] font-medium bg-[#F0F5F2] px-2.5 py-1.5 rounded-sm line-clamp-1 border border-[#1F4D3A]/10">
            <span className="font-semibold">Actives:</span> {activeComposition}
          </div>
        </div>
      </div>

      {/* Card Footer: Action & Traceability */}
      <div className="px-5 py-3 border-t border-[rgba(18,21,15,0.06)] bg-[#FAFAF8] flex items-center justify-between text-xs">
        <Link
          href={`/products/${product.category}/${product.slug}`}
          className="font-semibold text-[#1F4D3A] hover:text-[#16382A] inline-flex items-center gap-1 group/btn"
        >
          <span>Monograph</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>

        <Link
          href={`/batches?productId=${product.id}`}
          className="inline-flex items-center gap-1 text-[11px] text-emerald-800 hover:underline font-medium"
          title="View verified batches for this formulation"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Batch Verified</span>
        </Link>
      </div>
    </article>
  );
}
