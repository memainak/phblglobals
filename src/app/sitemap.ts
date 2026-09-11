import { MetadataRoute } from 'next';
import { getProducts, getAllBatchNumbers, getQualityPillars } from '@/lib/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://phblglobals.com';

  // Static site routes
  const staticRoutes = [
    '',
    '/about',
    '/about/founder',
    '/about/vision-mission',
    '/about/research',
    '/products',
    '/products/homoeopathy',
    '/products/cosmetics',
    '/products/homoeovet',
    '/quality',
    '/certifications',
    '/batches',
    '/gallery',
    '/downloads',
    '/contact',
    '/distributor-enquiry',
    '/privacy',
    '/terms',
    '/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route.startsWith('/batches') ? 0.9 : 0.8,
  }));

  // Dynamic products
  const products = await getProducts();
  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/products/${p.category}/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  // Dynamic batches
  const batchNos = await getAllBatchNumbers();
  const batchRoutes = batchNos.map((batchNo) => ({
    url: `${baseUrl}/batches/${encodeURIComponent(batchNo)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Dynamic quality pillars
  const pillars = await getQualityPillars();
  const pillarRoutes = pillars.map((qp) => ({
    url: `${baseUrl}/quality/${qp.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...productRoutes, ...batchRoutes, ...pillarRoutes];
}
