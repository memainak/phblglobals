import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBatches, getProducts, getReferenceItems, getReferenceSchedule } from '@/lib/queries';
import { ProductCatalogFilter } from '@/components/site/ProductCatalogFilter';
import { ProductCard } from '@/components/site/ProductCard';
import { DilutionReference } from '@/components/site/DilutionReference';
import { MotherTinctureReference } from '@/components/site/MotherTinctureReference';
import { GnctDelhiRange, buildGnctRows } from '@/components/site/GnctDelhiRange';

import { ProductCategory } from '@/types';
import Link from 'next/link';
import { ArrowLeft, Boxes, ArrowRight } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

const categoryMeta: Record<
  ProductCategory,
  { title: string; subtitle: string; description: string }
> = {
  homoeopathy: {
    title: 'Homoeopathy Products',
    subtitle: 'Patent Tonics · Drops · Mother Tinctures · Dilutions · Biochemics · Tablets · Ointments · GNCT Delhi',
    description:
      'Classical and patent homoeopathic medicines prepared in strict accordance with the Homoeopathic Pharmacopoeia of India (HPI) using 100% pure Extra Neutral Alcohol (ENA).',
  },
  cosmetics: {
    title: 'PHBL Naturals · Cosmetics & Herbal Care Range',
    subtitle: 'Newly Launched Botanical Skin Care, Shampoos, Hair Oils & Creams',
    description:
      'Pure herbal formulations combining classical homoeopathic botanicals (Neem, Tulsi, Arnica, Calendula, Berberis, Aloe Vera) with modern dermatological standards. 100% natural extracts, sulphate-free, paraben-free, and cruelty-free.',
  },
  homoeovet: {
    title: 'Homoeo Vet Animal Health Range',
    subtitle: 'Veterinary Homoeopathic Formulations for Livestock & Bovine Care',
    description:
      'Residue-free, organic veterinary homoeopathy for mastitis, lactation optimization, and animal vitality without synthetic hormones or antibiotics.',
  },
};

/**
 * The homoeopathy catalogue is presented as seven named sub-ranges, in the same
 * order the trade literature lists them, all under one main heading.
 */
const HOMOEOPATHY_RANGES: {
  subCategory: string;
  label: string;
  blurb: string;
}[] = [
  {
    subCategory: 'patent-tonic',
    label: 'Patent (Tonic)',
    blurb: 'Proprietary syrups and restorative tonics compounded to PHBL formulae.',
  },
  {
    subCategory: 'drops',
    label: 'Drop Products',
    blurb: 'Clinical specialty drops for targeted indications.',
  },
  {
    subCategory: 'mother-tincture',
    label: 'Mother Tincture',
    blurb: 'Classical Ø extracts in 100% ENA. Search the 258-remedy index below for grade and pack pricing.',
  },
  {
    subCategory: 'dilution',
    label: 'Dilution',
    blurb: 'Potentised dilutions supplied across the full potency range. Search the remedy index below.',
  },
  {
    subCategory: 'biochemic',
    label: 'Biochemic',
    blurb: 'Schuessler tissue salts and biochemic compounds, including the upcoming tablet range.',
  },
  {
    subCategory: 'tablets',
    label: 'Homoeopathy Tablet',
    blurb: 'Compressed tablet presentations of the patent range.',
  },
  {
    subCategory: 'ointment',
    label: 'Ointment',
    blurb: 'External applications prepared on a bonded ointment base.',
  },
  {
    subCategory: 'gnct-delhi',
    label: 'GNCT Delhi',
    blurb:
      'Batches notified to the Government of NCT of Delhi licensing authority, with the current status of each.',
  },
];

export async function generateStaticParams() {
  return [
    { category: 'homoeopathy' },
    { category: 'cosmetics' },
    { category: 'homoeovet' },
  ];
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const validCategory = category as ProductCategory;
  const meta = categoryMeta[validCategory];

  if (!meta) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${meta.title} | PHBL Formulary`,
    description: meta.description,
  };
}

export const revalidate = 3600;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const validCategory = category as ProductCategory;
  const meta = categoryMeta[validCategory];

  if (!meta) {
    notFound();
  }

  const allProducts = await getProducts();

  const isHomoeopathy = validCategory === 'homoeopathy';
  const [mtItems, dilItems, bioItems, mtSchedule, dilSchedule, gnctBatches] = isHomoeopathy
    ? await Promise.all([
        getReferenceItems('mother-tincture'),
        getReferenceItems('dilution'),
        getReferenceItems('biochemic'),
        getReferenceSchedule('mother-tincture'),
        getReferenceSchedule('dilution'),
        getBatches({ authority: 'GNCT DELHI', pageSize: 500 }),
      ])
    : [[], [], [], null, null, { batches: [], total: 0 }];

  const mtRemedies = mtItems.map((i) => ({ sl: i.sl, name: i.name, cat: i.cat ?? '' }));
  const dilRemedies = dilItems.map((i) => i.name);
  const upcomingBiochemic = bioItems.map((i) => ({
    name: i.name,
    potencies: i.potencies ?? null,
  }));

  // The GNCT Delhi register covers the externally-applied ointment batches; the
  // same authority also appears on other batch records, so narrow to those.
  const slugByBrand = new Map(
    allProducts
      .filter((p) => p.category === 'homoeopathy')
      .map((p) => [p.name.trim().toLowerCase(), p.slug] as const)
  );
  const gnctRows = buildGnctRows(
    gnctBatches.batches.filter((b) => /^ointment\b/i.test(b.apiName ?? '')),
    slugByBrand
  );

  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/products"
            className="text-xs font-semibold text-[#1F4D3A] hover:underline inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Categories</span>
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-2 border-b border-[rgba(18,21,15,0.08)] pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#1F4D3A] uppercase tracking-wider">
            <Boxes className="w-4 h-4" />
            <span>{meta.subtitle}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F]">
            {meta.title}
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-3xl leading-relaxed">
            {meta.description}
          </p>
        </div>

        {/* Cosmetics Highlight Banner & 3-Hero Poster Showcase */}
        {validCategory === 'cosmetics' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-gradient-to-r from-[#EBF5EE] via-[#F4F9F6] to-[#FAF8F5] border border-[#1F4D3A]/20 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1F4D3A] text-white text-[10px] font-mono font-semibold tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    OFFICIAL NEW LAUNCH
                  </span>
                  <span className="text-xs font-semibold text-[#1F4D3A]">
                    8 New PHBL Naturals Formulations Available
                  </span>
                </div>
                <p className="text-xs text-[#595C54] leading-relaxed">
                  Formulated under the clinical supervision of <strong>Dr. Trinath</strong> at our Saratpally, Paschim Medinipur facility. Enriched with authentic mother tinctures & herbal extracts for daily skin purification, deep dandruff control, root revitalization, and dermatological protection.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#1F4D3A] font-medium shrink-0">
                <span className="px-2.5 py-1 rounded bg-white border border-[#1F4D3A]/20 shadow-2xs">
                  🌿 100% Herbal Actives
                </span>
                <span className="px-2.5 py-1 rounded bg-white border border-[#1F4D3A]/20 shadow-2xs">
                  ✨ Zero Parabens
                </span>
                <span className="px-2.5 py-1 rounded bg-white border border-[#1F4D3A]/20 shadow-2xs">
                  🐰 Cruelty Free
                </span>
              </div>
            </div>

            {/* 3 Newly Launched Spotlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  slug: 'phbl-activated-charcoal-facewash',
                  name: "Activated Charcoal Facewash",
                  tagline: "Naturally Powerful Purifying Complex",
                  sub: "Face Wash · 100 ml",
                  img: '/images/products/phbl-activated-charcoal-facewash.webp',
                },
                {
                  slug: 'phbl-arnica-rosemary-hibiscus-oil',
                  name: "Arnica with Rosemary & Hibiscus Oil",
                  tagline: "Nourish Nature, Embrace Beauty",
                  sub: "Hair Care Oil · 100 ml",
                  img: '/images/products/phbl-arnica-rosemary-hibiscus-oil.webp',
                },
                {
                  slug: 'phbl-neem-tulsi-facewash',
                  name: "Neem & Tulsi Face Wash",
                  tagline: "Nature's Touch for Healthy Glowing Skin",
                  sub: "Face Wash · 100 ml",
                  img: '/images/products/phbl-neem-tulsi-facewash.webp',
                },
              ].map((heroItem) => (
                <Link
                  key={heroItem.slug}
                  href={`/products/cosmetics/${heroItem.slug}`}
                  className="group block bg-white rounded-xl border border-[rgba(18,21,15,0.08)] hover:border-[#1F4D3A]/40 shadow-sm hover:shadow-md transition-all overflow-hidden p-4"
                >
                  <div className="relative w-full aspect-3/4 rounded-lg bg-[#F7F7F4] overflow-hidden flex items-center justify-center p-2 mb-3">
                    <Image
                      src={heroItem.img}
                      alt={heroItem.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#1F4D3A] text-white text-[9px] font-mono font-semibold tracking-wider shadow-xs">
                      FEATURED LAUNCH
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#1F4D3A] font-semibold uppercase tracking-wider block">
                      {heroItem.sub}
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#12150F] group-hover:text-[#1F4D3A] transition-colors line-clamp-1">
                      {heroItem.name}
                    </h3>
                    <p className="text-xs text-[#595C54] line-clamp-1 italic">
                      {heroItem.tagline}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs text-[#1F4D3A] font-medium border-t border-[rgba(18,21,15,0.06)]">
                      <span>View Monograph</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {validCategory === 'homoeopathy' ? (
          <div className="space-y-12">
            {/* Jump nav across the seven sub-ranges */}
            <nav className="flex flex-wrap gap-2">
              {HOMOEOPATHY_RANGES.map((range) => {
                const count =
                  range.subCategory === 'gnct-delhi'
                    ? gnctRows.length
                    : allProducts.filter(
                        (p) => p.category === 'homoeopathy' && p.subCategory === range.subCategory
                      ).length;
                return (
                  <a
                    key={range.subCategory}
                    href={`#${range.subCategory}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[rgba(18,21,15,0.12)] text-xs font-medium text-[#12150F] hover:border-[#1F4D3A]/40 hover:text-[#1F4D3A] transition-colors"
                  >
                    <span>{range.label}</span>
                    {range.subCategory !== 'dilution' && (
                      <span className="font-mono text-[10px] text-[#595C54]">{count}</span>
                    )}
                  </a>
                );
              })}
            </nav>

            {HOMOEOPATHY_RANGES.map((range) => {
              const rangeProducts = allProducts.filter(
                (p) => p.category === 'homoeopathy' && p.subCategory === range.subCategory
              );

              return (
                <section key={range.subCategory} id={range.subCategory} className="scroll-mt-28 space-y-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[rgba(18,21,15,0.08)] pb-3">
                    <div className="space-y-1">
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#12150F]">
                        {range.label}
                      </h2>
                      <p className="text-xs text-[#595C54]">{range.blurb}</p>
                    </div>
                    {range.subCategory === 'gnct-delhi' ? (
                      <span className="text-xs font-mono text-[#595C54] shrink-0">
                        {gnctRows.length} {gnctRows.length === 1 ? 'notified batch' : 'notified batches'}
                      </span>
                    ) : range.subCategory !== 'dilution' ? (
                      <span className="text-xs font-mono text-[#595C54] shrink-0">
                        {rangeProducts.length} {rangeProducts.length === 1 ? 'formulation' : 'formulations'}
                      </span>
                    ) : null}
                  </div>

                  {range.subCategory === 'mother-tincture' && <MotherTinctureReference remedies={mtRemedies} schedule={mtSchedule} />}

                  {range.subCategory === 'biochemic' && (
                    <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] overflow-hidden">
                      <div className="px-4 py-3 border-b border-[rgba(18,21,15,0.08)] bg-[#FAFAF8] flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1F4D3A] text-white text-[10px] font-mono font-semibold tracking-wider">
                          UPCOMING
                        </span>
                        <span className="text-xs font-mono uppercase tracking-wider text-[#1F4D3A]">
                          Bio-Chemic Tablet Range
                        </span>
                      </div>
                      <ul className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                        {upcomingBiochemic.map((item) => (
                          <li
                            key={item.name}
                            className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-sm py-1.5 border-b border-[rgba(18,21,15,0.05)]"
                          >
                            <span className="font-medium text-[#12150F]">{item.name}</span>
                            <span className="font-mono text-[11px] text-[#595C54]">
                              {item.potencies ?? 'Potencies to be confirmed'}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="px-4 py-3 text-[11px] text-[#595C54] border-t border-[rgba(18,21,15,0.06)] bg-[#FAFAF8]">
                        Announced for release and not yet on the published price list. Contact the
                        plant for availability.
                      </p>
                    </div>
                  )}

                  {range.subCategory === 'dilution' ? (
                    <DilutionReference remedies={dilRemedies} schedule={dilSchedule} />
                  ) : range.subCategory === 'gnct-delhi' ? (
                    <GnctDelhiRange rows={gnctRows} />
                  ) : rangeProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {rangeProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#595C54] bg-white border border-[rgba(18,21,15,0.08)] rounded-md px-4 py-6">
                      This range is manufactured to order. Contact the plant for the current
                      potency and pack schedule.
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <ProductCatalogFilter
            initialProducts={allProducts}
            initialCategory={validCategory}
          />
        )}
      </div>
    </div>
  );
}
