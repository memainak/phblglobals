'use client';

import React, { useState } from 'react';
import { Printer, Copy, Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BatchRecordActions({ batchNo }: { batchNo: string }) {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex items-center gap-2.5 no-print">
      <Button
        onClick={handlePrint}
        variant="primary"
        size="md"
        className="gap-2 font-medium"
      >
        <Printer className="w-4 h-4" />
        <span>Print Certificate / Save PDF</span>
      </Button>

      <Button
        onClick={handleCopyLink}
        variant="outline"
        size="md"
        className="gap-2 font-medium"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700">Link Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copy Direct URL</span>
          </>
        )}
      </Button>
    </div>
  );
}
