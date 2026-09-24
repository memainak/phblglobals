/**
 * Biochemic tablets announced as upcoming on the PHBL range sheet
 * ("Our Upcoming Bio-Chemic Tablet"). These are not yet on the price list, so
 * no MRP is published for them. Names are kept as printed on the sheet.
 */

export interface UpcomingBiochemic {
  name: string;
  potencies: string | null;
}

export const BIOCHEMIC_UPCOMING: UpcomingBiochemic[] = [
  { name: 'Ferrum Phosphoricum', potencies: '3x, 6x, 12x, 30x' },
  { name: 'Natrum', potencies: '3x, 6x, 12x, 30x' },
  { name: 'Calcarea Fluorica', potencies: '3x, 6x, 12x, 30x' },
  { name: 'Kali Muriaticum', potencies: '3x, 6x, 12x, 30x' },
  { name: 'Natrum Muriaticum', potencies: '3x, 6x, 12x, 30x' },
  { name: 'Kali Phosphoricum', potencies: '3x, 6x, 12x, 30x' },
  { name: 'Kali Sulphuricum', potencies: '3x, 6x, 12x, 30x' },
  { name: 'Silicea', potencies: '3x, 6x, 12x, 30x' },
  { name: 'Calcarea Phosphorica', potencies: '3x, 6x, 12x, 30x' },
  { name: 'Natrum Sulph', potencies: '3x, 6x, 12x, 30x' },
  { name: 'Calcarea Sulphurica', potencies: '3x, 6x, 12x, 30x' },
  { name: 'Magnesium Phosphoricum', potencies: null },
];
