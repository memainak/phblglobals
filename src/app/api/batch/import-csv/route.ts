import { NextRequest, NextResponse } from 'next/server';
import { batchCsvRowSchema } from '@/lib/validators';
import { saveBatchBulk } from '@/lib/queries';
import { Batch } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { rows } = await req.json();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: 'No CSV rows provided' },
        { status: 400 }
      );
    }

    const rowErrors: { row: number; batchNo?: string; error: string }[] = [];
    const validBatches: Batch[] = [];

    rows.forEach((rawRow: unknown, index: number) => {
      const rowNumber = index + 1;
      const parse = batchCsvRowSchema.safeParse(rawRow);

      if (!parse.success) {
        const errorMsg = parse.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
        rowErrors.push({
          row: rowNumber,
          batchNo: (rawRow as { batchNo?: string })?.batchNo,
          error: errorMsg,
        });
      } else {
        const d = parse.data;
        validBatches.push({
          id: `batch-${Date.now()}-${index}`,
          batchNo: d.batchNo.trim().toUpperCase(),
          apiName: d.apiName,
          brandName: d.brandName,
          uniqueProductCode: d.uniqueProductCode,
          manufacturerName: 'Purusottam Homoeo Bikash Laboratory (Bonded)',
          manufacturerAddress: 'L/3, Saratpally, Paschim Medinipur, Pin 721101, West Bengal, India',
          batchSize: d.batchSize,
          mfgDate: d.mfgDate,
          expDate: d.expDate || null,
          expiryNote: d.expiryNote,
          shippingContainerCode: d.shippingContainerCode || 'N.A.',
          mfgLicenseNo: d.mfgLicenseNo || 'HL-792 M',
          storageConditions: d.storageConditions || 'Store in a cool, dry place protected from light and moisture',
          authority: d.authority,
          published: true,
        });
      }
    });

    // If errors were found, return the row-by-row error report before committing
    if (rowErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          errorCount: rowErrors.length,
          validCount: validBatches.length,
          errors: rowErrors,
        },
        { status: 422 }
      );
    }

    // All rows valid: commit bulk
    const result = await saveBatchBulk(validBatches);

    return NextResponse.json(
      {
        success: true,
        importedCount: result.added,
        message: `Successfully imported ${result.added} batch records into the regulatory registry.`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('API /api/batch/import-csv error:', err);
    return NextResponse.json(
      { error: 'Failed to process bulk CSV import' },
      { status: 500 }
    );
  }
}
