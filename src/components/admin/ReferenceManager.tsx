'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ReferenceItem, ReferenceList } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Upload, RefreshCcw, Search } from 'lucide-react';
import { ScheduleEditor } from '@/components/admin/ScheduleEditor';

const LISTS: { key: ReferenceList; label: string; hasCat: boolean; hasPotencies: boolean }[] = [
  { key: 'mother-tincture', label: 'Mother Tincture', hasCat: true, hasPotencies: false },
  { key: 'dilution', label: 'Dilution', hasCat: false, hasPotencies: false },
  { key: 'biochemic', label: 'Biochemic (Upcoming)', hasCat: false, hasPotencies: true },
];

const blank = { sl: '', name: '', cat: '', potencies: '' };

export function ReferenceManager() {
  const [list, setList] = useState<ReferenceList>('mother-tincture');
  const [items, setItems] = useState<ReferenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(blank);
  const [paste, setPaste] = useState('');
  const [showImport, setShowImport] = useState(false);

  const meta = LISTS.find((l) => l.key === list)!;

  const fetchItems = useCallback(async (): Promise<ReferenceItem[]> => {
    const res = await fetch(`/api/reference?list=${list}`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load');
    return data.items || [];
  }, [list]);

  // Reload whenever the selected list changes. State is only touched after the
  // request resolves, so the effect never sets state during render.
  useEffect(() => {
    let cancelled = false;
    fetchItems()
      .then((next) => {
        if (cancelled) return;
        setItems(next);
        setError(null);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchItems]);

  const load = useCallback(async () => {
    try {
      setItems(await fetchItems());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  }, [fetchItems]);

  const flash = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(null), 4000);
  };

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const body = {
      list,
      sl: form.sl || items.length + 1,
      name: form.name,
      ...(meta.hasCat ? { cat: form.cat } : {}),
      ...(meta.hasPotencies ? { potencies: form.potencies } : {}),
    };
    const res = await fetch('/api/reference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Save failed');
    setForm(blank);
    flash(`Saved “${body.name}”.`);
    load();
  }

  async function removeItem(item: ReferenceItem) {
    if (!confirm(`Delete “${item.name}” from the ${meta.label} index?`)) return;
    const res = await fetch(`/api/reference?id=${encodeURIComponent(item.id)}`, { method: 'DELETE' });
    if (!res.ok) return setError('Delete failed');
    flash(`Deleted “${item.name}”.`);
    load();
  }

  async function importPaste() {
    setError(null);
    const rows = paste
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line, i) => {
        const parts = line.split(/\t|,|\|/).map((p) => p.trim());
        const hasSl = /^\d+$/.test(parts[0]);
        const sl = hasSl ? Number(parts[0]) : i + 1;
        const rest = hasSl ? parts.slice(1) : parts;
        return {
          sl,
          name: rest[0] ?? '',
          ...(meta.hasCat ? { cat: rest[1] ?? '' } : {}),
          ...(meta.hasPotencies ? { potencies: rest[1] ?? '' } : {}),
        };
      });

    if (!rows.length) return setError('Nothing to import.');
    if (
      !confirm(
        `Replace the entire ${meta.label} index with ${rows.length} row(s)? The current ${items.length} row(s) will be removed.`
      )
    )
      return;

    const res = await fetch('/api/reference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ list, items: rows }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Import failed');
    setPaste('');
    setShowImport(false);
    flash(`Imported ${data.count} row(s).`);
    load();
  }

  const shown = items.filter((i) => i.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="space-y-6">
      {/* List switcher */}
      <div className="flex flex-wrap gap-2">
        {LISTS.map((l) => (
          <button
            key={l.key}
            type="button"
            onClick={() => { setList(l.key); setQuery(''); setForm(blank); }}
            className={`px-3.5 py-2 rounded-md text-sm font-medium border transition-colors ${
              list === l.key
                ? 'bg-[#1F4D3A] text-white border-[#1F4D3A]'
                : 'bg-white text-[#12150F] border-[rgba(18,21,15,0.12)] hover:border-[#1F4D3A]/40'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {status && (
        <div className="px-4 py-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-sm text-emerald-900">
          {status}
        </div>
      )}
      {error && (
        <div className="px-4 py-2.5 rounded-md bg-rose-50 border border-rose-200 text-sm text-rose-900">
          {error}
        </div>
      )}

      {list !== 'biochemic' && <ScheduleEditor list={list} label={meta.label} />}

      {/* Add row */}
      <form onSubmit={addItem} className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] p-4 space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-[#1F4D3A]">
          Add to {meta.label}
        </span>
        <div className="flex flex-wrap gap-3">
          <Input
            type="number"
            placeholder="SL"
            value={form.sl}
            onChange={(e) => setForm({ ...form, sl: e.target.value })}
            className="w-24 text-sm"
          />
          <Input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="flex-1 min-w-[200px] text-sm"
            required
          />
          {meta.hasCat && (
            <Input
              type="text"
              placeholder="Cat. (A–J)"
              value={form.cat}
              onChange={(e) => setForm({ ...form, cat: e.target.value })}
              className="w-28 text-sm"
            />
          )}
          {meta.hasPotencies && (
            <Input
              type="text"
              placeholder="Potencies"
              value={form.potencies}
              onChange={(e) => setForm({ ...form, potencies: e.target.value })}
              className="w-56 text-sm"
            />
          )}
          <Button type="submit" variant="primary" size="md" className="gap-1.5">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
      </form>

      {/* Bulk import */}
      <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)]">
        <button
          type="button"
          onClick={() => setShowImport((v) => !v)}
          className="w-full px-4 py-3 flex items-center justify-between text-left"
        >
          <span className="text-sm font-semibold text-[#12150F] inline-flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#1F4D3A]" />
            Bulk import / replace list
          </span>
          <span className="text-xs text-[#595C54]">{showImport ? 'Hide' : 'Show'}</span>
        </button>
        {showImport && (
          <div className="px-4 pb-4 space-y-3 border-t border-[rgba(18,21,15,0.06)] pt-3">
            <p className="text-xs text-[#595C54] leading-relaxed">
              One row per line. Columns separated by tab, comma or a pipe. The SL number is
              optional — if the first column is not a number, rows are numbered in order.
              {meta.hasCat && ' Format: SL, Name, Cat.'}
              {meta.hasPotencies && ' Format: SL, Name, Potencies.'}
              {!meta.hasCat && !meta.hasPotencies && ' Format: SL, Name.'}
              {' '}This <strong>replaces</strong> the whole {meta.label} index.
            </p>
            <textarea
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              rows={8}
              placeholder={
                meta.hasCat
                  ? '1, Abies Canadensis, C\n2, Abies Nigra, C'
                  : meta.hasPotencies
                  ? '1, Ferrum Phosphoricum, 3x, 6x, 12x, 30x'
                  : '1, Abies Canadensis\n2, Abies Nigra'
              }
              className="w-full rounded-md border border-[rgba(18,21,15,0.15)] p-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#1F4D3A]"
            />
            <Button type="button" variant="primary" size="md" onClick={importPaste} className="gap-1.5">
              <Upload className="w-4 h-4" /> Import {paste.split('\n').filter((l) => l.trim()).length} row(s)
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)]">
        <div className="p-4 border-b border-[rgba(18,21,15,0.08)] flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#595C54] absolute left-3 top-3 pointer-events-none" />
            <Input
              type="text"
              placeholder="Filter by name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#595C54]">
              {shown.length} of {items.length}
            </span>
            <button
              type="button"
              onClick={load}
              className="p-2 rounded-md border border-[rgba(18,21,15,0.12)] text-[#1F4D3A] hover:bg-[#F0F5F2]"
              title="Reload"
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[32rem] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAFAF8] border-b border-[rgba(18,21,15,0.08)] text-[#595C54] uppercase text-[11px] font-mono tracking-wider sticky top-0">
              <tr>
                <th className="py-2.5 px-4 font-semibold">SL</th>
                <th className="py-2.5 px-4 font-semibold">Name</th>
                {meta.hasCat && <th className="py-2.5 px-4 font-semibold">Cat.</th>}
                {meta.hasPotencies && <th className="py-2.5 px-4 font-semibold">Potencies</th>}
                <th className="py-2.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(18,21,15,0.06)]">
              {shown.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAFAF8]">
                  <td className="py-2 px-4 font-mono text-[#595C54]">{item.sl}</td>
                  <td className="py-2 px-4 font-medium text-[#12150F]">{item.name}</td>
                  {meta.hasCat && (
                    <td className="py-2 px-4 font-mono text-[#1F4D3A]">{item.cat || '—'}</td>
                  )}
                  {meta.hasPotencies && (
                    <td className="py-2 px-4 font-mono text-[11px] text-[#595C54]">
                      {item.potencies || '—'}
                    </td>
                  )}
                  <td className="py-2 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => removeItem(item)}
                      className="p-1.5 rounded text-rose-700 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {!shown.length && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#595C54] text-sm">
                    {loading ? 'Loading…' : 'No rows.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
