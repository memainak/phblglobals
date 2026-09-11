import {
  getProducts,
  getBatches,
  getQualityPillars,
  getCertificationsList,
  getDownloads,
} from '@/lib/queries';

export interface KnowledgeChunk {
  id: string;
  title: string;
  url: string;
  category: 'product' | 'batch' | 'quality' | 'certification' | 'about' | 'contact' | 'downloads' | 'legal';
  content: string;
  keywords: string[];
  snippet: string;
  ctaText: string;
}

// Static pages corpus (Foundational corporate & regulatory documents)
const staticPagesKnowledge: KnowledgeChunk[] = [
  {
    id: 'page-about',
    title: 'About Purusottam Homoeo Bikash Laboratory (Bonded)',
    url: '/about',
    category: 'about',
    content:
      'Purusottam Homoeo Bikash Laboratory (Bonded) was established in 2003 in Paschim Medinipur, West Bengal by Dr. Tarak Prasad Chatterjee. Manufacturing license HL-792 M. An ISO 9001:2015, GMP Schedule M-I, and HACCP certified homoeopathic pharmaceutical enterprise with in-house bonded excise manufacturing facilities. Philosophy: Every physician should prepare his own medicine.',
    keywords: ['about', 'phbl', 'history', 'founder', '2003', 'bonded', 'laboratory', 'paschim medinipur', 'chatterjee'],
    snippet: 'Estd. 2003 in Paschim Medinipur under Dr. Tarak Prasad Chatterjee. ISO 9001:2015 & GMP Schedule M-I bonded facility.',
    ctaText: 'Read Company Heritage →',
  },
  {
    id: 'page-founder',
    title: 'Founder Dr. Tarak Prasad Chatterjee & Clinical Monograph',
    url: '/about/founder',
    category: 'about',
    content:
      'Dr. Tarak Prasad Chatterjee founded PHBL in 2003 with the vision to deliver authentic, potentized homoeopathic and botanical medicines prepared strictly according to the Homoeopathic Pharmacopoeia of India (HPI). His guiding credo: "Every physician should prepare his own medicine".',
    keywords: ['founder', 'tarak', 'prasad', 'chatterjee', 'credo', 'hpi', 'vision', 'physician', 'medicine'],
    snippet: 'Founder Dr. T. P. Chatterjee established PHBL with classical HPI standards and dedicated bonded manufacturing.',
    ctaText: 'View Founder Profile & Monograph →',
  },
  {
    id: 'page-vision-mission',
    title: 'Vision, Mission & Quality Policy',
    url: '/about/vision-mission',
    category: 'about',
    content:
      'PHBL vision: Pioneer authentic homoeopathic mother tinctures, dilutions, and bio-chemic combinations using authenticated botanical feedstocks and Extra Neutral Alcohol (ENA). Mission: Rigorous batch traceability, zero adulteration, and compliance with statutory GMP Schedule M-I rules.',
    keywords: ['vision', 'mission', 'quality policy', 'authenticity', 'mother tinctures', 'dilutions', 'ena'],
    snippet: 'Our commitment to therapeutic purity, batch traceability, and statutory Schedule M-I excellence.',
    ctaText: 'Explore Vision & Mission →',
  },
  {
    id: 'page-research',
    title: 'Analytical Research & Quality Assurance Lab',
    url: '/about/research',
    category: 'about',
    content:
      'PHBL maintains specialized testing facilities including High Performance Thin Layer Chromatography (HPTLC), UV-Vis Spectrophotometry, digital refractometry, alcoholometry, and microbiology testing to verify raw botanicals and finished medicinal batches.',
    keywords: ['research', 'laboratory', 'hptlc', 'chromatography', 'spectrophotometry', 'testing', 'qc', 'qa'],
    snippet: 'HPTLC, UV-Vis spectrophotometry, and chromatography for active marker identification.',
    ctaText: 'See Research & Testing Capabilities →',
  },
  {
    id: 'page-contact',
    title: 'Contact Factory, Helpline & Order Desks',
    url: '/contact',
    category: 'contact',
    content:
      'Factory Address: Purusottam Homoeo Bikash Laboratory (Bonded), Paschim Medinipur, West Bengal - 721101. Helpline & Calls: 9800011545. WhatsApp Trade Desk: 9800011545 (+919800011545). Email: phblkn@gmail.com. Drug Manufacturing License: HL-792 M.',
    keywords: ['contact', 'phone', 'helpline', 'whatsapp', '9800011545', 'email', 'address', 'paschim medinipur', 'location'],
    snippet: 'Helpline: 9800011545. Official manufacturing facility in Paschim Medinipur, West Bengal.',
    ctaText: 'View Factory Coordinates & Inquire →',
  },
  {
    id: 'page-distributor',
    title: 'Wholesale Distributorship & Institutional Stockist Application',
    url: '/distributor-enquiry',
    category: 'contact',
    content:
      'Apply to become an authorized wholesale distributor or state stockist for PHBL homoeopathic formulations. Requires valid Drug License (Form 20B/21B) and GSTIN. Dedicated cold-chain and bonded logistics across India.',
    keywords: ['distributor', 'stockist', 'wholesale', 'application', 'dealership', 'gstin', 'drug license', 'form 20b', '21b'],
    snippet: 'Wholesale partnership portal for licensed pharmaceutical distributors holding Form 20B/21B.',
    ctaText: 'Apply for Distributorship →',
  },
  {
    id: 'page-certifications',
    title: 'Accreditations & Regulatory Certifications',
    url: '/certifications',
    category: 'certification',
    content:
      'PHBL holds official accreditations: ISO 9001:2015 Quality Management System, Good Manufacturing Practice (GMP) Schedule M-I compliance under Drugs & Cosmetics Rules 1945, HACCP Hazard Analysis Critical Control Point, and Bonded Manufacturing License HL-792 M.',
    keywords: ['iso', '9001', 'gmp', 'schedule m-i', 'haccp', 'license', 'hl-792', 'accreditation', 'certificate'],
    snippet: 'ISO 9001:2015, GMP Schedule M-I, HACCP and Form HL-792 M regulatory certificates.',
    ctaText: 'Verify Regulatory Certificates →',
  },
  {
    id: 'page-downloads',
    title: 'Downloads: Product Booklet, Price Lists & COA Formats',
    url: '/downloads',
    category: 'downloads',
    content:
      'Official downloads repository: Download PHBL Comprehensive Product Booklet, Wholesale Trade Price List (P.T.D / P.T.R), Clinical Monograph, and Schedule M-I Quality Manual in PDF format.',
    keywords: ['downloads', 'booklet', 'catalog', 'price list', 'pdf', 'brochure', 'monograph'],
    snippet: 'Download official formulation booklets, trade price lists, and clinical monographs.',
    ctaText: 'Access Downloads Library →',
  },
  {
    id: 'page-batch-verify',
    title: 'Batch Traceability & Certificate of Analysis Portal',
    url: '/batches',
    category: 'batch',
    content:
      'Enter any batch number from your carton or carton QR code (e.g. BL-2024-0101, BL-2023-0089) to view the 11 statutory points of compliance, in-house analytical testing, finished release status, and download the printable Certificate of Analysis.',
    keywords: ['batch', 'verify', 'traceability', 'coa', 'certificate of analysis', 'qr code', 'testing', 'bl-2024'],
    snippet: 'Verify carton batch numbers, analytical laboratory tests, and statutory Certificate of Analysis.',
    ctaText: 'Open Batch Traceability Portal →',
  },
  {
    id: 'page-disclaimer',
    title: 'Statutory DMR Act 1954 Notice & Legal Disclaimer',
    url: '/disclaimer',
    category: 'legal',
    content:
      'Statutory compliance notice under the Drugs and Magic Remedies (Objectionable Advertisements) Act 1954 and Drugs & Cosmetics Act 1940. Medicinal information is strictly for registered medical practitioners and informational purposes. Not intended for self-medication.',
    keywords: ['disclaimer', 'dmr act 1954', 'legal', 'compliance', 'self medication', 'advertisement'],
    snippet: 'Statutory compliance statement under Drugs & Magic Remedies Act 1954.',
    ctaText: 'Read Legal Disclaimer →',
  },
];

/**
 * Builds the complete unified knowledge corpus from database + static records.
 */
export async function buildKnowledgeCorpus(): Promise<KnowledgeChunk[]> {
  const corpus: KnowledgeChunk[] = [...staticPagesKnowledge];

  try {
    // 1. Ingest all Products
    const products = await getProducts();
    for (const p of products) {
      const categorySlug = p.category.toLowerCase();
      const packSizesStr = p.packSizes?.map((ps) => `${ps.size}${ps.mrp ? ` (Rs. ${ps.mrp})` : ''}`).join(', ') || 'Standard';
      corpus.push({
        id: `product-${p.id}`,
        title: `${p.name} (${p.category})`,
        url: `/products/${categorySlug}/${p.slug}`,
        category: 'product',
        content: `Product: ${p.name}. Subcategory: ${p.subCategory}. Category: ${p.category}. Indications: ${p.indications}. Composition: ${p.composition?.map((c) => `${c.ingredient} ${c.strength}`).join(', ') || 'N/A'}. Dosage: ${p.dosage || 'As directed by physician'}. Packaging: ${packSizesStr}. Storage: ${p.storage || 'Cool, dry place'}. Short description: ${p.shortDescription}.`,
        keywords: [
          p.name.toLowerCase(),
          p.slug.toLowerCase(),
          p.category.toLowerCase(),
          p.subCategory.toLowerCase(),
          ...(p.composition?.map((c) => c.ingredient.toLowerCase()) || []),
          'indications',
          'potency',
          'drops',
          'syrup',
          'tincture',
        ],
        snippet: `Indications: ${p.indications}. Pack sizes: ${packSizesStr}.`,
        ctaText: `View ${p.name} Details →`,
      });
    }

    // 2. Ingest all Batches
    const batchResult = await getBatches();
    const batches = batchResult?.batches || [];
    for (const b of batches) {
      corpus.push({
        id: `batch-${b.id}`,
        title: `Batch ${b.batchNo}: ${b.brandName || b.apiName}`,
        url: `/batches/${encodeURIComponent(b.batchNo)}`,
        category: 'batch',
        content: `Batch Number: ${b.batchNo}. Brand: ${b.brandName}. API: ${b.apiName}. Batch Size: ${b.batchSize}. Mfg Date: ${b.mfgDate}. Exp Date: ${b.expDate || b.expiryNote || 'Standard'}. Storage: ${b.storageConditions}. License: ${b.mfgLicenseNo}. Authority: ${b.authority}. Manufacturer: ${b.manufacturerName}.`,
        keywords: [
          b.batchNo.toLowerCase(),
          b.batchNo.replace(/-/g, '').toLowerCase(),
          (b.brandName || '').toLowerCase(),
          (b.apiName || '').toLowerCase(),
          'batch',
          'testing',
          'release',
          'expiry',
          'coa',
        ],
        snippet: `Batch ${b.batchNo} (${b.brandName || b.apiName}). Mfg: ${b.mfgDate}, Exp: ${b.expDate || b.expiryNote || 'Standard'}. Authority: ${b.authority}.`,
        ctaText: `Inspect Batch ${b.batchNo} COA →`,
      });
    }

    // 3. Ingest Quality Pillars
    const qualityPillars = await getQualityPillars();
    for (const q of qualityPillars) {
      corpus.push({
        id: `quality-${q.id}`,
        title: `Quality Standard: ${q.title}`,
        url: `/quality/${q.slug}`,
        category: 'quality',
        content: `Quality Pillar: ${q.title}. Summary: ${q.summary}. Details: ${q.body}.`,
        keywords: [q.title.toLowerCase(), q.slug.toLowerCase(), 'quality', 'testing', 'gmp', 'hpi', 'standard'],
        snippet: q.summary,
        ctaText: `Read About ${q.title} →`,
      });
    }

    // 4. Ingest Certifications
    const certs = await getCertificationsList();
    for (const c of certs) {
      corpus.push({
        id: `cert-${c.id}`,
        title: `${c.title} (${c.certificateNo})`,
        url: '/certifications',
        category: 'certification',
        content: `Certification: ${c.title}. Issuing Body: ${c.issuingBody}. Certificate Number: ${c.certificateNo}. Issued On: ${c.issuedOn}. Valid Until: ${c.validUntil || 'Active'}.`,
        keywords: [c.title.toLowerCase(), c.certificateNo.toLowerCase(), c.issuingBody.toLowerCase(), 'accreditation'],
        snippet: `Issued by ${c.issuingBody}. Cert No: ${c.certificateNo}. Valid until: ${c.validUntil || 'Active'}.`,
        ctaText: 'View Certificate Details →',
      });
    }

    // 5. Ingest Downloads
    const downloads = await getDownloads();
    for (const d of downloads) {
      corpus.push({
        id: `download-${d.id}`,
        title: `Download: ${d.title} (${d.category})`,
        url: '/downloads',
        category: 'downloads',
        content: `Document: ${d.title}. Category: ${d.category}. Updated: ${d.updatedAt}. Downloads: ${d.downloadCount}.`,
        keywords: [d.title.toLowerCase(), d.category.toLowerCase(), 'download', 'pdf'],
        snippet: `${d.category} document. Available for immediate download.`,
        ctaText: 'Download Document →',
      });
    }
  } catch (err) {
    console.error('Error constructing dynamic knowledge base:', err);
  }

  return corpus;
}
