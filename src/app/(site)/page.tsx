import React from 'react';
import { Hero } from '@/components/site/Hero';
import { TrustStats } from '@/components/site/TrustStats';
import { AboutTeaser } from '@/components/site/AboutTeaser';
import { ProductShowcase } from '@/components/site/ProductShowcase';
import { Capabilities } from '@/components/site/Capabilities';
import { QualityPolicy } from '@/components/site/QualityPolicy';
import { BatchVerificationCallout } from '@/components/site/BatchVerificationCallout';
import { TestimonialsSection } from '@/components/site/TestimonialsSection';
import { BookletCta } from '@/components/site/BookletCta';
import { getSiteSettings, getProducts, getTestimonials } from '@/lib/queries';

export const revalidate = 3600; // ISR 1 hour

export default async function HomePage() {
  const [settings, allProducts, testimonials] = await Promise.all([
    getSiteSettings(),
    getProducts(),
    getTestimonials(),
  ]);

  // Extract newly launched products (up to 8)
  const newProducts = allProducts
    .filter((p) => p.isNew || (p.category === 'cosmetics' && (p.id.startsWith('prod-1') || p.id === 'prod-20')))
    .slice(0, 8);

  return (
    <>
      {/* 1. Hero with Newly Launched Auto-Sliding Products */}
      <Hero newProducts={newProducts} />

      {/* 2. Trust Stats */}
      <TrustStats stats={settings.stats} />

      {/* 3. About Teaser */}
      <AboutTeaser />

      {/* 4. Product Showcase */}
      <ProductShowcase products={allProducts} />

      {/* 5. Capabilities */}
      <Capabilities />

      {/* 6. Quality Policy */}
      <QualityPolicy />

      {/* 7. Batch Verification Widget */}
      <BatchVerificationCallout />

      {/* 8. Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 9. Booklet CTA */}
      <BookletCta />
    </>
  );
}
