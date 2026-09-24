'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ReferenceList, ReferenceSchedule } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Save, Trash2 } from 'lucide-react';

export function ScheduleEditor({ list, label }: { list: ReferenceList; label: string }) {
  const [schedule, setSchedule] = useState<ReferenceSchedule | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchSchedule = useCallback(async (): Promise<ReferenceSchedule | null> => {
    const res = await fetch(`/api/reference/schedule?list=${list}`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load');
    return data.schedule ?? null;
  }, [list]);

  useEffect(() => {
    let cancelled = false;
    fetchSchedule()
      .then((s) => { if (!cancelled) { setSchedule(s); setError(null); } })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      });
    return () => { cancelled = true; };
  }, [fetchSchedule]);

  if (error && !schedule) {
    return <p className="text-sm text-rose-800">{error}</p>;
  }
  if (!schedule) {
    return <p className="text-sm text-[#595C54]">Loading schedule…</p>;
  }

  const setMrp = (rowIdx: number, size: string, value: string) => {
    const rows = schedule.rows.map((r, i) =>
      i !== rowIdx
        ? r
        : {
            ...r,
            packs: r.packs.map((p) =>
              p.size === size ? { ...p, mrp: value === '' ? null : Number(value) } : p
            ),
          }
    );
    setSchedule({ ...schedule, rows });
  };

  const setKey = (rowIdx: number, value: string) =>
    setSchedule({
      ...schedule,
      rows: schedule.rows.map((r, i) => (i === rowIdx ? { ...r, key: value } : r)),
    });

  const addRow = () =>
    setSchedule({
      ...schedule,
      rows: [
        ...schedule.rows,
        { key: '', packs: schedule.packSizes.map((size) => ({ size, mrp: null })) },
      ],
    });

  const removeRow = (rowIdx: number) =>
    setSchedule({ ...schedule, rows: schedule.rows.filter((_, i) => i !== rowIdx) });

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/reference/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSchedule(data.schedule);
      setStatus('Schedule saved.');
      setTimeout(() => setStatus(null), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)]">
      <div className="px-4 py-3 border-b border-[rgba(18,21,15,0.08)] bg-[#FAFAF8] flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-[#1F4D3A]">
          {label} price schedule
        </span>
        <span className="text-[11px] text-[#595C54]">
          Leave a cell blank for “no published price”.
        </span>
      </div>

      {status && (
        <div className="mx-4 mt-3 px-3 py-2 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
          {status}
        </div>
      )}
      {error && (
        <div className="mx-4 mt-3 px-3 py-2 rounded bg-rose-50 border border-rose-200 text-xs text-rose-900">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[rgba(18,21,15,0.08)] text-[#595C54] uppercase text-[11px] font-mono tracking-wider">
            <tr>
              <th className="py-2.5 px-4 font-semibold">
                {list === 'mother-tincture' ? 'Grade' : 'Potency'}
              </th>
              {schedule.packSizes.map((s) => (
                <th key={s} className="py-2.5 px-4 font-semibold whitespace-nowrap">{s}</th>
              ))}
              <th className="py-2.5 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(18,21,15,0.06)]">
            {schedule.rows.map((row, i) => (
              <tr key={i}>
                <td className="py-2 px-4">
                  <Input
                    type="text"
                    value={row.key}
                    onChange={(e) => setKey(i, e.target.value)}
                    className="w-28 text-sm font-mono"
                  />
                </td>
                {schedule.packSizes.map((size) => {
                  const pack = row.packs.find((p) => p.size === size);
                  return (
                    <td key={size} className="py-2 px-4">
                      <Input
                        type="number"
                        value={pack?.mrp ?? ''}
                        onChange={(e) => setMrp(i, size, e.target.value)}
                        className="w-28 text-sm font-mono"
                        placeholder="—"
                      />
                    </td>
                  );
                })}
                <td className="py-2 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="p-1.5 rounded text-rose-700 hover:bg-rose-50"
                    title="Remove row"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 space-y-3 border-t border-[rgba(18,21,15,0.06)]">
        <div className="space-y-1.5">
          <label htmlFor={`note-${list}`} className="text-xs font-semibold text-[#12150F]">
            Footnote shown under the schedule
          </label>
          <Input
            id={`note-${list}`}
            type="text"
            value={schedule.note ?? ''}
            onChange={(e) => setSchedule({ ...schedule, note: e.target.value })}
            className="text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="md" onClick={addRow} className="gap-1.5">
            <Plus className="w-4 h-4" /> Add row
          </Button>
          <Button type="button" variant="primary" size="md" onClick={save} disabled={saving} className="gap-1.5">
            <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save schedule'}
          </Button>
        </div>
      </div>
    </div>
  );
}
