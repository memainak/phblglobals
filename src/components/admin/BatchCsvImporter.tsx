'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BatchCsvImporter({ onImportSuccess }: { onImportSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [parsedRows, setParsedRows] = useState<Record<string, unknown>[]>([]);
  const [errors, setErrors] = useState<{ row: number; batchNo?: string; error: string }[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setErrors([]);
    setSuccessMessage(null);

    Papa.parse(selected, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedRows(results.data as Record<string, unknown>[]);
      },
      error: (err) => {
        setErrors([{ row: 0, error: `CSV Parsing error: ${err.message}` }]);
      },
    });
  };

  const handleCommitImport = async () => {
    if (parsedRows.length === 0) return;
    setImporting(true);
    setErrors([]);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/batch/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: parsedRows }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors([{ row: 0, error: data.error || 'Failed to import batches.' }]);
        }
      } else {
        setSuccessMessage(data.message || 'Import successful!');
        setParsedRows([]);
        setFile(null);
        if (onImportSuccess) onImportSuccess();
      }
    } catch {
      setErrors([{ row: 0, error: 'Network error communicating with server.' }]);
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvContent =
      'batchNo,apiName,brandName,uniqueProductCode,batchSize,mfgDate,expDate,expiryNote,shippingContainerCode,mfgLicenseNo,storageConditions,authority\n' +
      'BL-2024-0301,Arnica Montana Ø,Arnica Montana Q,UPC-HOM-ARN-001,450 Litres,2024-05-01,2029-04-30,5 years from mfg,SSCC-0890123456789012,HL-792 M,Store protected from sunlight below 25C,GNCT DELHI\n' +
      'BL-2024-0302,Alfalfa Ø + Ginseng Ø,Alfalfa Tonic,UPC-HOM-ALF-003,1000 Litres,2024-05-10,2027-05-09,3 years from mfg,SSCC-0890123456789029,HL-792 M,Store in cool place,WB AYUSH\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'phbl_batch_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-md border border-[rgba(18,21,15,0.08)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(18,21,15,0.08)]">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#12150F]">
            Bulk Regulatory Batch CSV Importer
          </h3>
          <p className="text-xs text-[#595C54]">
            Upload multiple batch records in tens. Validate statutory fields prior to database commit.
          </p>
        </div>
        <button
          onClick={downloadSampleCsv}
          className="text-xs text-[#1F4D3A] font-semibold hover:underline flex items-center gap-1 shrink-0"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Row-by-Row Error Report */}
      {errors.length > 0 && (
        <div className="p-4 rounded bg-rose-50 border border-rose-200 space-y-2 text-xs text-rose-800">
          <div className="flex items-center gap-1.5 font-bold text-rose-900">
            <AlertCircle className="w-4 h-4" />
            <span>Validation Errors ({errors.length} detected) — Import Aborted:</span>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1 font-mono text-[11px] bg-white/70 p-2 rounded">
            {errors.map((err, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="font-bold shrink-0">Row {err.row}:</span>
                {err.batchNo && <span className="font-bold shrink-0">[{err.batchNo}]</span>}
                <span>{err.error}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-rose-700">
            Fix the indicated columns in your CSV and re-upload. No batches were written to database.
          </p>
        </div>
      )}

      {/* File Upload Drop Zone */}
      <div className="border-2 border-dashed border-[rgba(18,21,15,0.15)] rounded-md p-6 text-center space-y-2 hover:border-[#1F4D3A] transition-colors">
        <Upload className="w-6 h-6 text-[#1F4D3A] mx-auto" />
        <div className="text-xs text-[#595C54]">
          <label className="font-semibold text-[#1F4D3A] hover:underline cursor-pointer">
            <span>Choose CSV File</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>{' '}
          or drag and drop batch records here
        </div>
        {file && (
          <div className="font-mono text-xs text-[#12150F] font-semibold mt-2">
            Selected: {file.name} ({parsedRows.length} rows detected)
          </div>
        )}
      </div>

      {parsedRows.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-mono text-[#595C54]">
            Ready to validate & commit <strong>{parsedRows.length}</strong> batches
          </span>
          <Button
            onClick={handleCommitImport}
            disabled={importing}
            variant="primary"
            size="md"
            className="gap-2"
          >
            {importing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Validating & Committing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Validate & Commit All Rows</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
