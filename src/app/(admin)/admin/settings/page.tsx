import React from 'react';
import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/queries';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const metadata: Metadata = {
  title: 'Site Settings & Coordinates | PHBL Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[rgba(18,21,15,0.08)]">
        <span className="text-xs font-mono uppercase text-[#1F4D3A] font-semibold">
          Corporate Coordinates CMS
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#12150F]">
          Site Coordinates & Contact Configuration
        </h1>
        <p className="text-xs text-[#595C54] mt-1">
          Manage live telephone hotlines, WhatsApp connection, factory coordinates, and announcement notices.
        </p>
      </div>

      {/* Settings Form */}
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
