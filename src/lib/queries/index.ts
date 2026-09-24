import { adminDb } from '@/lib/firebase/admin';
import { MOTHER_TINCTURE_REMEDIES, MOTHER_TINCTURE_PRICING, MOTHER_TINCTURE_COMBO_NOTE } from '@/lib/data/motherTinctures';
import { DILUTION_REMEDIES, DILUTION_PRICING, DILUTION_COMBO_NOTE } from '@/lib/data/dilutions';
import { BIOCHEMIC_UPCOMING } from '@/lib/data/biochemic';
import type { Query, DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import {
  Product,
  Batch,
  QualityPillar,
  Certification,
  GalleryItem,
  Download,
  Testimonial,
  SiteSettings,
  Enquiry,
  DistributorEnquiry,
  ReferenceItem,
  ReferenceList,
  ReferenceSchedule,
} from '@/types';
import {
  initialSiteSettings,
  initialProducts,
  initialBatches,
  initialQualityPillars,
  initialCertifications,
  initialGallery,
  initialDownloads,
  initialTestimonials,
} from '@/lib/data/initialData';
import { unstable_noStore as noStore } from 'next/cache';

// In-memory runtime cache / mock fallback for development without live Firestore
const memoryProducts: Product[] = [...initialProducts];
const memoryBatches: Batch[] = [...initialBatches];
const memoryCertifications: Certification[] = [...initialCertifications];
const memoryDownloads: Download[] = [...initialDownloads];
const memoryGallery: GalleryItem[] = [...initialGallery];
const memoryEnquiries: Enquiry[] = [];
const memoryDistributorEnquiries: DistributorEnquiry[] = [];
const memoryTestimonials: Testimonial[] = [...initialTestimonials];
const memorySiteSettings: SiteSettings = { ...initialSiteSettings };

export async function getSiteSettings(): Promise<SiteSettings> {
  if (adminDb) {
    try {
      const snap = await adminDb.collection('settings').doc('site').get();
      if (snap.exists) {
        return snap.data() as SiteSettings;
      }
    } catch (err) {
      console.warn('Error fetching site settings from Firestore, using fallback:', err);
    }
  }
  return memorySiteSettings;
}

export async function getProducts(options?: {
  category?: string;
  featuredOnly?: boolean;
  limitCount?: number;
  includeUnpublished?: boolean;
}): Promise<Product[]> {
  noStore();
  if (adminDb) {
    try {
      const snap = await adminDb.collection('products').get();
      if (!snap.empty) {
        let list = snap.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as Product));
        if (!options?.includeUnpublished) {
          list = list.filter((p) => p.published !== false);
        }
        if (options?.category && options.category !== 'all') {
          list = list.filter((p) => p.category === options.category);
        }
        if (options?.featuredOnly) {
          list = list.filter((p) => p.featured);
        }
        list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
        if (options?.limitCount) {
          list = list.slice(0, options.limitCount);
        }
        return list;
      }
    } catch (err) {
      console.warn('Error fetching products from Firestore, using fallback:', err);
    }
  }

  let list = options?.includeUnpublished ? [...memoryProducts] : memoryProducts.filter((p) => p.published);
  if (options?.category && options.category !== 'all') {
    list = list.filter((p) => p.category === options.category);
  }
  if (options?.featuredOnly) {
    list = list.filter((p) => p.featured);
  }
  list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  if (options?.limitCount) {
    list = list.slice(0, options.limitCount);
  }
  return list;
}

export async function getProductBySlug(category: string, slug: string): Promise<Product | null> {
  noStore();
  // Use index-free getProducts to guarantee consistent live updates without composite index requirement
  const products = await getProducts({ category, includeUnpublished: true });
  const found = products.find((p) => p.slug === slug && p.published !== false);
  return found || null;
}

export async function getBatches(options?: {
  authority?: string;
  query?: string;
  productId?: string;
  page?: number;
  pageSize?: number;
  includeUnpublished?: boolean;
}): Promise<{ batches: Batch[]; total: number }> {
  noStore();
  if (adminDb) {
    try {
      let q: Query<DocumentData> = adminDb.collection('batches');
      if (!options?.includeUnpublished) {
        q = q.where('published', '==', true);
      }
      if (options?.authority && options.authority !== 'all') {
        q = q.where('authority', '==', options.authority);
      }
      if (options?.productId) {
        q = q.where('productId', '==', options.productId);
      }
      const snap = await q.get();
      let allBatches = snap.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as Batch));
      if (!options?.includeUnpublished) {
        allBatches = allBatches.filter((b) => b.published !== false);
      }
      if (options?.query) {
        const searchLower = options.query.toLowerCase().trim();
        allBatches = allBatches.filter(
          (b: Batch) =>
            b.batchNo.toLowerCase().includes(searchLower) ||
            b.brandName.toLowerCase().includes(searchLower) ||
            b.apiName.toLowerCase().includes(searchLower) ||
            (b.uniqueProductCode && b.uniqueProductCode.toLowerCase().includes(searchLower))
        );
      }
      const page = options?.page || 1;
      const pageSize = options?.pageSize || 10;
      const start = (page - 1) * pageSize;
      const paginated = allBatches.slice(start, start + pageSize);
      return { batches: paginated, total: allBatches.length };
    } catch (err) {
      console.warn('Error fetching batches from Firestore, using fallback:', err);
    }
  }

  let list = options?.includeUnpublished ? [...memoryBatches] : memoryBatches.filter((b) => b.published);
  if (options?.authority && options.authority !== 'all') {
    list = list.filter((b) => b.authority.toLowerCase().includes(options.authority!.toLowerCase()));
  }
  if (options?.productId) {
    list = list.filter((b) => b.productId === options.productId);
  }
  if (options?.query) {
    const searchLower = options.query.toLowerCase().trim();
    list = list.filter(
      (b) =>
        b.batchNo.toLowerCase().includes(searchLower) ||
        b.brandName.toLowerCase().includes(searchLower) ||
        b.apiName.toLowerCase().includes(searchLower) ||
        (b.uniqueProductCode && b.uniqueProductCode.toLowerCase().includes(searchLower))
    );
  }
  const page = options?.page || 1;
  const pageSize = options?.pageSize || 10;
  const start = (page - 1) * pageSize;
  const paginated = list.slice(start, start + pageSize);
  return { batches: paginated, total: list.length };
}

export async function getBatchByNo(batchNo: string): Promise<Batch | null> {
  const normalized = batchNo.trim().toUpperCase();
  if (adminDb) {
    try {
      const snap = await adminDb
        .collection('batches')
        .where('batchNo', '==', normalized)
        .where('published', '==', true)
        .limit(1)
        .get();
      if (!snap.empty) {
        const doc = snap.docs[0];
        return { id: doc.id, ...doc.data() } as Batch;
      }
    } catch (err) {
      console.warn('Error fetching batch from Firestore, using fallback:', err);
    }
  }

  const found = memoryBatches.find(
    (b) => b.batchNo.toUpperCase() === normalized && b.published
  );
  return found || null;
}

export async function getAllBatchNumbers(): Promise<string[]> {
  if (adminDb) {
    try {
      const snap = await adminDb.collection('batches').where('published', '==', true).get();
      if (!snap.empty) {
        return snap.docs.map((doc: QueryDocumentSnapshot) => doc.data().batchNo as string);
      }
    } catch (err) {
      console.warn('Error fetching all batch numbers, fallback:', err);
    }
  }
  return memoryBatches.filter((b) => b.published).map((b) => b.batchNo);
}

export async function getQualityPillars(): Promise<QualityPillar[]> {
  if (adminDb) {
    try {
      const snap = await adminDb.collection('qualityPillars').get();
      if (!snap.empty) {
        let list = snap.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as QualityPillar));
        list = list.filter((p) => p.published !== false);
        list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
        return list;
      }
    } catch (err) {
      console.warn('Error fetching quality pillars from Firestore, using fallback:', err);
    }
  }
  return [...initialQualityPillars].sort((a, b) => a.order - b.order);
}

export async function getQualityPillarBySlug(slug: string): Promise<QualityPillar | null> {
  if (adminDb) {
    try {
      const snap = await adminDb
        .collection('qualityPillars')
        .where('slug', '==', slug)
        .where('published', '==', true)
        .limit(1)
        .get();
      if (!snap.empty) {
        const doc = snap.docs[0];
        return { id: doc.id, ...doc.data() } as QualityPillar;
      }
    } catch (err) {
      console.warn('Error fetching quality pillar from Firestore, using fallback:', err);
    }
  }
  return initialQualityPillars.find((p) => p.slug === slug && p.published) || null;
}

export async function getCertifications(): Promise<Certification[]> {
  if (adminDb) {
    try {
      const snap = await adminDb
        .collection('certifications')
        .orderBy('order', 'asc')
        .get();
      if (!snap.empty) {
        return snap.docs.map((d: QueryDocumentSnapshot) => ({ id: d.id, ...d.data() } as Certification));
      }
    } catch (err) {
      console.warn('Error fetching certifications from Firestore, using fallback:', err);
    }
  }
  return [...initialCertifications].sort((a, b) => a.order - b.order);
}

export async function getGalleryItems(album?: string): Promise<GalleryItem[]> {
  if (adminDb) {
    try {
      const snap = await adminDb.collection('gallery').get();
      if (!snap.empty) {
        let items = snap.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as GalleryItem));
        if (album && album !== 'All') {
          items = items.filter((g) => g.album === album);
        }
        items.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
        return items;
      }
    } catch (err) {
      console.warn('Error fetching gallery from Firestore, using fallback:', err);
    }
  }
  let items = [...initialGallery];
  if (album && album !== 'All') {
    items = items.filter((g) => g.album === album);
  }
  return items.sort((a, b) => a.order - b.order);
}

export async function getDownloads(category?: string): Promise<Download[]> {
  if (adminDb) {
    try {
      let q: Query<DocumentData> = adminDb.collection('downloads');
      if (category && category !== 'All') {
        q = q.where('category', '==', category);
      }
      const snap = await q.get();
      if (!snap.empty) {
        return snap.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as Download));
      }
    } catch (err) {
      console.warn('Error fetching downloads from Firestore, using fallback:', err);
    }
  }
  let list = [...initialDownloads];
  if (category && category !== 'All') {
    list = list.filter((d) => d.category === category);
  }
  return list;
}

export async function getTestimonials(options?: {
  includeUnpublished?: boolean;
}): Promise<Testimonial[]> {
  if (adminDb) {
    try {
      const snap = await adminDb.collection('testimonials').get();
      if (!snap.empty) {
        let list = snap.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as Testimonial));
        if (!options?.includeUnpublished) {
          list = list.filter((t) => t.published !== false);
        }
        list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
        return list;
      }
    } catch (err) {
      console.warn('Error fetching testimonials from Firestore, using fallback:', err);
    }
  }
  let list = options?.includeUnpublished
    ? [...memoryTestimonials]
    : memoryTestimonials.filter((t) => t.published !== false);
  return list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

// Write Operations
export async function createEnquiry(data: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<Enquiry> {
  const newEnquiry: Enquiry = {
    ...data,
    id: `enq-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'new',
  };

  if (adminDb) {
    try {
      const ref = await adminDb.collection('enquiries').add(newEnquiry);
      newEnquiry.id = ref.id;
      return newEnquiry;
    } catch (err) {
      console.error('Failed writing enquiry to Firestore:', err);
    }
  }

  memoryEnquiries.unshift(newEnquiry);
  return newEnquiry;
}

export async function createDistributorEnquiry(
  data: Omit<DistributorEnquiry, 'id' | 'createdAt' | 'status'>
): Promise<DistributorEnquiry> {
  const newDist: DistributorEnquiry = {
    ...data,
    id: `dist-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'new',
  };

  if (adminDb) {
    try {
      const ref = await adminDb.collection('distributorEnquiries').add(newDist);
      newDist.id = ref.id;
      return newDist;
    } catch (err) {
      console.error('Failed writing distributor enquiry to Firestore:', err);
    }
  }

  memoryDistributorEnquiries.unshift(newDist);
  return newDist;
}

export async function saveBatch(batchData: Batch): Promise<Batch> {
  if (adminDb) {
    try {
      const docRef = adminDb.collection('batches').doc(batchData.batchNo);
      await docRef.set(batchData, { merge: true });
      return batchData;
    } catch (err) {
      console.error('Firestore batch write error:', err);
    }
  }

  const index = memoryBatches.findIndex((b) => b.batchNo === batchData.batchNo);
  if (index >= 0) {
    memoryBatches[index] = batchData;
  } else {
    memoryBatches.unshift(batchData);
  }
  return batchData;
}

export async function saveBatchBulk(batches: Batch[]): Promise<{ added: number; count: number }> {
  let count = 0;
  for (const batch of batches) {
    await saveBatch(batch);
    count++;
  }
  return { added: count, count };
}

export async function getEnquiriesList(): Promise<Enquiry[]> {
  noStore();
  if (adminDb) {
    try {
      const snap = await adminDb.collection('enquiries').orderBy('createdAt', 'desc').get();
      return snap.docs.map((d: QueryDocumentSnapshot) => ({ id: d.id, ...d.data() } as Enquiry));
    } catch (err) {
      console.warn('Firestore enquiry read error:', err);
    }
  }
  return memoryEnquiries;
}

export async function getDistributorEnquiriesList(): Promise<DistributorEnquiry[]> {
  noStore();
  if (adminDb) {
    try {
      const snap = await adminDb.collection('distributorEnquiries').orderBy('createdAt', 'desc').get();
      return snap.docs.map((d: QueryDocumentSnapshot) => ({ id: d.id, ...d.data() } as DistributorEnquiry));
    } catch (err) {
      console.warn('Firestore distributor enquiry read error:', err);
    }
  }
  return memoryDistributorEnquiries;
}

export async function saveProduct(productData: Product): Promise<Product> {
  if (adminDb) {
    try {
      await adminDb.collection('products').doc(productData.id).set(productData, { merge: true });
    } catch (err) {
      console.error('Firestore product write error:', err);
      throw new Error(`Failed to save product in database: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const idx = memoryProducts.findIndex((p) => p.id === productData.id);
  if (idx >= 0) {
    memoryProducts[idx] = productData;
  } else {
    memoryProducts.unshift(productData);
  }
  return productData;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection('products').doc(id).delete();
    } catch (err) {
      console.error('Firestore product delete error:', err);
      throw new Error(`Failed to delete product from database: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  const idx = memoryProducts.findIndex((p) => p.id === id);
  if (idx >= 0) {
    memoryProducts.splice(idx, 1);
  }
  return true;
}

export async function deleteBatch(batchNo: string): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection('batches').doc(batchNo).delete();
    } catch (err) {
      console.error('Firestore batch delete error:', err);
    }
  }
  const idx = memoryBatches.findIndex((b) => b.batchNo === batchNo);
  if (idx >= 0) {
    memoryBatches.splice(idx, 1);
  }
  return true;
}

export async function getCertificationsList(): Promise<Certification[]> {
  noStore();
  if (adminDb) {
    try {
      const snap = await adminDb.collection('certifications').orderBy('order', 'asc').get();
      if (!snap.empty) {
        return snap.docs.map((d: QueryDocumentSnapshot) => ({ id: d.id, ...d.data() } as Certification));
      }
    } catch (err) {
      console.warn('Firestore certifications read error:', err);
    }
  }
  return memoryCertifications;
}

export async function saveCertification(certData: Certification): Promise<Certification> {
  if (adminDb) {
    try {
      await adminDb.collection('certifications').doc(certData.id).set(certData, { merge: true });
      return certData;
    } catch (err) {
      console.error('Firestore cert write error:', err);
    }
  }

  const idx = memoryCertifications.findIndex((c) => c.id === certData.id);
  if (idx >= 0) {
    memoryCertifications[idx] = certData;
  } else {
    memoryCertifications.push(certData);
  }
  return certData;
}

export async function deleteCertification(id: string): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection('certifications').doc(id).delete();
    } catch (err) {
      console.error('Firestore cert delete error:', err);
    }
  }
  const idx = memoryCertifications.findIndex((c) => c.id === id);
  if (idx >= 0) {
    memoryCertifications.splice(idx, 1);
  }
  return true;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection('enquiries').doc(id).delete();
    } catch (err) {
      console.error('Firestore enquiry delete error:', err);
    }
  }
  const idx = memoryEnquiries.findIndex((e) => e.id === id);
  if (idx >= 0) {
    memoryEnquiries.splice(idx, 1);
  }
  return true;
}

export async function updateEnquiryStatus(id: string, status: 'new' | 'contacted' | 'closed'): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection('enquiries').doc(id).set({ status }, { merge: true });
    } catch (err) {
      console.error('Firestore enquiry status update error:', err);
    }
  }
  const enq = memoryEnquiries.find((e) => e.id === id);
  if (enq) {
    enq.status = status;
  }
  return true;
}

export async function deleteDistributorEnquiry(id: string): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection('distributorEnquiries').doc(id).delete();
    } catch (err) {
      console.error('Firestore distributor enquiry delete error:', err);
    }
  }
  const idx = memoryDistributorEnquiries.findIndex((d) => d.id === id);
  if (idx >= 0) {
    memoryDistributorEnquiries.splice(idx, 1);
  }
  return true;
}

export async function updateDistributorEnquiryStatus(id: string, status: 'new' | 'contacted' | 'closed'): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection('distributorEnquiries').doc(id).set({ status }, { merge: true });
    } catch (err) {
      console.error('Firestore distributor status update error:', err);
    }
  }
  const dist = memoryDistributorEnquiries.find((d) => d.id === id);
  if (dist) {
    dist.status = status;
  }
  return true;
}

export async function saveSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  if (adminDb) {
    try {
      await adminDb.collection('settings').doc('site').set(updates, { merge: true });
    } catch (err) {
      console.error('Firestore settings update error:', err);
    }
  }
  Object.assign(memorySiteSettings, updates);
  return memorySiteSettings;
}

// Downloads CRUD
export async function getDownloadsList(): Promise<Download[]> {
  noStore();
  if (adminDb) {
    try {
      const snap = await adminDb.collection('downloads').get();
      if (!snap.empty) {
        return snap.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as Download));
      }
    } catch (err) {
      console.warn('Firestore downloads read error:', err);
    }
  }
  return memoryDownloads;
}

export async function saveDownload(downloadData: Download): Promise<Download> {
  if (adminDb) {
    try {
      await adminDb.collection('downloads').doc(downloadData.id).set(downloadData, { merge: true });
      return downloadData;
    } catch (err) {
      console.error('Firestore download write error:', err);
    }
  }

  const idx = memoryDownloads.findIndex((d) => d.id === downloadData.id);
  if (idx >= 0) {
    memoryDownloads[idx] = downloadData;
  } else {
    memoryDownloads.unshift(downloadData);
  }
  return downloadData;
}

export async function deleteDownload(id: string): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection('downloads').doc(id).delete();
    } catch (err) {
      console.error('Firestore download delete error:', err);
    }
  }
  const idx = memoryDownloads.findIndex((d) => d.id === id);
  if (idx >= 0) {
    memoryDownloads.splice(idx, 1);
  }
  return true;
}

// Gallery CRUD
export async function getGalleryList(): Promise<GalleryItem[]> {
  noStore();
  if (adminDb) {
    try {
      const snap = await adminDb.collection('gallery').orderBy('order', 'asc').get();
      if (!snap.empty) {
        return snap.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as GalleryItem));
      }
    } catch (err) {
      console.warn('Firestore gallery read error:', err);
    }
  }
  return [...memoryGallery].sort((a, b) => a.order - b.order);
}

export async function saveGalleryItem(itemData: GalleryItem): Promise<GalleryItem> {
  if (adminDb) {
    try {
      await adminDb.collection('gallery').doc(itemData.id).set(itemData, { merge: true });
      return itemData;
    } catch (err) {
      console.error('Firestore gallery write error:', err);
    }
  }

  const idx = memoryGallery.findIndex((g) => g.id === itemData.id);
  if (idx >= 0) {
    memoryGallery[idx] = itemData;
  } else {
    memoryGallery.push(itemData);
  }
  return itemData;
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection('gallery').doc(id).delete();
    } catch (err) {
      console.error('Firestore gallery delete error:', err);
    }
  }
  const idx = memoryGallery.findIndex((g) => g.id === id);
  if (idx >= 0) {
    memoryGallery.splice(idx, 1);
  }
  return true;
}

export async function saveTestimonial(testimonialData: Testimonial): Promise<Testimonial> {
  if (adminDb) {
    try {
      await adminDb.collection('testimonials').doc(testimonialData.id).set(testimonialData, { merge: true });
    } catch (err) {
      console.error('Firestore testimonial write error:', err);
    }
  }

  const idx = memoryTestimonials.findIndex((t) => t.id === testimonialData.id);
  if (idx >= 0) {
    memoryTestimonials[idx] = testimonialData;
  } else {
    memoryTestimonials.push(testimonialData);
  }
  return testimonialData;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection('testimonials').doc(id).delete();
    } catch (err) {
      console.error('Firestore testimonial delete error:', err);
    }
  }

  const idx = memoryTestimonials.findIndex((t) => t.id === id);
  if (idx >= 0) {
    memoryTestimonials.splice(idx, 1);
  }
  return true;
}

/* ---------------------------------------------------------------------------
 * Reference indexes (mother tincture remedies, dilution remedies, biochemic)
 * ------------------------------------------------------------------------- */

const REFERENCE_COLLECTION = 'reference';

/** Seeds the in-memory fallback from the static catalogue files. */
function staticReferenceItems(list: ReferenceList): ReferenceItem[] {
  if (list === 'mother-tincture') {
    return MOTHER_TINCTURE_REMEDIES.map((r) => ({
      id: `mt-${r.sl}`,
      list,
      sl: r.sl,
      name: r.name,
      cat: r.cat,
    }));
  }
  if (list === 'biochemic') {
    return BIOCHEMIC_UPCOMING.map((b, i) => ({
      id: `bio-${i + 1}`,
      list,
      sl: i + 1,
      name: b.name,
      potencies: b.potencies ?? undefined,
    }));
  }
  return DILUTION_REMEDIES.map((name, i) => ({
    id: `dil-${i + 1}`,
    list,
    sl: i + 1,
    name,
  }));
}

export async function getReferenceItems(list: ReferenceList): Promise<ReferenceItem[]> {
  noStore();
  if (adminDb) {
    try {
      const snap = await adminDb
        .collection(REFERENCE_COLLECTION)
        .where('list', '==', list)
        .get();
      if (!snap.empty) {
        return snap.docs
          .map((d: QueryDocumentSnapshot) => ({ id: d.id, ...d.data() } as ReferenceItem))
          .sort((a, b) => a.sl - b.sl);
      }
      // Empty collection: fall through to the bundled catalogue.
    } catch (err) {
      console.warn('Error fetching reference items, using fallback:', err);
    }
  }
  return staticReferenceItems(list);
}

export async function saveReferenceItem(item: ReferenceItem): Promise<ReferenceItem> {
  if (adminDb) {
    try {
      await adminDb.collection(REFERENCE_COLLECTION).doc(item.id).set(item, { merge: true });
      return item;
    } catch (err) {
      console.error('Firestore reference write error:', err);
    }
  }
  return item;
}

export async function saveReferenceItemsBulk(items: ReferenceItem[]): Promise<number> {
  let count = 0;
  for (const item of items) {
    await saveReferenceItem(item);
    count++;
  }
  return count;
}

export async function deleteReferenceItem(id: string): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection(REFERENCE_COLLECTION).doc(id).delete();
      return true;
    } catch (err) {
      console.error('Firestore reference delete error:', err);
      return false;
    }
  }
  return false;
}

/** Replaces an entire list in one go (used by the CSV/paste importer). */
export async function replaceReferenceList(
  list: ReferenceList,
  items: ReferenceItem[]
): Promise<number> {
  if (adminDb) {
    try {
      const snap = await adminDb
        .collection(REFERENCE_COLLECTION)
        .where('list', '==', list)
        .get();
      for (const doc of snap.docs) {
        await doc.ref.delete();
      }
    } catch (err) {
      console.error('Firestore reference clear error:', err);
    }
  }
  return saveReferenceItemsBulk(items);
}

/* --------------------------- Reference schedules -------------------------- */

const SCHEDULE_COLLECTION = 'referenceSchedules';

function staticSchedule(list: ReferenceList): ReferenceSchedule | null {
  if (list === 'mother-tincture') {
    return {
      id: list,
      packSizes: ['30 ml', '100 ml', '450 ml'],
      rows: MOTHER_TINCTURE_PRICING.map((g) => ({
        key: g.grade,
        packs: g.packs.map((p) => ({ size: p.size, mrp: p.mrp })),
      })),
      note: MOTHER_TINCTURE_COMBO_NOTE,
    };
  }
  if (list === 'dilution') {
    return {
      id: list,
      packSizes: ['10 ml', '30 ml', '100 ml', '450 ml'],
      rows: DILUTION_PRICING.map((r) => ({
        key: r.potency,
        packs: r.packs.map((p) => ({ size: p.size, mrp: p.mrp })),
      })),
      note: DILUTION_COMBO_NOTE,
    };
  }
  return null;
}

export async function getReferenceSchedule(
  list: ReferenceList
): Promise<ReferenceSchedule | null> {
  noStore();
  if (adminDb) {
    try {
      const snap = await adminDb.collection(SCHEDULE_COLLECTION).doc(list).get();
      if (snap.exists) {
        return { id: list, ...snap.data() } as ReferenceSchedule;
      }
    } catch (err) {
      console.warn('Error fetching reference schedule, using fallback:', err);
    }
  }
  return staticSchedule(list);
}

export async function saveReferenceSchedule(
  schedule: ReferenceSchedule
): Promise<ReferenceSchedule> {
  if (adminDb) {
    try {
      await adminDb.collection(SCHEDULE_COLLECTION).doc(schedule.id).set(schedule);
    } catch (err) {
      console.error('Firestore schedule write error:', err);
    }
  }
  return schedule;
}
