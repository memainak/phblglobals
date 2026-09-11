'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin route runtime error caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.12)] p-8 max-w-lg w-full space-y-6 shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-[#12150F]">
            Admin Console Notice
          </h1>
          <p className="text-xs text-[#595C54]">
            An unexpected error occurred while loading this administrative view.
          </p>
        </div>

        {error?.message && (
          <div className="p-3 rounded bg-neutral-50 border border-neutral-200 text-left font-mono text-[11px] text-neutral-700 overflow-x-auto max-h-32">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#1F4D3A] text-white text-xs font-semibold hover:bg-[#16382a] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Site</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
