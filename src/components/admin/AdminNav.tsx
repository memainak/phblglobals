'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Boxes,
  FileCheck2,
  Inbox,
  RefreshCw,
  LogOut,
  ExternalLink,
  CheckCircle2,
  Award,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [revalidating, setRevalidating] = useState(false);
  const [revalidatedMsg, setRevalidatedMsg] = useState(false);

  const handlePublishNow = async () => {
    setRevalidating(true);
    setRevalidatedMsg(false);
    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/' }),
      });
      if (res.ok) {
        setRevalidatedMsg(true);
        setTimeout(() => setRevalidatedMsg(false), 3000);
      }
    } catch {
      // ignore
    } finally {
      setRevalidating(false);
    }
  };

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/batches', label: 'Batch Records & CSV', icon: FileCheck2 },
    { href: '/admin/products', label: 'Products', icon: Boxes },
    { href: '/admin/certifications', label: 'Certificates', icon: Award },
    { href: '/admin/enquiries', label: 'Inquiries Inbox', icon: Inbox },
    { href: '/admin/settings', label: 'Site & Contact', icon: Settings },
  ];

  return (
    <header className="bg-[#12150F] text-white border-b border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-sm bg-[#1F4D3A] text-white font-serif font-bold text-sm flex items-center justify-center">
                P
              </span>
              <span className="font-serif font-bold text-lg text-white">
                PHBL Admin Portal
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      active
                        ? 'bg-white/15 text-white'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Instant Publish Button */}
            <Button
              onClick={handlePublishNow}
              disabled={revalidating}
              variant="secondary"
              size="sm"
              className="gap-1.5 text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900"
            >
              {revalidatedMsg ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cache Purged!</span>
                </>
              ) : (
                <>
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${revalidating ? 'animate-spin' : ''}`}
                  />
                  <span>Publish Changes Now</span>
                </>
              )}
            </Button>

            <Link
              href="/"
              target="_blank"
              className="text-xs text-neutral-400 hover:text-white inline-flex items-center gap-1"
              title="Open public website"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                router.push('/admin/login');
                router.refresh();
              }}
              className="text-neutral-400 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
              title="Sign Out of Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
