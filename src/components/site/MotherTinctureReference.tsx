'use client';

import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ReferenceSchedule } from '@/types';
import { Input } from '@/components/ui/input';
import {
  MOTHER_TINCTURE_COMBO_NOTE,
  MOTHER_TINCTURE_PRICING,
  MOTHER_TINCTURE_REMEDIES,
  type MotherTinctureRemedy,
} from '@/lib/data/motherTinctures';

const PACK_SIZES = ['30 ml', '100 ml', '450 ml'];

export function MotherTinctureReference({
  remedies,
  schedule,
}: {
  remedies?: MotherTinctureRemedy[];
  schedule?: ReferenceSchedule | null;
}) {
  const source = remedies?.length ? remedies : MOTHER_TINCTURE_REMEDIES;
  const packSizes = schedule?.packSizes?.length ? schedule.packSizes : PACK_SIZES;
  const rows =
    schedule?.rows?.length
      ? schedule.rows
      : MOTHER_TINCTURE_PRICING.map((g) => ({ key: g.grade, packs: g.packs }));
  const note = schedule?.note ?? MOTHER_TINCTURE_COMBO_NOTE;
  const lookup = (cat: string, size: string) =>
    rows.find((r) => r.key === cat)?.packs.find((p) => p.size === size)?.mrp ?? null;
  const [query, setQuery] = useState('');
  const [grade, setGrade] = useState('all');

  const grades = useMemo(
    () => Array.from(new Set(source.map((r) => r.cat))).sort(),
    [source]
  );

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return source.filter(
      (r) => (grade === 'all' || r.cat === grade) && (!q || r.name.toLowerCase().includes(q))
    );
  }, [query, grade, source]);

  return (
    <div className="space-y-6">
      {/* Grade price schedule */}
      <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[rgba(18,21,15,0.08)] bg-[#FAFAF8]">
          <span className="text-xs font-mono uppercase tracking-wider text-[#1F4D3A]">
            Grade &amp; Pack Schedule
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-[rgba(18,21,15,0.08)] text-[#595C54] uppercase text-[11px] font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Grade</th>
                {packSizes.map((s) => (
                  <th key={s} className="py-3 px-4 font-semibold">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(18,21,15,0.06)]">
              {rows.map((g) => (
                <tr key={g.key} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-[#1F4D3A]">{g.key}</td>
                  {packSizes.map((size) => {
                    const mrp = g.packs.find((p) => p.size === size)?.mrp;
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
        <div className="p-4 border-b border-[rgba(18,21,15,0.08)] flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#595C54] absolute left-3 top-3 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search remedy name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="mt-grade" className="text-xs font-semibold uppercase text-[#595C54]">
              Grade
            </label>
            <select
              id="mt-grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="h-10 px-3 py-2 text-xs rounded-md border border-[rgba(18,21,15,0.15)] bg-white text-[#12150F] focus:outline-none focus:ring-1 focus:ring-[#1F4D3A]"
            >
              <option value="all">All</option>
              {grades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <span className="text-xs font-mono text-[#595C54] whitespace-nowrap">
              {matches.length} of {source.length}
            </span>
          </div>
        </div>

        {matches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAFAF8] border-b border-[rgba(18,21,15,0.08)] text-[#595C54] uppercase text-[11px] font-mono tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">SL</th>
                  <th className="py-3 px-4 font-semibold">Remedy</th>
                  <th className="py-3 px-4 font-semibold">Cat.</th>
                  {packSizes.map((s) => (
                    <th key={s} className="py-3 px-4 font-semibold whitespace-nowrap">{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(18,21,15,0.06)] text-[#12150F]">
                {matches.map((r) => (
                  <tr key={r.sl} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="py-2.5 px-4 font-mono text-[#595C54]">{r.sl}</td>
                    <td className="py-2.5 px-4 font-medium">{r.name}</td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-[#1F4D3A]">{r.cat}</td>
                    {packSizes.map((s) => {
                      const mrp = lookup(r.cat, s);
                      return (
                        <td key={s} className="py-2.5 px-4 font-mono whitespace-nowrap text-[#595C54]">
                          {mrp ? `₹${mrp}` : '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-4 py-8 text-sm text-[#595C54]">
            No remedy matches the current search. Try a shorter term or a different grade.
          </p>
        )}
      </div>
    </div>
  );
}
