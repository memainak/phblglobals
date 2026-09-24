/**
 * PHBL dilutions catalogue.
 *
 * `DILUTION_PRICING` comes from the 2026-27 MRP price list.
 * `DILUTION_REMEDIES` is transcribed from the printed DILUTIONS catalogue sheets
 * (SL 1-568) and should be proof-read against the original before going to print.
 */

export const DILUTION_POTENCIES = '3, 6, 12, 30, 3X, 200, 1M, 10M, 50M, CM';

export const DILUTION_COMBO_NOTE =
  'Now available in combo (4 x 100). 100 ml pack in 6, 30, 200 and 1M. 10M, 50M and CM in 30 ml and 10 ml.';

export interface DilutionPriceRow {
  potency: string;
  packs: { size: string; mrp: number }[];
}

export const DILUTION_PRICING: DilutionPriceRow[] = [
  {
    potency: '3 – 30',
    packs: [
      { size: '10 ml', mrp: 45 },
      { size: '30 ml', mrp: 90 },
      { size: '100 ml', mrp: 175 },
      { size: '450 ml', mrp: 495 },
    ],
  },
  {
    potency: '200',
    packs: [
      { size: '10 ml', mrp: 51 },
      { size: '30 ml', mrp: 101 },
      { size: '100 ml', mrp: 186 },
      { size: '450 ml', mrp: 522 },
    ],
  },
  {
    potency: '1M',
    packs: [
      { size: '10 ml', mrp: 56 },
      { size: '30 ml', mrp: 124 },
      { size: '100 ml', mrp: 202 },
      { size: '450 ml', mrp: 568 },
    ],
  },
  {
    potency: '10M',
    packs: [
      { size: '10 ml', mrp: 113 },
      { size: '30 ml', mrp: 242 },
      { size: '100 ml', mrp: 366 },
      { size: '450 ml', mrp: 619 },
    ],
  },
  {
    potency: '50M',
    packs: [
      { size: '10 ml', mrp: 141 },
      { size: '30 ml', mrp: 287 },
      { size: '100 ml', mrp: 443 },
      { size: '450 ml', mrp: 721 },
    ],
  },
  {
    potency: 'CM',
    packs: [
      { size: '10 ml', mrp: 152 },
      { size: '30 ml', mrp: 321 },
      { size: '100 ml', mrp: 569 },
      { size: '450 ml', mrp: 818 },
    ],
  },
];

export const DILUTION_REMEDIES: string[] = [];
