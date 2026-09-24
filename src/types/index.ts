export type ProductCategory = 'homoeopathy' | 'cosmetics' | 'homoeovet';

export interface ProductComposition {
  ingredient: string;
  strength: string;
}

export interface ProductPackSize {
  size: string;
  mrp?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  subCategory: string; // 'patent-tonic' | 'drops' | 'mother-tincture' | 'dilution' | 'biochemic' | 'tablets' | 'ointment' | 'sanitizer' | 'oil' | 'vet'
  shortDescription: string;
  indications: string;
  composition: ProductComposition[];
  dosage: string;
  packSizes: ProductPackSize[];
  storage: string;
  caution?: string;
  images: string[];
  featured: boolean;
  isNew?: boolean;
  order: number;
  seo: {
    title: string;
    description: string;
  };
  published: boolean;
  createdAt: string; // ISO string for seamless server/client serialization
  updatedAt: string;
}

export interface Batch {
  id: string;
  batchNo: string; // unique identifier, used as the URL slug
  productId?: string; // link to Product
  apiName: string;
  brandName: string;
  uniqueProductCode: string;
  manufacturerName: string;
  manufacturerAddress: string;
  batchSize: string; // e.g. "450 KG" or "5000 Litres"
  mfgDate: string; // ISO string e.g. "2024-03-15"
  expDate: string | null; // ISO string or null
  expiryNote?: string; // e.g. "5 years from mfg" when expDate is a rule not a date
  shippingContainerCode: string;
  mfgLicenseNo: string;
  storageConditions: string;
  authority: string; // e.g. "GNCT DELHI", "WB AYUSH", "CENTRAL LICENSING AUTHORITY"
  published: boolean;
}

export interface QualityPillar {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string; // Markdown or formatted text
  heroImage: string;
  gallery: string[];
  order: number;
  published: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuingBody: string;
  certificateNo: string;
  issuedOn: string;
  validUntil: string | null;
  fileUrl: string;
  thumbnailUrl: string;
  order: number;
  published?: boolean;
}

export interface GalleryItem {
  id: string;
  album: 'Factory' | 'Laboratory' | 'Events' | 'Exhibitions' | 'Products';
  imageUrl: string;
  caption: string;
  width: number;
  height: number;
  order: number;
  published?: boolean;
}

export interface Download {
  id: string;
  title: string;
  category: 'Therapeutic Index' | 'Product Catalogue' | 'MSDS' | 'Price List' | 'Compliance';
  fileUrl: string;
  fileSize: number; // in bytes
  gated: boolean;
  downloadCount: number;
  updatedAt: string;
  published?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  clinicOrInstitution?: string;
  location?: string;
  published: boolean;
  order: number;
}

export type EnquiryType =
  | 'General'
  | 'Product Enquiry'
  | 'Distributor Enquiry'
  | 'Bulk & Export'
  | 'Therapeutic Index Booklet'
  | 'Pharmacovigilance & Complaint';

export interface Enquiry {
  id: string;
  type: EnquiryType;
  name: string;
  email: string;
  phone: string;
  productId?: string;
  productName?: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  notes?: string;
  source: string;
  createdAt: string;
}

export interface DistributorEnquiry {
  id: string;
  firmName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstin: string;
  drugLicenseNo: string;
  city: string;
  state: string;
  yearsInTrade: number;
  existingBrandsCarried: string;
  territoryOfInterest: string;
  monthlyVolumeEstimate: string;
  message?: string;
  status: 'new' | 'contacted' | 'closed';
  notes?: string;
  createdAt: string;
}

export interface SiteSettings {
  name: string;
  shortName: string;
  tagline: string;
  foundedYear: number;
  mfgLicenseNo: string;
  phones: string[];
  tollFreePhone: string;
  fax?: string[];
  email: string;
  address: string;
  certifications: string[];
  socials: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
  announcementBar: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  stats: {
    label: string;
    value: number;
    suffix?: string;
  }[];
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'superadmin' | 'admin' | 'editor';
}

export type ReferenceList = 'mother-tincture' | 'dilution' | 'biochemic';

/**
 * A row in one of the printed catalogue indexes (mother tincture remedies,
 * dilution remedies, upcoming biochemic tablets). These are reference data
 * rather than sellable products, so they live outside the Product model.
 */
export interface ReferenceItem {
  id: string;
  list: ReferenceList;
  sl: number;
  name: string;
  /** Mother tincture price grade (A-J). */
  cat?: string;
  /** Biochemic potency string, e.g. "3x, 6x, 12x, 30x". */
  potencies?: string;
}

export interface SchedulePack {
  size: string;
  mrp: number | null;
}

export interface ScheduleRow {
  /** Grade letter (A-J) for mother tinctures, or potency label for dilutions. */
  key: string;
  packs: SchedulePack[];
}

/**
 * The price schedule behind a reference index. Pricing is per grade/potency
 * rather than per remedy, which is how the printed price list is organised.
 */
export interface ReferenceSchedule {
  id: ReferenceList;
  packSizes: string[];
  rows: ScheduleRow[];
  note?: string;
}
