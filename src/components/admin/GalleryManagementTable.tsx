'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GalleryItem } from '@/types';
import { GalleryFormModal } from '@/components/admin/GalleryFormModal';
import { ExternalLink, Trash2, Camera, ImageIcon } from 'lucide-react';

interface GalleryManagementTableProps {
  initialGallery: GalleryItem[];
}

export function GalleryManagementTable({ initialGallery }: GalleryManagementTableProps) {
  const router = useRouter();
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterAlbum, setFilterAlbum] = useState<string>('All');

  React.useEffect(() => {
    setGallery(initialGallery);
  }, [initialGallery]);

  const albums = ['All', 'Factory', 'Laboratory', 'Products', 'Exhibitions', 'Events'];

  const filtered =
    filterAlbum === 'All'
      ? gallery
      : gallery.filter((g) => g.album === filterAlbum);

  const handleDelete = async (id: string, caption: string) => {
    if (!confirm(`Are you sure you want to permanently delete photo "${caption}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setGallery((prev) => prev.filter((g) => g.id !== id));
        router.refresh();
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(`Failed to delete gallery photo: ${errJson.error || 'Server error'}`);
      }
    } catch (err) {
      alert(`Error occurred while deleting photo: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDeletingId(null);
    }
  };

  const reloadGallery = async () => {
    try {
      const res = await fetch('/api/gallery?_t=' + Date.now());
      const json = await res.json();
      if (json.gallery) {
        setGallery(json.gallery);
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
            Total Photos: <strong>{gallery.length}</strong>
          </span>
          <span className="text-neutral-300">|</span>
          <select
            value={filterAlbum}
            onChange={(e) => setFilterAlbum(e.target.value)}
            className="text-xs border border-neutral-300 rounded px-2.5 py-1 bg-white text-[#12150F]"
          >
            {albums.map((a) => (
              <option key={a} value={a}>
                {a === 'All' ? 'All Divisions' : `${a} Division`}
              </option>
            ))}
          </select>
        </div>
        <GalleryFormModal onSuccess={reloadGallery} />
      </div>

      <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[rgba(18,21,15,0.06)] flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#12150F]">
            Plant & Infrastructure Visual Archives
          </h3>
          <Link
            href="/gallery"
            target="_blank"
            className="text-xs text-[#1F4D3A] hover:underline flex items-center gap-1 font-medium"
          >
            <span>View Public /gallery</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] text-[#595C54] font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Thumbnail</th>
                <th className="p-3">Division / Album</th>
                <th className="p-3">Caption</th>
                <th className="p-3">Order</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(18,21,15,0.06)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#595C54]">
                    No photos found in this division. Click &quot;Upload Gallery Photo&quot; to add one.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="p-3">
                      <div className="w-14 h-11 rounded border border-neutral-200 overflow-hidden relative bg-neutral-100 flex items-center justify-center">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt={item.caption}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-neutral-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#1F4D3A]/10 text-[#1F4D3A]">
                        {item.album}
                      </span>
                    </td>
                    <td className="p-3">
                      <strong className="text-[#12150F] block font-medium max-w-sm line-clamp-2">
                        {item.caption}
                      </strong>
                    </td>
                    <td className="p-3 font-mono text-[#595C54]">
                      {item.order}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                          item.published !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {item.published !== false ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={item.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-[#595C54] hover:text-[#1F4D3A] rounded hover:bg-[#F5F5F2]"
                          title="View High-Res Photo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <GalleryFormModal
                          item={item}
                          onSuccess={reloadGallery}
                        />
                        <button
                          onClick={() => handleDelete(item.id, item.caption)}
                          disabled={deletingId === item.id}
                          className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50 transition-colors"
                          title="Delete Photo"
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
