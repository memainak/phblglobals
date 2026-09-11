import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'public', 'images', 'products');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const products = [
  {
    filename: 'arnica-q.svg',
    title: 'Arnica Montana',
    potency: 'MOTHER TINCTURE (Q)',
    category: 'HOMOEOPATHY',
    color: '#1F4D3A',
    accent: '#C5A880',
    type: 'amber',
  },
  {
    filename: 'berberis-q.svg',
    title: 'Berberis Aqui.',
    potency: 'MOTHER TINCTURE (Q)',
    category: 'HOMOEOPATHY',
    color: '#1F4D3A',
    accent: '#C5A880',
    type: 'amber',
  },
  {
    filename: 'alfalfa-tonic.svg',
    title: 'Alfalfa Tonic',
    potency: 'WITH GINSENG',
    category: 'HOMOEOPATHY',
    color: '#8D5B18',
    accent: '#E5C07B',
    type: 'amber-large',
  },
  {
    filename: 'liv-bikash.svg',
    title: 'Liv-Bikash',
    potency: 'LIVER SYRUP',
    category: 'HOMOEOPATHY',
    color: '#2A5A3B',
    accent: '#83E0A2',
    type: 'amber-large',
  },
  {
    filename: 'cough-sol.svg',
    title: 'Cough-Sol',
    potency: 'EXPECTORANT',
    category: 'HOMOEOPATHY',
    color: '#9C3425',
    accent: '#F3A69C',
    type: 'amber-large',
  },
  {
    filename: 'cardo-care.svg',
    title: 'Cardo-Care',
    potency: 'CLINICAL DROPS',
    category: 'HOMOEOPATHY',
    color: '#A82B2B',
    accent: '#FCA5A5',
    type: 'dropper',
  },
  {
    filename: 'rheuma-relief.svg',
    title: 'Rheuma-Relief',
    potency: 'PAIN CARE DROPS',
    category: 'HOMOEOPATHY',
    color: '#34495E',
    accent: '#93C5FD',
    type: 'dropper',
  },
  {
    filename: 'five-phos.svg',
    title: 'Five Phos 6X',
    potency: 'BIOCHEMIC TABLETS',
    category: 'HOMOEOPATHY',
    color: '#1E3A8A',
    accent: '#BFDBFE',
    type: 'tablet-container',
  },
  {
    filename: 'protectin.svg',
    title: 'Protectin',
    potency: 'HERBAL SANITIZER',
    category: 'COSMETICS',
    color: '#0D9488',
    accent: '#5EEAD4',
    type: 'pump',
  },
  {
    filename: 'puro-oil.svg',
    title: 'Puro Herbal',
    potency: 'BODY OIL',
    category: 'COSMETICS',
    color: '#B45309',
    accent: '#FDE68A',
    type: 'cosmetic-bottle',
  },
  {
    filename: 'vet-mastitis.svg',
    title: 'Vet Mastitis',
    potency: 'VETERINARY DROPS',
    category: 'HOMOEOVET',
    color: '#15803D',
    accent: '#86EFAC',
    type: 'vet-bottle',
  },
  {
    filename: 'vet-lacto.svg',
    title: 'Vet Lacto-Gen',
    potency: 'LIQUID ANIMAL CARE',
    category: 'HOMOEOVET',
    color: '#0369A1',
    accent: '#7DD3FC',
    type: 'vet-bottle',
  },
];

for (const p of products) {
  const isTablet = p.type === 'tablet-container';
  const isAmber = p.type.startsWith('amber') || p.type === 'dropper';
  const bottleBg = isTablet
    ? 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)'
    : 'linear-gradient(180deg, #3D220F 0%, #201208 50%, #120A04 100%)';
  const strokeColor = isTablet ? '#CBD5E1' : '#5C381E';

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="glass-${p.filename}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${isTablet ? '#E2E8F0' : '#2A170A'}" />
      <stop offset="35%" stop-color="${isTablet ? '#FFFFFF' : '#4E2C14'}" />
      <stop offset="70%" stop-color="${isTablet ? '#F1F5F9' : '#331B0C'}" />
      <stop offset="100%" stop-color="${isTablet ? '#CBD5E1' : '#170B04'}" />
    </linearGradient>
    <linearGradient id="cap-${p.filename}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#E2E8F0" />
      <stop offset="50%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#94A3B8" />
    </linearGradient>
    <filter id="shadow-${p.filename}" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Ground reflection / shadow -->
  <ellipse cx="200" cy="455" rx="100" ry="16" fill="#000000" fill-opacity="0.25" />

  <!-- Bottle Body Group -->
  <g filter="url(#shadow-${p.filename})">
    <!-- Cap Neck -->
    <rect x="180" y="55" width="40" height="24" rx="3" fill="url(#cap-${p.filename})" stroke="#94A3B8" stroke-width="1.5" />
    <rect x="175" y="76" width="50" height="12" rx="2" fill="url(#glass-${p.filename})" stroke="${strokeColor}" stroke-width="1.5" />

    <!-- Main Bottle Body -->
    <path d="M 175 88 C 160 110, 130 120, 130 150 L 130 425 C 130 440, 142 448, 155 448 L 245 448 C 258 448, 270 440, 270 425 L 270 150 C 270 120, 240 110, 225 88 Z"
      fill="url(#glass-${p.filename})" stroke="${strokeColor}" stroke-width="2" />

    <!-- Glass Highlights -->
    <path d="M 142 160 L 142 420" stroke="#FFFFFF" stroke-opacity="${isTablet ? '0.6' : '0.15'}" stroke-width="5" stroke-linecap="round" />
    <path d="M 150 160 L 150 420" stroke="#FFFFFF" stroke-opacity="${isTablet ? '0.4' : '0.08'}" stroke-width="2" stroke-linecap="round" />

    <!-- Product Label -->
    <rect x="145" y="165" width="110" height="235" rx="5" fill="#FAFAF8" stroke="#D1D5DB" stroke-width="1" />

    <!-- Label Brand Header -->
    <rect x="145" y="165" width="110" height="42" rx="5" fill="${p.color}" />
    <rect x="145" y="202" width="110" height="5" fill="${p.accent}" />

    <text x="200" y="184" font-family="Arial, sans-serif" font-weight="900" font-size="11" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">PHBL BONDED</text>
    <text x="200" y="197" font-family="Arial, sans-serif" font-weight="600" font-size="7" fill="#E2E8F0" text-anchor="middle" letter-spacing="0.5">ESTD. 2003 · HL-792 M</text>

    <!-- Product Title & Details -->
    <text x="200" y="238" font-family="Georgia, serif" font-weight="bold" font-size="14" fill="#111827" text-anchor="middle">${p.title}</text>
    <rect x="165" y="248" width="70" height="1" fill="${p.color}" fill-opacity="0.3" />

    <text x="200" y="266" font-family="Arial, sans-serif" font-weight="bold" font-size="8" fill="${p.color}" text-anchor="middle" letter-spacing="0.5">${p.potency}</text>
    <text x="200" y="280" font-family="Arial, sans-serif" font-weight="bold" font-size="6" fill="#6B7280" text-anchor="middle" letter-spacing="1">${p.category}</text>

    <!-- Botanical / Lab Crest -->
    <circle cx="200" cy="312" r="15" fill="#F3F4F6" stroke="${p.color}" stroke-width="1" />
    <text x="200" y="316" font-family="Georgia, serif" font-weight="bold" font-size="11" fill="${p.color}" text-anchor="middle">℞</text>

    <text x="200" y="342" font-family="Arial, sans-serif" font-size="6" fill="#4B5563" text-anchor="middle">Standard HPI Quality</text>
    <text x="200" y="352" font-family="Arial, sans-serif" font-size="5.5" fill="#9CA3AF" text-anchor="middle">Extra Neutral Alcohol Base</text>

    <!-- Label Footer -->
    <rect x="145" y="375" width="110" height="25" fill="#F3F4F6" />
    <text x="200" y="386" font-family="Arial, sans-serif" font-weight="bold" font-size="6" fill="#1F2937" text-anchor="middle">GMP &amp; ISO 9001 CERTIFIED</text>
    <text x="200" y="394" font-family="Arial, sans-serif" font-size="5" fill="#6B7280" text-anchor="middle">Paschim Medinipur, WB</text>
  </g>
</svg>`;

  fs.writeFileSync(path.join(outDir, p.filename), svg);

  // Also write .webp fallback pointing to same vector / visual
  const baseName = p.filename.replace('.svg', '');
  fs.writeFileSync(path.join(outDir, `${baseName}.webp`), svg);
}

// Write default bottle
const defaultSvg = fs.readFileSync(path.join(outDir, 'arnica-q.svg'), 'utf8');
fs.writeFileSync(path.join(outDir, 'bottle-default.svg'), defaultSvg);
fs.writeFileSync(path.join(outDir, 'bottle-default.webp'), defaultSvg);

console.log(`Generated ${products.length} product images in ${outDir}`);
