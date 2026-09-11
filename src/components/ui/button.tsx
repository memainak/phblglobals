import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D3A]/40 disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-sm';

    const variants = {
      primary:
        'bg-[#1F4D3A] text-white hover:bg-[#16382A] shadow-xs active:translate-y-[1px]',
      secondary:
        'bg-[#F0F5F2] text-[#1F4D3A] hover:bg-[#E3ECE6] active:translate-y-[1px]',
      outline:
        'border border-[rgba(18,21,15,0.15)] bg-white text-[#12150F] hover:bg-[#FAFAF8] hover:border-[#12150F]/40 active:translate-y-[1px]',
      ghost:
        'text-[#12150F] hover:bg-[#12150F]/5 active:bg-[#12150F]/10',
      gold:
        'bg-[#C9A227] text-white hover:bg-[#B38E1E] active:translate-y-[1px]',
      danger:
        'bg-rose-700 text-white hover:bg-rose-800 active:translate-y-[1px]',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 py-2 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
