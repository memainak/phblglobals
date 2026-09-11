import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getBatches,
  getProducts,
  getEnquiriesList,
  getDistributorEnquiriesList,
} from '@/lib/queries';
import { analyzeBatchExpiry, formatDate } from '@/lib/utils';
import {
  FileCheck2,
  Inbox,
  Boxes,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Admin Control Dashboard | PHBL Staff Portal',
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [{ batches }, products, enquiries, distributorEnquiries] =
    await Promise.all([
      getBatches({ page: 1, pageSize: 100 }),
      getProducts(),
      getEnquiriesList(),
      getDistributorEnquiriesList(),
    ]);

  // Compute batches expiring in 90 days
  const expiringBatches = batches.filter((b) => {
    const analysis = analyzeBatchExpiry(b.expDate, b.expiryNote);
    return analysis.status === 'expiring-soon' || analysis.status === 'expired';
  });

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;
  const newDistributorsCount = distributorEnquiries.filter(
    (d) => d.status === 'new'
  ).length;

  return (
    <div className="space-y-8">
      {/* Welcome & System Health Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(18,21,15,0.08)]">
        <div>
          <span className="text-xs font-mono uppercase text-[#1F4D3A] font-semibold">
            Plant Operations Console
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#12150F]">
            Administrative Operations Dashboard
          </h1>
          <p className="text-xs text-[#595C54]">
            Purusottam Homeo Bikash Lab(Bonded) · Drug Mfg Lic: HL-792 M
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-[rgba(18,21,15,0.1)] text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[#12150F] font-semibold">System Status: Active</span>
          <span className="text-[#595C54] hidden sm:inline">| ISR Revalidation Ready</span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: New Enquiries */}
        <div className="bg-white p-6 rounded-md border border-[rgba(18,21,15,0.08)] space-y-2">
          <div className="flex items-center justify-between text-[#595C54]">
            <span className="text-xs font-semibold uppercase">New Enquiries</span>
            <Inbox className="w-4 h-4 text-[#1F4D3A]" />
          </div>
          <div className="font-serif text-3xl font-bold text-[#12150F]">
            {newEnquiriesCount + newDistributorsCount}
          </div>
          <p className="text-[11px] text-[#595C54]">
            {newDistributorsCount} wholesale distributor applications pending review
          </p>
        </div>

        {/* Metric 2: Expiring Batches */}
        <div className="bg-white p-6 rounded-md border border-[rgba(18,21,15,0.08)] space-y-2">
          <div className="flex items-center justify-between text-[#595C54]">
            <span className="text-xs font-semibold uppercase">Batches Expiring (90d)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-serif text-3xl font-bold text-amber-900">
            {expiringBatches.length}
          </div>
          <p className="text-[11px] text-[#595C54]">
            Requires regulatory archival or recall check
          </p>
        </div>

        {/* Metric 3: Active Formulations */}
        <div className="bg-white p-6 rounded-md border border-[rgba(18,21,15,0.08)] space-y-2">
          <div className="flex items-center justify-between text-[#595C54]">
            <span className="text-xs font-semibold uppercase">Active Formulations</span>
            <Boxes className="w-4 h-4 text-[#1F4D3A]" />
          </div>
          <div className="font-serif text-3xl font-bold text-[#1F4D3A]">
            {products.length}
          </div>
          <p className="text-[11px] text-[#595C54]">
            HPI & GHP monographs published in formulary
          </p>
        </div>

        {/* Metric 4: Total Verified Batches */}
        <div className="bg-white p-6 rounded-md border border-[rgba(18,21,15,0.08)] space-y-2">
          <div className="flex items-center justify-between text-[#595C54]">
            <span className="text-xs font-semibold uppercase">Logged Batches</span>
            <FileCheck2 className="w-4 h-4 text-[#1F4D3A]" />
          </div>
          <div className="font-serif text-3xl font-bold text-[#12150F]">
            {batches.length}
          </div>
          <p className="text-[11px] text-[#595C54]">
            Publicly traceable with QR serialization
          </p>
        </div>
      </div>

      {/* Action shortcuts & Batch Expiry Warning Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Expiring Batches Table */}
        <div className="lg:col-span-8 bg-white rounded-md border border-[rgba(18,21,15,0.08)] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="font-serif font-bold text-lg text-[#12150F]">
                Regulatory Expiry Monitoring (Next 90 Days)
              </h3>
            </div>
            <Link
              href="/admin/batches"
              className="text-xs text-[#1F4D3A] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Manage Batches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {expiringBatches.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFAF8] text-[#595C54] font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Batch No</th>
                    <th className="p-2.5">Brand / API</th>
                    <th className="p-2.5">Exp Date</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(18,21,15,0.06)]">
                  {expiringBatches.map((b) => {
                    const expiry = analyzeBatchExpiry(b.expDate, b.expiryNote);
                    return (
                      <tr key={b.id} className="hover:bg-[#FAFAF8]">
                        <td className="p-2.5 font-mono font-bold text-[#1F4D3A]">
                          <Link href={`/batches/${b.batchNo}`} className="hover:underline">
                            {b.batchNo}
                          </Link>
                        </td>
                        <td className="p-2.5">{b.brandName}</td>
                        <td className="p-2.5 font-mono">{formatDate(b.expDate)}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${expiry.badgeClass}`}
                          >
                            {expiry.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-[#595C54]">
              No active batches currently expiring within 90 days. All lots compliant.
            </div>
          )}
        </div>

        {/* Quick Administration Tasks */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#12150F]">
              Operational Quick Actions
            </h3>

            <div className="space-y-2 text-xs">
              <Link
                href="/admin/batches"
                className="p-3 rounded-md bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)] hover:bg-[#F0F5F2] flex items-center justify-between transition-colors block"
              >
                <div className="flex items-center gap-2 font-medium text-[#12150F]">
                  <FileCheck2 className="w-4 h-4 text-[#1F4D3A]" />
                  <span>Bulk CSV Batch Import</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#595C54]" />
              </Link>

              <Link
                href="/admin/products"
                className="p-3 rounded-md bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)] hover:bg-[#F0F5F2] flex items-center justify-between transition-colors block"
              >
                <div className="flex items-center gap-2 font-medium text-[#12150F]">
                  <Boxes className="w-4 h-4 text-[#1F4D3A]" />
                  <span>Add Formulation Monograph</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#595C54]" />
              </Link>

              <Link
                href="/admin/enquiries"
                className="p-3 rounded-md bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)] hover:bg-[#F0F5F2] flex items-center justify-between transition-colors block"
              >
                <div className="flex items-center gap-2 font-medium text-[#12150F]">
                  <Inbox className="w-4 h-4 text-[#1F4D3A]" />
                  <span>Review Incoming Inquiries</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#595C54]" />
              </Link>

              <Link
                href="/admin/certifications"
                className="p-3 rounded-md bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)] hover:bg-[#F0F5F2] flex items-center justify-between transition-colors block"
              >
                <div className="flex items-center gap-2 font-medium text-[#12150F]">
                  <FileCheck2 className="w-4 h-4 text-[#1F4D3A]" />
                  <span>Manage Certificates & ISO</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#595C54]" />
              </Link>

              <Link
                href="/admin/settings"
                className="p-3 rounded-md bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)] hover:bg-[#F0F5F2] flex items-center justify-between transition-colors block"
              >
                <div className="flex items-center gap-2 font-medium text-[#12150F]">
                  <Activity className="w-4 h-4 text-[#1F4D3A]" />
                  <span>Configure Phones & Hotlines</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#595C54]" />
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-md bg-[#F0F5F2] border border-[#1F4D3A]/20 text-xs text-[#1F4D3A] space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Production Safety Protocol</span>
            </div>
            <p className="text-[11px] text-[#595C54] leading-relaxed">
              When publishing changes, click the &ldquo;Publish Changes Now&rdquo; button in the navigation header to instantly invalidate Vercel / Next.js ISR edge caches across all public nodes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
