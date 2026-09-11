'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Enquiry, DistributorEnquiry } from '@/types';
import { formatDate } from '@/lib/utils';
import { Inbox, Download, Trash2, Eye, X, CheckCircle2, Phone, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnquiriesInboxProps {
  initialEnquiries: Enquiry[];
  initialDistributorEnquiries: DistributorEnquiry[];
}

export function EnquiriesInbox({
  initialEnquiries,
  initialDistributorEnquiries,
}: EnquiriesInboxProps) {
  const router = useRouter();
  const [tab, setTab] = useState<'general' | 'distributor'>('general');
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [distributorEnquiries, setDistributorEnquiries] = useState<DistributorEnquiry[]>(
    initialDistributorEnquiries
  );

  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [selectedDistributor, setSelectedDistributor] = useState<DistributorEnquiry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const exportEnquiriesCsv = () => {
    let csv = '';
    if (tab === 'general') {
      csv = 'Type,Name,Email,Phone,Product,Message,Date,Status\n';
      enquiries.forEach((e) => {
        csv += `"${e.type}","${e.name}","${e.email}","${e.phone}","${e.productName || ''}","${e.message.replace(/"/g, '""')}","${e.createdAt}","${e.status}"\n`;
      });
    } else {
      csv = 'Firm,Contact,Email,Phone,GSTIN,DrugLicense,City,State,YearsInTrade,Volume,Date,Status\n';
      distributorEnquiries.forEach((d) => {
        csv += `"${d.firmName}","${d.contactPerson}","${d.email}","${d.phone}","${d.gstin}","${d.drugLicenseNo}","${d.city}","${d.state}",${d.yearsInTrade},"${d.monthlyVolumeEstimate}","${d.createdAt}","${d.status}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `phbl_${tab}_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/enquiry', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus as Enquiry['status'] } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus as Enquiry['status'] });
        }
      }
    } catch {
      alert('Failed to update status.');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/enquiry?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      } else {
        alert('Failed to delete enquiry.');
      }
    } catch {
      alert('Error occurred while deleting.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateDistributorStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/enquiry', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, isDistributor: true }),
      });
      if (res.ok) {
        setDistributorEnquiries((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status: newStatus as DistributorEnquiry['status'] } : d))
        );
        if (selectedDistributor && selectedDistributor.id === id) {
          setSelectedDistributor({ ...selectedDistributor, status: newStatus as DistributorEnquiry['status'] });
        }
      }
    } catch {
      alert('Failed to update distributor status.');
    }
  };

  const handleDeleteDistributor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this distributor application?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/enquiry?id=${encodeURIComponent(id)}&isDistributor=true`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDistributorEnquiries((prev) => prev.filter((d) => d.id !== id));
        if (selectedDistributor?.id === id) setSelectedDistributor(null);
      } else {
        alert('Failed to delete distributor application.');
      }
    } catch {
      alert('Error occurred while deleting.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[rgba(18,21,15,0.08)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('general')}
            className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              tab === 'general'
                ? 'bg-[#1F4D3A] text-white'
                : 'bg-white text-[#595C54] hover:bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)]'
            }`}
          >
            General & Doctor Inquiries ({enquiries.length})
          </button>
          <button
            onClick={() => setTab('distributor')}
            className={`px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              tab === 'distributor'
                ? 'bg-[#1F4D3A] text-white'
                : 'bg-white text-[#595C54] hover:bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)]'
            }`}
          >
            Distributor Applications ({distributorEnquiries.length})
          </button>
        </div>

        <Button
          onClick={exportEnquiriesCsv}
          variant="outline"
          size="sm"
          className="gap-1.5 font-medium"
        >
          <Download className="w-3.5 h-3.5 text-[#1F4D3A]" />
          <span>Export {tab === 'general' ? 'Inquiries' : 'Distributors'} CSV</span>
        </Button>
      </div>

      {/* General Enquiries View */}
      {tab === 'general' && (
        <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF8] text-[#595C54] font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Sender Name</th>
                  <th className="p-3">Contact Details</th>
                  <th className="p-3">Inquiry Message</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(18,21,15,0.06)]">
                {enquiries.length > 0 ? (
                  enquiries.map((e) => (
                    <tr key={e.id} className="hover:bg-[#FAFAF8] transition-colors">
                      <td className="p-3 font-mono text-[#595C54] whitespace-nowrap">
                        {formatDate(e.createdAt)}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F0F5F2] text-[#1F4D3A]">
                          {e.type}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-[#12150F]">
                        {e.name}
                        {e.productName && (
                          <div className="text-[10px] text-[#1F4D3A] font-normal">
                            Re: {e.productName}
                          </div>
                        )}
                      </td>
                      <td className="p-3 space-y-0.5">
                        <div className="text-[#12150F]">{e.email}</div>
                        <div className="font-mono text-[#595C54]">{e.phone}</div>
                      </td>
                      <td className="p-3 text-[#595C54] max-w-sm truncate">
                        {e.message}
                      </td>
                      <td className="p-3">
                        <select
                          value={e.status}
                          onChange={(ev) => handleUpdateStatus(e.id, ev.target.value)}
                          className="h-7 rounded border border-neutral-300 text-[11px] px-2 bg-white font-medium focus:ring-1 focus:ring-[#1F4D3A] focus:outline-hidden"
                        >
                          <option value="new">NEW</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="closed">CLOSED</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedEnquiry(e)}
                            className="p-1 text-[#1F4D3A] hover:bg-[#F0F5F2] rounded transition-colors cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === e.id}
                            onClick={() => handleDeleteEnquiry(e.id)}
                            className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#595C54]">
                      No general customer or doctor enquiries logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Distributor Applications View */}
      {tab === 'distributor' && (
        <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF8] text-[#595C54] font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Firm Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">GSTIN & Drug License</th>
                  <th className="p-3">Territory</th>
                  <th className="p-3">Est. Volume</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(18,21,15,0.06)]">
                {distributorEnquiries.length > 0 ? (
                  distributorEnquiries.map((d) => (
                    <tr key={d.id} className="hover:bg-[#FAFAF8] transition-colors">
                      <td className="p-3 font-mono text-[#595C54] whitespace-nowrap">
                        {formatDate(d.createdAt)}
                      </td>
                      <td className="p-3 font-semibold text-[#12150F]">
                        {d.firmName}
                        <div className="text-[10px] text-[#595C54] font-normal">
                          {d.city}, {d.state} ({d.yearsInTrade} yrs)
                        </div>
                      </td>
                      <td className="p-3 space-y-0.5">
                        <div className="font-medium text-[#12150F]">{d.contactPerson}</div>
                        <div className="text-[11px] text-[#595C54]">{d.email}</div>
                        <div className="font-mono text-[11px] text-[#595C54]">{d.phone}</div>
                      </td>
                      <td className="p-3 font-mono text-[11px] space-y-0.5">
                        <div className="text-[#1F4D3A] font-semibold">{d.gstin}</div>
                        <div className="text-[#595C54]">DL: {d.drugLicenseNo}</div>
                      </td>
                      <td className="p-3 font-medium text-[#12150F]">
                        {d.territoryOfInterest}
                      </td>
                      <td className="p-3 font-semibold text-[#1F4D3A]">
                        {d.monthlyVolumeEstimate}
                      </td>
                      <td className="p-3">
                        <select
                          value={d.status}
                          onChange={(ev) => handleUpdateDistributorStatus(d.id, ev.target.value)}
                          className="h-7 rounded border border-neutral-300 text-[11px] px-2 bg-white font-medium focus:ring-1 focus:ring-[#1F4D3A] focus:outline-hidden"
                        >
                          <option value="new">NEW</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="closed">CLOSED</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedDistributor(d)}
                            className="p-1 text-[#1F4D3A] hover:bg-[#F0F5F2] rounded transition-colors cursor-pointer"
                            title="View Full Application"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDistributor(d.id)}
                            disabled={deletingId === d.id}
                            className="p-1 text-[#C4433A] hover:bg-red-50 rounded transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete Application"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-[#595C54]">
                      No wholesale distributor applications logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal for General Enquiry */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.12)] w-full max-w-lg shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-6 border-b border-[rgba(18,21,15,0.08)]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1F4D3A] font-bold">
                  {selectedEnquiry.type} INQUIRY
                </span>
                <h3 className="font-serif font-bold text-xl text-[#12150F]">
                  From: {selectedEnquiry.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded text-neutral-400 hover:text-[#12150F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[rgba(18,21,15,0.08)]">
                <div>
                  <span className="text-[#595C54] block">Email:</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="font-semibold text-[#1F4D3A] hover:underline">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-[#595C54] block">Phone:</span>
                  <a href={`tel:${selectedEnquiry.phone}`} className="font-semibold text-[#1F4D3A] hover:underline font-mono">
                    {selectedEnquiry.phone}
                  </a>
                </div>
              </div>

              {selectedEnquiry.productName && (
                <div>
                  <span className="text-[#595C54] block">Referenced Product:</span>
                  <strong className="text-sm text-[#12150F]">{selectedEnquiry.productName}</strong>
                </div>
              )}

              <div>
                <span className="text-[#595C54] block mb-1">Message Content:</span>
                <div className="p-4 rounded-md bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)] text-[#12150F] leading-relaxed whitespace-pre-wrap text-xs sm:text-sm">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[#595C54] font-mono text-[11px]">
                  Received: {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[#595C54]">Status:</span>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(ev) => handleUpdateStatus(selectedEnquiry.id, ev.target.value)}
                    className="h-7 rounded border border-neutral-300 text-xs px-2 bg-white font-medium"
                  >
                    <option value="new">NEW</option>
                    <option value="contacted">CONTACTED</option>
                    <option value="closed">CLOSED</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end p-4 border-t border-[rgba(18,21,15,0.08)]">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedEnquiry(null)}
                className="bg-[#1F4D3A] text-white hover:bg-[#16382A]"
              >
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal for Distributor Application */}
      {selectedDistributor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.12)] w-full max-w-xl shadow-xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[rgba(18,21,15,0.08)]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1F4D3A] font-bold">
                  DISTRIBUTOR APPLICATION
                </span>
                <h3 className="font-serif font-bold text-xl text-[#12150F]">
                  {selectedDistributor.firmName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDistributor(null)}
                className="p-1 rounded text-neutral-400 hover:text-[#12150F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[rgba(18,21,15,0.08)]">
                <div>
                  <span className="text-[#595C54] block">Contact Person:</span>
                  <strong className="text-[#12150F]">{selectedDistributor.contactPerson}</strong>
                </div>
                <div>
                  <span className="text-[#595C54] block">City & State:</span>
                  <strong className="text-[#12150F]">{selectedDistributor.city}, {selectedDistributor.state}</strong>
                </div>
                <div>
                  <span className="text-[#595C54] block">Email:</span>
                  <a href={`mailto:${selectedDistributor.email}`} className="font-semibold text-[#1F4D3A] hover:underline">
                    {selectedDistributor.email}
                  </a>
                </div>
                <div>
                  <span className="text-[#595C54] block">Phone:</span>
                  <a href={`tel:${selectedDistributor.phone}`} className="font-semibold text-[#1F4D3A] hover:underline font-mono">
                    {selectedDistributor.phone}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[rgba(18,21,15,0.08)]">
                <div>
                  <span className="text-[#595C54] block">GSTIN:</span>
                  <span className="font-mono font-bold text-[#1F4D3A]">{selectedDistributor.gstin}</span>
                </div>
                <div>
                  <span className="text-[#595C54] block">Drug License No:</span>
                  <span className="font-mono font-bold text-[#1F4D3A]">{selectedDistributor.drugLicenseNo}</span>
                </div>
                <div>
                  <span className="text-[#595C54] block">Years in Pharmaceutical Trade:</span>
                  <strong className="text-[#12150F]">{selectedDistributor.yearsInTrade} years</strong>
                </div>
                <div>
                  <span className="text-[#595C54] block">Estimated Monthly Volume:</span>
                  <strong className="text-[#1F4D3A]">{selectedDistributor.monthlyVolumeEstimate}</strong>
                </div>
              </div>

              <div>
                <span className="text-[#595C54] block">Requested Distribution Territory:</span>
                <p className="font-semibold text-[#12150F] mt-0.5">{selectedDistributor.territoryOfInterest}</p>
              </div>

              {selectedDistributor.existingBrandsCarried && (
                <div>
                  <span className="text-[#595C54] block">Currently Represented Brands:</span>
                  <p className="text-[#12150F] mt-0.5">{selectedDistributor.existingBrandsCarried}</p>
                </div>
              )}

              {selectedDistributor.message && (
                <div>
                  <span className="text-[#595C54] block">Notes / Additional Message:</span>
                  <p className="text-[#12150F] mt-0.5 whitespace-pre-wrap">{selectedDistributor.message}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[#595C54] font-mono text-[11px]">
                  Received: {new Date(selectedDistributor.createdAt).toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[#595C54]">Status:</span>
                  <select
                    value={selectedDistributor.status}
                    onChange={(ev) => handleUpdateDistributorStatus(selectedDistributor.id, ev.target.value)}
                    className="h-7 rounded border border-neutral-300 text-xs px-2 bg-white font-medium"
                  >
                    <option value="new">NEW</option>
                    <option value="contacted">CONTACTED</option>
                    <option value="closed">CLOSED</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end p-4 border-t border-[rgba(18,21,15,0.08)]">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedDistributor(null)}
                className="bg-[#1F4D3A] text-white hover:bg-[#16382A]"
              >
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
