'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Batch } from '@/types';
import { Search, Filter, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { analyzeBatchExpiry, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface BatchTableFilterProps {
  initialBatches: Batch[];
  authorities: string[];
}

export function BatchTableFilter({
  initialBatches,
  authorities,
}: BatchTableFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthority, setSelectedAuthority] = useState('all');

  const filteredBatches = initialBatches.filter((batch) => {
    const matchesAuth =
      selectedAuthority === 'all' ||
      batch.authority.toLowerCase().includes(selectedAuthority.toLowerCase());

    const s = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !s ||
      batch.batchNo.toLowerCase().includes(s) ||
      batch.brandName.toLowerCase().includes(s) ||
      batch.apiName.toLowerCase().includes(s) ||
      batch.uniqueProductCode.toLowerCase().includes(s);

    return matchesAuth && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="p-4 bg-white rounded-md border border-[rgba(18,21,15,0.08)] flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#595C54] absolute left-3 top-3 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search Batch No, API, Brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[#595C54]" />
          <span className="text-xs font-semibold uppercase text-[#595C54] whitespace-nowrap">
            Authority:
          </span>
          <select
            value={selectedAuthority}
            onChange={(e) => setSelectedAuthority(e.target.value)}
            className="h-10 px-3 py-2 text-xs rounded-md border border-[rgba(18,21,15,0.15)] bg-white text-[#12150F] focus:outline-none focus:ring-1 focus:ring-[#1F4D3A] w-full md:w-auto"
          >
            <option value="all">All Authorities</option>
            {authorities.map((auth) => (
              <option key={auth} value={auth}>
                {auth}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Regulatory Batches Table */}
      <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAFAF8] border-b border-[rgba(18,21,15,0.08)] text-[#595C54] uppercase text-[11px] font-mono tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Batch No.</th>
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold hidden sm:table-cell">Expiry</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(18,21,15,0.06)] text-[#12150F]">
              {filteredBatches.length > 0 ? (
                filteredBatches.map((batch) => {
                  const expiry = analyzeBatchExpiry(batch.expDate, batch.expiryNote);
                  return (
                    <tr
                      key={batch.id}
                      className="hover:bg-[#FAFAF8] transition-colors group"
                    >
                      <td className="py-4 px-4 font-mono font-semibold text-[#1F4D3A] whitespace-nowrap">
                        <Link
                          href={`/batches/${batch.batchNo}`}
                          className="hover:underline flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{batch.batchNo}</span>
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-[#12150F]">{batch.brandName}</div>
                        <div className="text-[11px] text-[#595C54] hidden md:block truncate max-w-xs">
                          {batch.apiName}
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell whitespace-nowrap text-xs text-[#595C54]">
                        {formatDate(batch.expDate)}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[11px] font-medium border ${expiry.badgeClass}`}
                        >
                          {expiry.status === 'valid' && (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          )}
                          {expiry.status === 'expiring-soon' && (
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                          )}
                          {expiry.status === 'expired' && (
                            <XCircle className="w-3 h-3 text-rose-600" />
                          )}
                          <span>{expiry.label}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/batches/${batch.batchNo}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F4D3A] hover:underline"
                        >
                          <span>View</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#595C54]">
                    No batches match your search. Try a different batch number.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-[#595C54] flex items-center justify-between px-2">
        <span>Showing {filteredBatches.length} verified commercial batches</span>
        <span className="font-mono">Manufacturing Facility Lic: HL-792 M</span>
      </div>
    </div>
  );
}
