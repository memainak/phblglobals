'use client';

import React, { useState } from 'react';
import { Download as DownloadType } from '@/types';
import { FileText, Download as DownloadIcon, Lock, CheckCircle2, X } from 'lucide-react';
import { formatDate, formatBytes } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DownloadManagerProps {
  initialDownloads: DownloadType[];
}

export function DownloadManager({
  initialDownloads,
}: DownloadManagerProps) {
  const [downloads, setDownloads] = useState<DownloadType[]>(initialDownloads);
  const [activeCategory, setActiveCategory] = useState('All');
  const [gatedTarget, setGatedTarget] = useState<DownloadType | null>(null);
  const [gatedForm, setGatedForm] = useState({ name: '', email: '' });
  const [gatedSubmitted, setGatedSubmitted] = useState(false);

  const categories = [
    'All',
    'Therapeutic Index',
    'Price List',
    'MSDS',
    'Product Catalogue',
    'Compliance',
  ];

  const filtered =
    activeCategory === 'All'
      ? downloads
      : downloads.filter((d) => d.category === activeCategory);

  const handleDownload = async (item: DownloadType) => {
    if (item.gated) {
      setGatedTarget(item);
      setGatedSubmitted(false);
      return;
    }

    triggerDownload(item);
  };

  const triggerDownload = async (item: DownloadType) => {
    // Increment download count via API route
    try {
      await fetch('/api/download-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      });
    } catch {
      // Ignore count increment error on client
    }

    // Update local state counter
    setDownloads((prev) =>
      prev.map((d) =>
        d.id === item.id ? { ...d, downloadCount: d.downloadCount + 1 } : d
      )
    );

    // Trigger actual file download
    if (item.fileUrl) {
      const link = document.createElement('a');
      link.href = item.fileUrl;
      const filename = item.fileUrl.split('/').pop() || `${item.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      link.setAttribute('download', filename);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleGatedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gatedTarget) return;

    try {
      await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Therapeutic Index Booklet',
          name: gatedForm.name,
          email: gatedForm.email,
          phone: 'N.A.',
          message: `Gated download unlocked for: ${gatedTarget.title}`,
          consent: true,
        }),
      });
    } catch {
      // Proceed to download
    }

    setGatedSubmitted(true);
    triggerDownload(gatedTarget);
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[rgba(18,21,15,0.08)]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#1F4D3A] text-white'
                : 'bg-white text-[#595C54] hover:bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Downloads Table */}
      <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAFAF8] border-b border-[rgba(18,21,15,0.08)] text-[#595C54] font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Asset Title</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Category</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">File Size</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">Updated</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Downloads</th>
                <th className="py-3.5 px-4 text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(18,21,15,0.06)] text-[#12150F]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-start gap-2.5">
                      <FileText className="w-4 h-4 text-[#1F4D3A] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-[#12150F] block">
                          {item.title}
                        </span>
                        <div className="md:hidden text-[11px] text-[#595C54] mt-0.5">
                          {item.category} · {formatBytes(item.fileSize)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell text-xs text-[#595C54]">
                    {item.category}
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell font-mono text-xs text-[#595C54]">
                    {formatBytes(item.fileSize)}
                  </td>
                  <td className="py-4 px-4 hidden lg:table-cell text-xs text-[#595C54]">
                    {formatDate(item.updatedAt)}
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell font-mono text-xs text-[#595C54]">
                    {item.downloadCount}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button
                      onClick={() => handleDownload(item)}
                      variant={item.gated ? 'outline' : 'primary'}
                      size="sm"
                      className="gap-1.5 font-medium"
                    >
                      {item.gated ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-[#C9A227]" />
                          <span>Request Access</span>
                        </>
                      ) : (
                        <>
                          <DownloadIcon className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gated Unlock Modal */}
      {gatedTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.12)] max-w-md w-full p-6 sm:p-8 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setGatedTarget(null)}
              className="absolute top-4 right-4 text-[#595C54] hover:text-[#12150F] p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {gatedSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-[#12150F]">
                  Document Unlocked
                </h3>
                <p className="text-xs text-[#595C54]">
                  Your download has started. A copy has also been sent to <strong>{gatedForm.email}</strong>.
                </p>
                <Button onClick={() => setGatedTarget(null)} variant="primary" size="sm">
                  Close Window
                </Button>
              </div>
            ) : (
              <div>
                <div className="space-y-1 mb-4">
                  <span className="text-xs font-mono uppercase font-semibold text-[#1F4D3A]">
                    Registered Clinician Access
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#12150F]">
                    Unlock & Download Monograph
                  </h3>
                  <p className="text-xs text-[#595C54]">
                    Please provide your email to receive <strong>{gatedTarget.title}</strong>.
                  </p>
                </div>

                <form onSubmit={handleGatedSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-[#12150F] mb-1">
                      Doctor / Firm Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Dr. Name"
                      value={gatedForm.name}
                      onChange={(e) =>
                        setGatedForm({ ...gatedForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#12150F] mb-1">
                      Email Address *
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="doctor@clinic.com"
                      value={gatedForm.email}
                      onChange={(e) =>
                        setGatedForm({ ...gatedForm, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="pt-2">
                    <Button type="submit" variant="primary" size="md" className="w-full">
                      Unlock & Download PDF
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
