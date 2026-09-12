import React from 'react';
import type { Metadata } from 'next';
import { getSiteSettings, getProducts } from '@/lib/queries';
import { ContactForm } from '@/components/site/ContactForm';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Corporate Office & Manufacturing Plant | PHBL',
  description:
    'Contact Purusottam Homeo Bikash Lab(Bonded) in Paschim Medinipur, West Bengal. Helpline: 9800011545. Official factory coordinates and inquiry desks.',
};

export const revalidate = 3600;

export default async function ContactPage() {
  const [settings, products] = await Promise.all([
    getSiteSettings(),
    getProducts(),
  ]);

  const productNames = products.map((p) => p.name);

  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3 border-b border-[rgba(18,21,15,0.08)] pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#1F4D3A] uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Corporate & Manufacturing Headquarters</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F]">
            Contact Plant Coordinates
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-3xl leading-relaxed">
            Direct channels for healthcare institutions, doctors, registered stockists, and drug regulatory bodies. Reach our Paschim Medinipur facility via toll-free phone, email, or formal dispatch.
          </p>
        </div>

        {/* 2-Column Grid: Form Left, Details Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form Left */}
          <div className="lg:col-span-7">
            <ContactForm productNames={productNames} />
          </div>

          {/* Details Right */}
          <div className="lg:col-span-5 space-y-6">
            {/* Coordinates Card */}
            <div className="bg-white p-8 rounded-lg border border-[rgba(18,21,15,0.08)] space-y-6 shadow-xs">
              <h3 className="font-serif text-2xl font-bold text-[#12150F] pb-3 border-b border-[rgba(18,21,15,0.08)]">
                Plant Coordinates
              </h3>

              <div className="space-y-4 text-sm text-[#595C54]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#1F4D3A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#12150F] block">Registered Address</strong>
                    <span>{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#1F4D3A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#12150F] block">Direct Telephony</strong>
                    <div className="space-y-0.5">
                      <div>
                        Toll-Free Helpline:{' '}
                        <a
                          href={`tel:${settings.tollFreePhone}`}
                          className="font-mono text-[#1F4D3A] font-semibold hover:underline"
                        >
                          {settings.tollFreePhone}
                        </a>
                      </div>
                      <div>
                        Plant Desk:{' '}
                        <a
                          href={`tel:${settings.phones[0]}`}
                          className="font-mono text-[#1F4D3A] font-semibold hover:underline"
                        >
                          {settings.phones[0]}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#1F4D3A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#12150F] block">Official Email</strong>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-[#1F4D3A] hover:underline"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#1F4D3A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#12150F] block">Operational Hours</strong>
                    <span>Monday – Saturday: 09:30 AM – 06:30 PM IST</span>
                    <span className="block text-xs text-[#595C54] mt-0.5">
                      Sunday: Plant maintenance and cleanroom sterilization
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-md bg-[#F0F5F2] border border-[#1F4D3A]/15 text-xs text-[#1F4D3A] space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Bonded Manufacturing Facility (HL-792 M)</span>
                </div>
                <p className="text-[11px] text-[#595C54]">
                  Physical visits by bulk stockists and institutional delegations require prior appointment.
                </p>
              </div>
            </div>

            {/* Embedded Location Representation / Map */}
            <div className="bg-white p-6 rounded-lg border border-[rgba(18,21,15,0.08)] space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-[#12150F]">
                  Geographic Plant Location
                </span>
                <a
                  href="https://maps.google.com/?q=Purusottam+Homeo+Bikash+Laboratory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#1F4D3A] hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Official Google Maps Interactive Embed */}
              <div className="w-full h-80 sm:h-96 rounded-lg overflow-hidden border border-[rgba(18,21,15,0.08)] shadow-xs relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3688.3685167239923!2d87.30426777529586!3d22.41515137960424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1d5b50fb6632f5%3A0xe542e78a6fe75b3e!2sPurusottam%20Homeo%20Bikash%20Laboratory!5e0!3m2!1sen!2sin!4v1789199986414!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Purusottam Homeo Bikash Laboratory Location"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
