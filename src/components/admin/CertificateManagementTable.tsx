'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Certification } from '@/types';
import { CertificateFormModal } from '@/components/admin/CertificateFormModal';
import { formatDate } from '@/lib/utils';
import { ExternalLink, Trash2, Edit2, ShieldCheck, Award } from 'lucide-react';

interface CertificateManagementTableProps {
  initialCertifications: Certification[];
}

export function CertificateManagementTable({ initialCertifications }: CertificateManagementTableProps) {
  const router = useRouter();
  const [certs, setCerts] = useState<Certification[]>(initialCertifications);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete certificate "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/certifications?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCerts((prev) => prev.filter((c) => c.id !== id));
        router.refresh();
      } else {
        alert('Failed to delete certificate.');
      }
    } catch {
      alert('Error occurred while deleting certificate.');
    } finally {
      setDeletingId(null);
    }
  };

  const reloadCerts = async () => {
    try {
      const res = await fetch('/api/certifications');
      const json = await res.json();
      if (json.certifications) {
        setCerts(json.certifications);
      }
      router.refresh();
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-mono text-[#595C54]">
            Total Accreditations: {certs.length}
          </span>
        </div>
        <CertificateFormModal onSuccess={reloadCerts} />
      </div>

      <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[rgba(18,21,15,0.06)] flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#12150F]">
            Accreditation & Compliance Records
          </h3>
          <span className="text-[11px] font-mono text-[#595C54]">
            Publicly Displayed on /certifications
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] text-[#595C54] font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Certificate Title</th>
                <th className="p-3">Issuing Authority</th>
                <th className="p-3">License / Cert No.</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Valid Until</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(18,21,15,0.06)]">
              {certs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#595C54]">
                    No certificates found. Click &quot;Upload Certificate&quot; to add one.
                  </td>
                </tr>
              ) : (
                certs.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="p-3 font-mono text-[#595C54]">{c.order}</td>
                    <td className="p-3">
                      <div className="font-semibold text-[#12150F]">{c.title}</div>
                      <div className="text-[10px] text-[#595C54] font-mono truncate max-w-xs">{c.fileUrl}</div>
                    </td>
                    <td className="p-3 text-[#12150F]">{c.issuingBody}</td>
                    <td className="p-3 font-mono font-bold text-[#1F4D3A]">{c.certificateNo}</td>
                    <td className="p-3 font-mono text-[#595C54]">{formatDate(c.issuedOn)}</td>
                    <td className="p-3 font-mono text-[#595C54]">
                      {c.validUntil ? formatDate(c.validUntil) : 'Perpetual / Ongoing'}
                    </td>
                    <td className="p-3">
                      {c.published !== false ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href="/certifications"
                          target="_blank"
                          className="p-1 text-[#1F4D3A] hover:bg-[#F0F5F2] rounded transition-colors"
                          title="View on public site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <CertificateFormModal
                          certification={c}
                          onSuccess={reloadCerts}
                          trigger={
                            <button
                              type="button"
                              className="p-1 text-neutral-600 hover:text-[#12150F] hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                              title="Edit certificate"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          }
                        />

                        <button
                          type="button"
                          disabled={deletingId === c.id}
                          onClick={() => handleDelete(c.id, c.title)}
                          className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete certificate"
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
