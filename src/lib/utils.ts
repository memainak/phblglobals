import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import QRCode from 'qrcode';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr || dateStr === 'N.A.') return 'N.A.';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export type BatchStatusType = 'valid' | 'expiring-soon' | 'expired' | 'undated';

export interface BatchExpiryAnalysis {
  status: BatchStatusType;
  label: string;
  badgeClass: string;
  daysRemaining?: number;
}

export function analyzeBatchExpiry(
  expDateStr: string | null | undefined,
  expiryNote?: string
): BatchExpiryAnalysis {
  if (!expDateStr || expDateStr === 'N.A.') {
    if (expiryNote) {
      return {
        status: 'valid',
        label: expiryNote,
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    }
    return {
      status: 'undated',
      label: 'Standard Pharmacopoeia Rule',
      badgeClass: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    };
  }

  try {
    const expDate = new Date(expDateStr);
    if (isNaN(expDate.getTime())) {
      return {
        status: 'valid',
        label: expDateStr,
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    }

    const now = new Date();
    const diffMs = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        status: 'expired',
        label: 'Expired Batch',
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
        daysRemaining: diffDays,
      };
    }

    if (diffDays <= 90) {
      return {
        status: 'expiring-soon',
        label: `Expiring Soon (${diffDays} days left)`,
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        daysRemaining: diffDays,
      };
    }

    return {
      status: 'valid',
      label: 'Active & Verified',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      daysRemaining: diffDays,
    };
  } catch {
    return {
      status: 'valid',
      label: 'Active Batch',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    };
  }
}

export async function generateQrCodeSvg(text: string): Promise<string> {
  try {
    return await QRCode.toString(text, {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#12150F',
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.error('QR code generation failed:', err);
    return '';
  }
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
