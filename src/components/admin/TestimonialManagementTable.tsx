'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Testimonial } from '@/types';
import { TestimonialFormModal } from '@/components/admin/TestimonialFormModal';
import { Trash2, Edit2, Quote, Search, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TestimonialManagementTableProps {
  initialTestimonials: Testimonial[];
}

export function TestimonialManagementTable({ initialTestimonials }: TestimonialManagementTableProps) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, author: string) => {
    if (!confirm(`Are you sure you want to delete the endorsement by "${author}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/testimonials?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        router.refresh();
      } else {
        alert('Failed to delete endorsement.');
      }
    } catch {
      alert('Error occurred while deleting endorsement.');
    } finally {
      setDeletingId(null);
    }
  };

  const reloadTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials?includeUnpublished=true');
      const json = await res.json();
      if (json.testimonials) {
        setTestimonials(json.testimonials);
      }
      router.refresh();
    } catch {
      // ignore
    }
  };

  const filtered = testimonials.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.author.toLowerCase().includes(term) ||
      t.role.toLowerCase().includes(term) ||
      (t.clinicOrInstitution && t.clinicOrInstitution.toLowerCase().includes(term)) ||
      (t.location && t.location.toLowerCase().includes(term)) ||
      t.quote.toLowerCase().includes(term)
    );
  });

  const publishedCount = testimonials.filter((t) => t.published).length;

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#595C54]">
              Total Endorsements: {testimonials.length}
            </span>
            <span className="text-zinc-300">•</span>
            <span className="text-xs font-mono text-[#2D5A27]">
              Published: {publishedCount}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search endorsements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <TestimonialFormModal onSuccess={reloadTestimonials} />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[rgba(18,21,15,0.06)] flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#12150F]">
            Clinical & Trade Endorsements
          </h3>
          <span className="text-[11px] font-mono text-[#595C54]">
            Publicly displayed in &quot;Trusted by Practitioners and Distributors&quot; on Homepage
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] text-[#595C54] font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3 w-16">Order</th>
                <th className="p-3 w-52">Practitioner / Partner</th>
                <th className="p-3 w-56">Institution & Location</th>
                <th className="p-3">Endorsement Quote</th>
                <th className="p-3 w-28">Status</th>
                <th className="p-3 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(18,21,15,0.06)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#595C54]">
                    {searchTerm ? 'No endorsements match your search filter.' : 'No endorsements found. Click "Add Endorsement" to create one.'}
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="p-3 font-mono text-zinc-500 font-semibold">
                      #{t.order ?? 0}
                    </td>
                    <td className="p-3 font-medium text-[#12150F]">
                      <div className="font-bold text-sm text-[#12150F]">{t.author}</div>
                      <div className="text-[11px] text-[#595C54]">{t.role}</div>
                    </td>
                    <td className="p-3 text-[#595C54]">
                      {t.clinicOrInstitution ? (
                        <div className="font-medium text-[#12150F]">{t.clinicOrInstitution}</div>
                      ) : (
                        <span className="text-zinc-400 italic">No institution specified</span>
                      )}
                      {t.location && (
                        <div className="text-[11px] text-[#7A7E73]">{t.location}</div>
                      )}
                    </td>
                    <td className="p-3 text-[#2C3026]">
                      <div className="line-clamp-2 italic text-xs max-w-xl text-zinc-700">
                        &quot;{t.quote}&quot;
                      </div>
                    </td>
                    <td className="p-3">
                      {t.published ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                          <XCircle className="w-3 h-3" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TestimonialFormModal
                          testimonial={t}
                          onSuccess={reloadTestimonials}
                          trigger={
                            <button
                              type="button"
                              className="p-1.5 text-[#595C54] hover:text-[#12150F] hover:bg-zinc-100 rounded transition-colors"
                              title="Edit endorsement"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          }
                        />
                        <button
                          type="button"
                          onClick={() => handleDelete(t.id, t.author)}
                          disabled={deletingId === t.id}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Delete endorsement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
