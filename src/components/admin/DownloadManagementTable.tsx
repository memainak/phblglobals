'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download } from '@/types';
import { DownloadFormModal } from '@/components/admin/DownloadFormModal';
import { formatDate, formatBytes } from '@/lib/utils';
import { ExternalLink, Trash2, FileText, Lock, CheckCircle2, Download as DownloadIcon } from 'lucide-react';

interface DownloadManagementTableProps {
  initialDownloads: Download[];
}

export function DownloadManagementTable({ initialDownloads }: DownloadManagementTableProps) {
  const router = useRouter();
  const [downloads, setDownloads] = useState<Download[]>(initialDownloads);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = [
    'All',
    'Therapeutic Index',
    'Price List',
    'MSDS',
    'Product Catalogue',
    'Compliance',
  ];

  const filtered =
    filterCategory === 'All'
      ? downloads
      : downloads.filter((d) => d.category === filterCategory);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete document "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/downloads?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDownloads((prev) => prev.filter((d) => d.id !== id));
        router.refresh();
      } else {
        alert('Failed to delete download document.');
      }
    } catch {
      alert('Error occurred while deleting document.');
    } finally {
      setDeletingId(null);
    }
  };

  const reloadDownloads = async () => {
    try {
      const res = await fetch('/api/downloads');
      const json = await res.json();
      if (json.downloads) {
        setDownloads(json.downloads);
      }
      router.refresh();
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#595C54]">
            Total Documents: <strong>{downloads.length}</strong>
          </span>
          <span className="text-neutral-300">|</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs border border-neutral-300 rounded px-2.5 py-1 bg-white text-[#12150F]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <DownloadFormModal onSuccess={reloadDownloads} />
      </div>

      <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[rgba(18,21,15,0.06)] flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#12150F]">
            Formulary & Technical Dossiers
          </h3>
          <Link
            href="/downloads"
            target="_blank"
            className="text-xs text-[#1F4D3A] hover:underline flex items-center gap-1 font-medium"
          >
            <span>View Public /downloads</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] text-[#595C54] font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Title & Category</th>
                <th className="p-3">Access</th>
                <th className="p-3">File Size</th>
                <th className="p-3">Downloads</th>
                <th className="p-3">Updated</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(18,21,15,0.06)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#595C54]">
                    No documents found in this category. Click &quot;Upload New Publication&quot; to add one.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="p-3">
                      <div className="flex items-start gap-2.5">
                        <FileText className="w-4 h-4 text-[#1F4D3A] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#12150F] block font-medium">
                            {d.title}
                          </strong>
                          <span className="text-[10px] text-[#595C54] font-mono">
                            {d.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      {d.gated ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>Gated Access</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Public / Open</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-[#595C54]">
                      {formatBytes(d.fileSize)}
                    </td>
                    <td className="p-3 font-mono font-semibold text-[#12150F]">
                      {d.downloadCount}
                    </td>
                    <td className="p-3 text-[#595C54]">
                      {formatDate(d.updatedAt)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                          d.published !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {d.published !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={d.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-[#595C54] hover:text-[#1F4D3A] rounded hover:bg-[#F5F5F2]"
                          title="Open/Download Document"
                        >
                          <DownloadIcon className="w-3.5 h-3.5" />
                        </a>
                        <DownloadFormModal
                          download={d}
                          onSuccess={reloadDownloads}
                        />
                        <button
                          onClick={() => handleDelete(d.id, d.title)}
                          disabled={deletingId === d.id}
                          className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50 transition-colors"
                          title="Delete Document"
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
