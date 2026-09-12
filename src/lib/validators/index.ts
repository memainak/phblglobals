import { z } from 'zod';

export const enquirySchema = z.object({
  type: z.enum([
    'General',
    'Product Enquiry',
    'Distributor Enquiry',
    'Bulk & Export',
    'Therapeutic Index Booklet',
    'Pharmacovigilance & Complaint',
  ]),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number with area/country code'),
  productId: z.string().optional(),
  productName: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must acknowledge the legal data consent policy',
  }),
  honeypot: z.string().max(0, 'Spam detected').optional(),
});

export const distributorEnquirySchema = z.object({
  firmName: z.string().min(2, 'Firm name is required'),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format (e.g. 19AAAAA0000A1Z5)'),
  drugLicenseNo: z.string().min(3, 'Drug License Number is mandatory for pharmaceutical distribution'),
  city: z.string().min(2, 'City/District is required'),
  state: z.string().min(2, 'State is required'),
  yearsInTrade: z.coerce.number().min(0, 'Years in trade must be 0 or higher'),
  existingBrandsCarried: z.string().min(2, 'Please list major brands currently distributed'),
  territoryOfInterest: z.string().min(2, 'Territory/districts requested is required'),
  monthlyVolumeEstimate: z.string().min(2, 'Estimated monthly turnover/volume is required'),
  message: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms',
  }),
  honeypot: z.string().max(0, 'Spam detected').optional(),
});

export const bookletRequestSchema = z.object({
  name: z.string().min(2, 'Doctor/Firm name is required'),
  qualification: z.string().min(2, 'Medical qualification / Council Registration No. is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone is required'),
  postalAddress: z.string().min(10, 'Complete postal address with PIN code is required for hard copy dispatch'),
  pinCode: z.string().regex(/^[1-9][0-9]{5}$/, 'Valid 6-digit Indian PIN code required'),
  requestType: z.enum(['instant-pdf', 'printed-hard-copy']),
});

export const batchSchema = z.object({
  batchNo: z.string().min(2, 'Batch number is required (e.g. BL-2024-001)'),
  productId: z.string().optional(),
  apiName: z.string().min(2, 'API / Active ingredient is required'),
  brandName: z.string().min(2, 'Brand name is required'),
  uniqueProductCode: z.string().min(2, 'Unique Product Identification Code is required'),
  manufacturerName: z.string().min(2, 'Manufacturer name is required'),
  manufacturerAddress: z.string().min(5, 'Manufacturer address is required'),
  batchSize: z.string().min(2, 'Batch size is required (e.g. 450 Litres / 200 KG)'),
  mfgDate: z.string().min(4, 'Manufacturing date is required (YYYY-MM-DD or YYYY-MM)'),
  expDate: z.string().nullable().optional(),
  expiryNote: z.string().optional(),
  shippingContainerCode: z.string().min(2, 'Serial Shipping Container Code (SSCC) is required'),
  mfgLicenseNo: z.string().min(2, 'Mfg License No is required'),
  storageConditions: z.string().min(2, 'Storage conditions are required'),
  authority: z.string().min(2, 'Regulatory Authority is required'),
  published: z.boolean().default(true),
});

export const batchCsvRowSchema = z.object({
  batchNo: z.string().min(1, 'Batch No cannot be empty'),
  apiName: z.string().min(1, 'API Name cannot be empty'),
  brandName: z.string().min(1, 'Brand Name cannot be empty'),
  uniqueProductCode: z.string().min(1, 'Unique Product Code cannot be empty'),
  batchSize: z.string().min(1, 'Batch Size cannot be empty'),
  mfgDate: z.string().min(1, 'Mfg Date cannot be empty'),
  expDate: z.string().optional().nullable(),
  expiryNote: z.string().optional(),
  shippingContainerCode: z.string().optional().default('N.A.'),
  mfgLicenseNo: z.string().optional().default('HL-792 M'),
  storageConditions: z.string().optional().default('Store in a cool, dry place protected from light and moisture'),
  authority: z.string().min(1, 'Regulatory Authority is required'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'URL slug is required'),
  category: z.enum(['homoeopathy', 'cosmetics', 'homoeovet']),
  subCategory: z.string().min(1, 'Subcategory is required'),
  shortDescription: z.string().min(2, 'Short description is required'),
  indications: z.string().min(2, 'Indications are required'),
  dosage: z.string().optional().default('As directed by physician.'),
  composition: z.array(
    z.object({
      ingredient: z.string().min(1, 'Ingredient name required'),
      strength: z.string().optional().default('Q'),
    })
  ).min(1, 'At least one composition entry is required'),
  packSizes: z.array(
    z.object({
      size: z.string().min(1, 'Pack size required'),
      mrp: z.coerce.number().optional(),
    })
  ).min(1, 'At least one pack size required'),
  storage: z.string().optional().default('Store in a cool and dry place.'),
  caution: z.string().optional().default(''),
  images: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false).optional(),
  order: z.coerce.number().default(0),
  published: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  quote: z.string().min(10, 'Endorsement statement must be at least 10 characters'),
  author: z.string().min(2, 'Practitioner or Partner name is required'),
  role: z.string().min(2, 'Professional role / Designation is required'),
  clinicOrInstitution: z.string().optional(),
  location: z.string().optional(),
  order: z.number().default(1),
  published: z.boolean().default(true),
});
