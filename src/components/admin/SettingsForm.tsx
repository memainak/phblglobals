'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SiteSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, CheckCircle2, AlertCircle, Phone, Mail, MapPin, ShieldCheck, Bell } from 'lucide-react';

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialSettings.name || 'Purusottam Homoeo Bikash Laboratory (Bonded)',
    shortName: initialSettings.shortName || 'PHBL',
    tagline: initialSettings.tagline || 'Every physician should prepare his own medicine',
    foundedYear: initialSettings.foundedYear || 2003,
    mfgLicenseNo: initialSettings.mfgLicenseNo || 'HL-792 M',
    primaryPhone: initialSettings.phones?.[0] || '9800011545',
    secondaryPhone: initialSettings.phones?.[1] || '9933301021',
    tollFreePhone: initialSettings.tollFreePhone || '9800011545',
    fax: initialSettings.fax?.join(', ') || '8250461569',
    email: initialSettings.email || 'phblkn@gmail.com',
    address: initialSettings.address || 'L/3, Saratpally, Paschim Medinipur, Pin 721101, West Bengal, India',
    announcementEnabled: initialSettings.announcementBar?.enabled ?? true,
    announcementText: initialSettings.announcementBar?.text || 'Helpline: 9800011545 | In-house Bonded Manufacturing Facility Estd. 2003',
    announcementLink: initialSettings.announcementBar?.link || '/contact',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const phones = [formData.primaryPhone.trim(), formData.secondaryPhone.trim()].filter(Boolean);
      const fax = formData.fax.split(',').map((s) => s.trim()).filter(Boolean);

      const payload: Partial<SiteSettings> = {
        name: formData.name.trim(),
        shortName: formData.shortName.trim(),
        tagline: formData.tagline.trim(),
        foundedYear: Number(formData.foundedYear),
        mfgLicenseNo: formData.mfgLicenseNo.trim(),
        phones,
        tollFreePhone: formData.tollFreePhone.trim(),
        fax,
        email: formData.email.trim(),
        address: formData.address.trim(),
        announcementBar: {
          enabled: formData.announcementEnabled,
          text: formData.announcementText.trim(),
          link: formData.announcementLink.trim(),
        },
      };

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save settings');
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && (
        <div className="p-4 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Site settings successfully updated in live database!</span>
        </div>
      )}

      {/* Section 1: Official Coordinates & Direct Telephony */}
      <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.08)] p-6 space-y-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[rgba(18,21,15,0.08)]">
          <Phone className="w-5 h-5 text-[#1F4D3A]" />
          <div>
            <h3 className="font-serif font-bold text-lg text-[#12150F]">
              Direct Contact & Telephony Coordinates
            </h3>
            <p className="text-xs text-[#595C54]">
              These numbers control calls, toll-free lines, and the floating WhatsApp trade enquiry button.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#12150F]">
              Primary Helpline / WhatsApp Number *
            </label>
            <Input
              required
              value={formData.primaryPhone}
              onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
              placeholder="e.g. 9800011545"
            />
            <span className="text-[10px] text-[#595C54] block">
              Connected to both phone calling and WhatsApp click-to-chat.
            </span>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#12150F]">Toll-Free / Support Line</label>
            <Input
              value={formData.tollFreePhone}
              onChange={(e) => setFormData({ ...formData, tollFreePhone: e.target.value })}
              placeholder="e.g. 9800011545"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#12150F]">Secondary Factory Line</label>
            <Input
              value={formData.secondaryPhone}
              onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
              placeholder="e.g. 9933301021"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#12150F]">Facsimile (Fax)</label>
            <Input
              value={formData.fax}
              onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
              placeholder="e.g. 8250461569"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Facility Address & Email */}
      <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.08)] p-6 space-y-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[rgba(18,21,15,0.08)]">
          <MapPin className="w-5 h-5 text-[#1F4D3A]" />
          <div>
            <h3 className="font-serif font-bold text-lg text-[#12150F]">
              Registered Factory Coordinates & Licensing
            </h3>
            <p className="text-xs text-[#595C54]">
              Displayed on public footer, contact page, and batch inspection reports.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1 sm:col-span-2">
            <label className="font-semibold text-[#12150F]">Registered Physical Address *</label>
            <Input
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#12150F]">Official Email Address *</label>
            <Input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#12150F]">Drug Manufacturing License No. *</label>
            <Input
              required
              value={formData.mfgLicenseNo}
              onChange={(e) => setFormData({ ...formData, mfgLicenseNo: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Section 3: Announcement Bar Banner */}
      <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.08)] p-6 space-y-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[rgba(18,21,15,0.08)]">
          <Bell className="w-5 h-5 text-[#1F4D3A]" />
          <div>
            <h3 className="font-serif font-bold text-lg text-[#12150F]">
              Website Top Announcement Bar
            </h3>
            <p className="text-xs text-[#595C54]">
              Sticky top notification banner displayed across all public visitor pages.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="announce-enabled"
              checked={formData.announcementEnabled}
              onChange={(e) => setFormData({ ...formData, announcementEnabled: e.target.checked })}
              className="rounded text-[#1F4D3A]"
            />
            <label htmlFor="announce-enabled" className="font-medium text-[#12150F] cursor-pointer">
              Enable Announcement Banner
            </label>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#12150F]">Banner Text</label>
            <Input
              value={formData.announcementText}
              onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#12150F]">Banner Click Link</label>
            <Input
              value={formData.announcementLink}
              onChange={(e) => setFormData({ ...formData, announcementLink: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Save Action */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Button
          type="submit"
          disabled={submitting}
          variant="primary"
          size="lg"
          className="gap-2 bg-[#1F4D3A] text-white hover:bg-[#16382A]"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? 'Saving Settings...' : 'Save Site Settings'}</span>
        </Button>
      </div>
    </form>
  );
}
