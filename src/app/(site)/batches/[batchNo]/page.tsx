import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  getBatchByNo,
  getAllBatchNumbers,
  getProductBySlug,
  getProducts,
} from '@/lib/queries';
import {
  analyzeBatchExpiry,
  formatDate,
} from '@/lib/utils';
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Building,
} from 'lucide-react';
import { BatchRecordActions } from '@/components/site/BatchRecordActions';
import { BatchSearchWidget } from '@/components/site/BatchSearchWidget';

interface BatchPageProps {
  params: Promise<{
    batchNo: string;
  }>;
}

export async function generateStaticParams() {
  const batchNos = await getAllBatchNumbers();
  return batchNos.map((batchNo) => ({
    batchNo,
  }));
}

export async function generateMetadata({
  params,
}: BatchPageProps): Promise<Metadata> {
  const { batchNo } = await params;
  const batch = await getBatchByNo(batchNo);

  if (!batch) {
    return {
      title: `Batch Not Found (${batchNo})`,
    };
  }

  return {
    title: `Batch ${batch.batchNo} — ${batch.brandName} | Public Traceability`,
    description: `Official pharmaceutical regulatory batch record for ${batch.brandName} (${batch.apiName}), Batch No. ${batch.batchNo}. Mfg Lic. HL-792 M.`,
  };
}

export const revalidate = 3600;

export default async function BatchDetailPage({ params }: BatchPageProps) {
  const { batchNo } = await params;
  const batch = await getBatchByNo(batchNo);

  if (!batch) {
    return (
      <div className="py-20 bg-[#FAFAF8] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#12150F]">
            Batch Record Not Found
          </h1>
          <p className="text-sm text-[#595C54]">
            No official record was found for batch number{' '}
            <code className="font-mono font-bold text-[#1F4D3A] bg-[#F0F5F2] px-2 py-0.5 rounded">
              {batchNo}
            </code>
            . Please verify the batch digits printed on the bottle label or packaging carton.
          </p>
          <div className="pt-4 max-w-md mx-auto">
            <BatchSearchWidget />
          </div>
          <div className="pt-4">
            <Link
              href="/batches"
              className="text-xs font-semibold text-[#1F4D3A] hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Batch Master Index</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Find linked product if productId exists
  let linkedProduct = null;
  if (batch.productId) {
    const allProducts = await getProducts();
    linkedProduct = allProducts.find((p) => p.id === batch.productId) || null;
  }

  // Auto-computed expiry status analysis
  const expiryAnalysis = analyzeBatchExpiry(batch.expDate, batch.expiryNote);

  // Regulatory 11-point data structure (with 'N.A.' fallback per regulatory mandate)
  const regulatoryFields = [
    {
      label: 'Unique Product Identification Code',
      value: batch.uniqueProductCode || 'N.A.',
      highlight: true,
    },
    {
      label: 'Name of the API (Active Ingredient)',
      value: batch.apiName || 'N.A.',
      highlight: true,
    },
    {
      label: 'Brand / Formulation Name',
      value: batch.brandName || 'N.A.',
      highlight: true,
    },
    {
      label: 'Name & Address of the Manufacturer',
      value: `${batch.manufacturerName || 'Purusottam Homeo Bikash Lab(Bonded)'}, ${
        batch.manufacturerAddress || 'L/3, Saratpally, Paschim Medinipur, Pin 721101, WB, India'
      }`,
    },
    {
      label: 'Batch Number',
      value: batch.batchNo || 'N.A.',
      isMono: true,
      highlight: true,
    },
    {
      label: 'Batch Size / Volume Produced',
      value: batch.batchSize || 'N.A.',
      isMono: true,
    },
    {
      label: 'Manufacturing Date (Mfg. Date)',
      value: formatDate(batch.mfgDate),
      isMono: true,
    },
    {
      label: 'Expiration Date (Exp. Date)',
      value: batch.expDate ? formatDate(batch.expDate) : 'N.A.',
      note: batch.expiryNote,
      isMono: true,
    },
    {
      label: 'Serial Shipping Container Code (SSCC)',
      value: batch.shippingContainerCode || 'N.A.',
      isMono: true,
    },
    {
      label: 'Manufacturing License Number',
      value: batch.mfgLicenseNo || 'HL-792 M',
      isMono: true,
    },
    {
      label: 'Special Storage Conditions',
      value: batch.storageConditions || 'Store in a cool and dry place protected from light.',
    },
  ];

  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between no-print">
          <Link
            href="/batches"
            className="text-xs font-semibold text-[#1F4D3A] hover:underline inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Batches</span>
          </Link>

          <BatchRecordActions batchNo={batch.batchNo} />
        </div>

        {/* Certificate of Regulatory Batch Monograph (Printable Card) */}
        <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.12)] p-6 sm:p-10 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
          {/* Header Strip with Facility & Stamp */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[rgba(18,21,15,0.1)]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="p-2 rounded-sm border border-[rgba(18,21,15,0.1)] bg-[#FAFAF8] shrink-0 self-start sm:self-center">
                <Image
                  src="/images/phbl-logo.png"
                  alt="Purusottam Homeo Bikash Lab(Bonded)"
                  width={200}
                  height={36}
                  className="h-9 w-auto object-contain"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-[#1F4D3A] font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#1F4D3A]" />
                  <span>Statutory Certificate of Analysis & Traceability</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12150F]">
                  Batch Monograph: {batch.batchNo}
                </h1>
                <p className="text-xs text-[#595C54]">
                  Governing Authority / State Licensing: <strong>{batch.authority}</strong> · Mfg Lic. {batch.mfgLicenseNo}
                </p>
              </div>
            </div>

            {/* Expiry Badge */}
            <div className="shrink-0 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold border ${expiryAnalysis.badgeClass}`}
              >
                {expiryAnalysis.status === 'valid' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
                {expiryAnalysis.status === 'expiring-soon' && (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                {expiryAnalysis.status === 'expired' && (
                  <XCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{expiryAnalysis.label}</span>
              </span>
            </div>
          </div>

          {/* Core Regulatory Monograph Grid (11 Statutory Attributes) */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#595C54] font-semibold">
              Statutory Pharmaceutical Declarations (11-Point Regulatory Matrix)
            </h2>

            <div className="border border-[rgba(18,21,15,0.1)] rounded-md overflow-hidden divide-y divide-[rgba(18,21,15,0.08)] bg-[#FAFAF8]">
              {regulatoryFields.map((field, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 p-3.5 text-xs sm:text-sm"
                >
                  <div className="md:col-span-4 font-medium text-[#595C54] pr-4">
                    {field.label}:
                  </div>
                  <div className="md:col-span-8 font-semibold text-[#12150F] mt-1 md:mt-0">
                    <span className={field.isMono ? 'font-mono' : ''}>
                      {field.value}
                    </span>
                    {field.note && (
                      <span className="block text-[11px] font-normal text-[#595C54] mt-0.5 italic">
                        Note: {field.note}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linked Product Reference */}
          {linkedProduct && (
            <div className="pt-4 border-t border-[rgba(18,21,15,0.1)] flex items-center justify-between no-print">
              <div>
                <span className="text-xs text-[#595C54] block">
                  Associated Formulation Monograph:
                </span>
                <span className="font-serif font-bold text-base text-[#12150F]">
                  {linkedProduct.name}
                </span>
              </div>
              <Link
                href={`/products/${linkedProduct.category}/${linkedProduct.slug}`}
                className="text-xs font-semibold text-[#1F4D3A] hover:underline inline-flex items-center gap-1"
              >
                <span>View Product Monograph</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
