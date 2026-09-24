import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import type { Batch } from '@/types';

export interface GnctDelhiRow {
  batchNo: string;
  productName: string;
  productHref: string | null;
  batchSize: string;
  mfgLabel: string;
  expiryLabel: string;
  status: 'active' | 'expiring' | 'expired' | 'unknown';
  statusNote: string;
}

const STATUS_STYLE: Record<GnctDelhiRow['status'], { label: string; className: string }> = {
  active: {
    label: 'In market',
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  expiring: {
    label: 'Expiring soon',
    className: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  expired: {
    label: 'Past expiry',
    className: 'bg-rose-50 text-rose-800 border-rose-200',
  },
  unknown: {
    label: 'Check with plant',
    className: 'bg-[#F0F5F2] text-[#1F4D3A] border-[#1F4D3A]/15',
  },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-01-01" -> "Jan 2026". Returns null for anything unparseable. */
function monthYear(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/**
 * The GNCT Delhi batch records state the expiry as a rule ("5 years from mfg")
 * rather than a date. We show the rule as printed and derive the resulting
 * month only to work out whether the batch is still current — never presenting
 * the derived month as if it were printed on the pack.
 */
function resolveExpiry(batch: Batch): { date: Date | null; label: string } {
  if (batch.expDate) {
    const d = new Date(batch.expDate);
    if (!Number.isNaN(d.getTime())) {
      return { date: d, label: monthYear(batch.expDate) ?? batch.expDate };
    }
  }

  const note = batch.expiryNote?.trim();
  const years = note?.match(/(\d+)\s*year/i);
  const mfg = batch.mfgDate ? new Date(batch.mfgDate) : null;

  if (years && mfg && !Number.isNaN(mfg.getTime())) {
    const d = new Date(mfg);
    d.setUTCFullYear(d.getUTCFullYear() + Number(years[1]));
    return { date: d, label: `${note} (${monthYear(d.toISOString())})` };
  }

  return { date: null, label: note || 'Not stated' };
}

export function buildGnctRows(batches: Batch[], slugByBrand: Map<string, string>, now = new Date()): GnctDelhiRow[] {
  return batches
    .map((batch) => {
      const { date, label } = resolveExpiry(batch);
      const slug = slugByBrand.get(batch.brandName?.trim().toLowerCase() ?? '');

      let status: GnctDelhiRow['status'] = 'unknown';
      let statusNote = 'Expiry stated as a rule on the pack; confirm with the plant.';

      if (date) {
        const monthsLeft = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
        if (monthsLeft < 0) {
          status = 'expired';
          statusNote = 'Beyond the stated shelf life.';
        } else if (monthsLeft <= 6) {
          status = 'expiring';
          statusNote = 'Within six months of the stated shelf life.';
        } else {
          status = 'active';
          statusNote = 'Within the stated shelf life.';
        }
      }

      return {
        batchNo: batch.batchNo,
        productName: batch.brandName?.trim() || batch.apiName,
        productHref: slug ? `/products/homoeopathy/${slug}` : null,
        batchSize: batch.batchSize || '—',
        mfgLabel: monthYear(batch.mfgDate) ?? batch.mfgDate ?? '—',
        expiryLabel: label,
        status,
        statusNote,
      };
    })
    .sort((a, b) => a.productName.localeCompare(b.productName));
}

export function GnctDelhiRange({ rows }: { rows: GnctDelhiRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-[#595C54] bg-white border border-[rgba(18,21,15,0.08)] rounded-md px-4 py-6">
        No GNCT Delhi notified batch is currently published. Batch records are added from the
        admin panel.
      </p>
    );
  }

  return (
    <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[rgba(18,21,15,0.08)] bg-[#FAFAF8] flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1F4D3A] text-white text-[10px] font-mono font-semibold tracking-wider">
          <ShieldCheck className="w-3 h-3" />
          GNCT DELHI
        </span>
        <span className="text-xs font-mono uppercase tracking-wider text-[#1F4D3A]">
          Notified batch register · Licence HL-792 M
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-mono uppercase tracking-wider text-[#595C54] bg-[#FAFAF8]">
              <th className="px-4 py-2.5 font-medium">Product</th>
              <th className="px-4 py-2.5 font-medium">Batch No</th>
              <th className="px-4 py-2.5 font-medium">Batch Size</th>
              <th className="px-4 py-2.5 font-medium">Mfg</th>
              <th className="px-4 py-2.5 font-medium">Expiry</th>
              <th className="px-4 py-2.5 font-medium">Current Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const style = STATUS_STYLE[row.status];
              return (
                <tr
                  key={row.batchNo}
                  className="border-t border-[rgba(18,21,15,0.06)] hover:bg-[#FAFAF8] transition-colors"
                >
                  <td className="px-4 py-2.5 font-medium text-[#12150F]">
                    {row.productHref ? (
                      <Link
                        href={row.productHref}
                        className="inline-flex items-center gap-1 hover:text-[#1F4D3A] hover:underline"
                      >
                        {row.productName}
                        <ArrowUpRight className="w-3 h-3 shrink-0" />
                      </Link>
                    ) : (
                      row.productName
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[12px] text-[#1F4D3A]">
                    <Link href={`/batches/${row.batchNo}`} className="hover:underline">
                      {row.batchNo}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[12px] text-[#595C54]">{row.batchSize}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px] text-[#595C54]">{row.mfgLabel}</td>
                  <td className="px-4 py-2.5 text-[12px] text-[#595C54]">{row.expiryLabel}</td>
                  <td className="px-4 py-2.5">
                    <span
                      title={row.statusNote}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium ${style.className}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                      {style.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="px-4 py-3 text-[11px] text-[#595C54] border-t border-[rgba(18,21,15,0.06)] bg-[#FAFAF8]">
        Manufactured at L/3, Saratpally, Paschim Medinipur 721101, West Bengal under manufacturing
        licence HL-792 M. Expiry is printed on the pack as a rule (&ldquo;5 years from mfg&rdquo;); the month
        shown in brackets is derived from it and is indicative only. Status is computed against that
        shelf life at page build time.
      </p>
    </div>
  );
}

export default GnctDelhiRange;
