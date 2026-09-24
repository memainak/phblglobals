'use client';

import React, { useMemo, useState } from 'react';
import { Search, FlaskConical } from 'lucide-react';
import { ReferenceSchedule } from '@/types';
import { Input } from '@/components/ui/input';
import {
  DILUTION_COMBO_NOTE,
  DILUTION_POTENCIES,
  DILUTION_PRICING,
  DILUTION_REMEDIES,
} from '@/lib/data/dilutions';

export function DilutionReference({
  remedies,
  schedule,
}: {
  remedies?: string[];
  schedule?: ReferenceSchedule | null;
}) {
  const source = remedies?.length ? remedies : DILUTION_REMEDIES;
  const packSizes = schedule?.packSizes?.length
    ? schedule.packSizes
    : ['10 ml', '30 ml', '100 ml', '450 ml'];
  const rows = schedule?.rows?.length
    ? schedule.rows
    : DILUTION_PRICING.map((r) => ({ key: r.potency, packs: r.packs }));
  const note = schedule?.note ?? DILUTION_COMBO_NOTE;
  const [query, setQuery] = useState('');

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter((name) => name.toLowerCase().includes(q));
  }, [query, source]);

  return (
    <div className="space-y-6">
      {/* Potency & pack price schedule */}
      <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[rgba(18,21,15,0.08)] bg-[#FAFAF8]">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1F4D3A]">
              Potency &amp; Pack Schedule
            </span>
            <span className="text-[11px] text-[#595C54]">
              Potencies: {DILUTION_POTENCIES}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-white border-b border-[rgba(18,21,15,0.08)] text-[#595C54] uppercase text-[11px] font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Potency</th>
                {packSizes.map((s) => (
                  <th key={s} className="py-3 px-4 font-semibold whitespace-nowrap">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(18,21,15,0.06)] text-[#12150F]">
              {rows.map((row) => (
                <tr key={row.key} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-[#1F4D3A] whitespace-nowrap">
                    {row.key}
                  </td>
                  {packSizes.map((size) => {
                    const mrp = row.packs.find((p) => p.size === size)?.mrp;
                    return (
                      <td key={size} className="py-3 px-4 font-mono whitespace-nowrap">
                        {mrp === null || mrp === undefined ? '—' : `₹${mrp}`}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="px-4 py-3 text-[11px] text-[#595C54] border-t border-[rgba(18,21,15,0.06)] bg-[#FAFAF8]">
          {note}
        </p>
      </div>

      {/* Searchable remedy index */}
      <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)]">
        <div className="p-4 border-b border-[rgba(18,21,15,0.08)] flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#595C54] absolute left-3 top-3 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search remedy name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          <span className="text-xs font-mono text-[#595C54] shrink-0">
            {matches.length} of {source.length} remedies
          </span>
        </div>

        {source.length === 0 ? (
          <p className="px-4 py-8 text-sm text-[#595C54]">
            The remedy index is being prepared. Every remedy is supplied across the
            potencies listed above — contact the plant for availability of a specific
            remedy.
          </p>
        ) : matches.length > 0 ? (
          <ul className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-1.5">
            {matches.map((name) => (
              <li
                key={name}
                className="flex items-baseline gap-2 text-sm text-[#12150F] py-1 border-b border-[rgba(18,21,15,0.04)]"
              >
                <FlaskConical className="w-3 h-3 text-[#1F4D3A] shrink-0 translate-y-0.5" />
                <span>{name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-8 text-sm text-[#595C54]">
            No remedy matches “{query}”. Try a shorter search term.
          </p>
        )}
      </div>
    </div>
  );
}
