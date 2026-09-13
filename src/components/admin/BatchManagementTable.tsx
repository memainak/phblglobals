'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Batch } from '@/types';
import { BatchFormModal } from '@/components/admin/BatchFormModal';
import { formatDate, analyzeBatchExpiry } from '@/lib/utils';
import { ExternalLink, Search, Trash2, Edit2 } from 'lucide-react';

interface BatchManagementTableProps {
  initialBatches: Batch[];
}

export function BatchManagementTable({ initialBatches }: BatchManagementTableProps) {
  const router = useRouter();
  const [batches, setBatches] = useState<Batch[]>(initialBatches);
  const [search, setSearch] = useState('');
  const [deletingBatchNo, setDeletingBatchNo] = useState<string | null>(null);

  React.useEffect(() => {
    setBatches(initialBatches);
  }, [initialBatches]);

  const filtered = batches.filter((b) => {
    return (
      b.batchNo.toLowerCase().includes(search.toLowerCase()) ||
      b.brandName.toLowerCase().includes(search.toLowerCase()) ||
      b.apiName.toLowerCase().includes(search.toLowerCase()) ||
      (b.uniqueProductCode && b.uniqueProductCode.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const handleDelete = async (batchNo: string) => {
    if (!confirm(`Are you sure you want to permanently delete batch record "${batchNo}"?`)) {
      return;
    }

    setDeletingBatchNo(batchNo);
    try {
      const res = await fetch(`/api/batch?batchNo=${encodeURIComponent(batchNo)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBatches((prev) => prev.filter((b) => b.batchNo !== batchNo));
        router.refresh();
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(`Failed to delete batch record: ${errJson.error || 'Server error'}`);
      }
    } catch (err) {
      alert(`Error occurred while deleting batch: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDeletingBatchNo(null);
    }
  };

  const reloadBatches = async () => {
    try {
      const res = await fetch('/api/batch?includeUnpublished=true&_t=' + Date.now());
      const json = await res.json();
      const list = Array.isArray(json.batches)
        ? json.batches
        : Array.isArray(json.batches?.batches)
        ? json.batches.batches
        : [];
      if (list.length > 0 || json.success) {
        setBatches(list);
      }
      router.refresh();
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#595C54]" />
          <input
            type="text"
            placeholder="Search by batch no, brand, or API..."
            className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1F4D3A]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <BatchFormModal onSuccess={reloadBatches} />
        </div>
      </div>

      {/* Batches Table Card */}
      <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[rgba(18,21,15,0.06)] flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#12150F]">
            Statutory Logged Batches ({filtered.length})
          </h3>
          <span className="text-[11px] font-mono text-[#595C54]">
            Facility: Paschim Medinipur · Lic: HL-792 M
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] text-[#595C54] font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Batch No</th>
                <th className="p-3">Brand / API Name</th>
                <th className="p-3">Batch Size</th>
                <th className="p-3">Mfg Date</th>
                <th className="p-3">Exp Date</th>
                <th className="p-3">Authority</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(18,21,15,0.06)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#595C54]">
                    No batch records found matching your query.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const expiry = analyzeBatchExpiry(b.expDate, b.expiryNote);
                  return (
                    <tr key={b.id || b.batchNo} className="hover:bg-[#FAFAF8] transition-colors">
                      <td className="p-3 font-mono font-bold text-[#1F4D3A]">
                        {b.batchNo}
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-[#12150F]">{b.brandName}</div>
                        <div className="text-[10px] text-[#595C54] truncate max-w-xs">{b.apiName}</div>
                      </td>
                      <td className="p-3 font-mono text-[#595C54]">{b.batchSize}</td>
                      <td className="p-3 font-mono text-[#595C54]">{formatDate(b.mfgDate)}</td>
                      <td className="p-3 font-mono text-[#595C54]">{formatDate(b.expDate)}</td>
                      <td className="p-3 font-mono text-xs">{b.authority}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${expiry.badgeClass}`}>
                          {expiry.label}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/batches/${b.batchNo}`}
                            target="_blank"
                            className="p-1 text-[#1F4D3A] hover:bg-[#F0F5F2] rounded transition-colors"
                            title="Inspect live COA record"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <BatchFormModal
                            batch={b}
                            onSuccess={reloadBatches}
                            trigger={
                              <button
                                type="button"
                                className="p-1 text-neutral-600 hover:text-[#12150F] hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                                title="Edit batch record"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            }
                          />

                          <button
                            type="button"
                            disabled={deletingBatchNo === b.batchNo}
                            onClick={() => handleDelete(b.batchNo)}
                            className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete batch record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
