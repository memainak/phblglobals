import type { Metadata } from 'next';
import { Source_Serif_4, Inter } from 'next/font/google';
import './globals.css';

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
  weight: ['400', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Purusottam Homeo Bikash Lab(Bonded)',
    default: 'Purusottam Homeo Bikash Lab(Bonded) | PHBL',
  },
  description:
    'Licensed Bonded Homoeopathic & Ayurvedic Pharmaceutical Manufacturer (Mfg Lic. HL-792 M) Estd. 2003. ISO 9001:2015, GMP, HACCP certified facility with public batch traceability.',
  metadataBase: new URL('https://phblglobals.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'PHBL Globals',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#12150F]">
        {children}
      </body>
    </html>
  );
}
