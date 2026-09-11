import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'botanical' | 'gold' | 'outline' | 'neutral' | 'success' | 'warning' | 'danger';
}

export function Badge({
  className,
  variant = 'neutral',
  ...props
}: BadgeProps) {
  const base =
    'inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase transition-colors';

  const variants = {
    botanical:
      'bg-[#F0F5F2] text-[#1F4D3A] border border-[#1F4D3A]/20',
    gold:
      'bg-[#FDFBF3] text-[#8C6D13] border border-[#C9A227]/30',
    outline:
      'border border-[rgba(18,21,15,0.12)] text-[#12150F]',
    neutral:
      'bg-[#F5F5F2] text-[#595C54]',
    success:
      'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning:
      'bg-amber-50 text-amber-800 border border-amber-200',
    danger:
      'bg-rose-50 text-rose-800 border border-rose-200',
  };

  return (
    <div className={cn(base, variants[variant], className)} {...props} />
  );
}
