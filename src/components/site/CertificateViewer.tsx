'use client';

import React, { useState } from 'react';
import { Certification } from '@/types';
import { Award, Calendar, CheckCircle2, AlertTriangle, ExternalLink, X, ShieldCheck } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CertificateViewerProps {
  certifications: Certification[];
}

export function CertificateViewer({
  certifications,
}: CertificateViewerProps) {
  const [activeCert, setActiveCert] = useState<Certification | null>(null);

  const checkExpired = (validUntil: string | null) => {
    if (!validUntil) return false;
    const exp = new Date(validUntil);
    const now = new Date();
    return exp.getTime() < now.getTime();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {certifications.map((cert) => {
          const isExpired = checkExpired(cert.validUntil);
          return (
            <div
              key={cert.id}
              className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] p-6 space-y-5 hover:border-[#1F4D3A]/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-10 h-10 rounded-sm bg-[#FDFBF3] text-[#C9A227] flex items-center justify-center border border-[#C9A227]/30 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>

                  {isExpired ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Expired / Renewal in Progress</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Valid & Active</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-[#12150F]">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-[#595C54]">
                    Issuing Body: <strong>{cert.issuingBody}</strong>
                  </p>
                </div>

                <div className="bg-[#FAFAF8] p-3 rounded-md border border-[rgba(18,21,15,0.06)] space-y-1 text-xs font-mono">
                  <div className="text-[#12150F]">
                    Certificate No: <strong>{cert.certificateNo}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-[#595C54]">
                    <Calendar className="w-3 h-3 text-[#1F4D3A]" />
                    <span>Issued: {formatDate(cert.issuedOn)}</span>
                    <span>·</span>
                    <span>
                      {cert.validUntil
                        ? `Valid Until: ${formatDate(cert.validUntil)}`
                        : 'Perpetual Bonded License'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[rgba(18,21,15,0.06)] flex items-center justify-between">
                <button
                  onClick={() => setActiveCert(cert)}
                  className="text-xs font-semibold text-[#1F4D3A] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect Certificate Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono text-[#595C54]">
                  Regulatory Verified
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activeCert && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.12)] max-w-xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setActiveCert(null)}
              className="absolute top-4 right-4 text-[#595C54] hover:text-[#12150F] p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase font-semibold text-[#1F4D3A]">
                Accreditation Document
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#12150F]">
                {activeCert.title}
              </h3>
              <p className="text-xs text-[#595C54]">
                Audited and registered under standard pharmacopoeial quality provisions.
              </p>
            </div>

            <div className="p-4 bg-[#FAFAF8] rounded-md border border-[rgba(18,21,15,0.08)] space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[rgba(18,21,15,0.06)]">
                <span className="text-[#595C54]">Certificate Number:</span>
                <span className="font-mono font-bold text-[#12150F]">
                  {activeCert.certificateNo}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[rgba(18,21,15,0.06)]">
                <span className="text-[#595C54]">Issuing Authority:</span>
                <span className="font-semibold text-[#12150F]">
                  {activeCert.issuingBody}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[rgba(18,21,15,0.06)]">
                <span className="text-[#595C54]">Registration Date:</span>
                <span className="font-mono text-[#12150F]">
                  {formatDate(activeCert.issuedOn)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#595C54]">Validity Status:</span>
                <span className="font-mono text-[#1F4D3A] font-semibold">
                  {activeCert.validUntil
                    ? formatDate(activeCert.validUntil)
                    : 'Perpetual Bonded Validity'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded bg-[#F0F5F2] border border-[#1F4D3A]/15 text-xs text-[#1F4D3A] space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Drug Inspection Authenticated</span>
              </div>
              <p className="text-[11px] text-[#595C54]">
                Hard copies of audited GMP compliance dossiers and calibration logs are maintained on-site at L/3, Saratpally, Paschim Medinipur for official AYUSH and CDSCO drug controller inspection.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button onClick={() => setActiveCert(null)} variant="primary" size="md">
                Close Viewer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
