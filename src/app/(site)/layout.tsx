import React from 'react';
import { AnnouncementBar } from '@/components/site/AnnouncementBar';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { WhatsAppButton } from '@/components/site/WhatsAppButton';
import { ChatbotWidget } from '@/components/site/ChatbotWidget';
import { TubesGateway } from '@/components/site/TubesGateway';
import { getSiteSettings } from '@/lib/queries';

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#12150F] relative">
      {/* 3D Tubes Interactive Gateway Screen (Appears first, transitions to main site upon clicking) */}
      <TubesGateway />

      {settings.announcementBar.enabled && (
        <AnnouncementBar
          tollFree={settings.tollFreePhone}
          email={settings.email}
        />
      )}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Floating Interactive Assistants */}
      <ChatbotWidget />
      <WhatsAppButton />
    </div>
  );
}
