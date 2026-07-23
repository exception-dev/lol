import type { Metadata, Viewport } from 'next';

import { AppProviders } from '@/app/providers/AppProviders';
import ko from '@/core/i18n/locales/ko.json';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: ko.app.name,
    template: `%s | ${ko.app.name}`,
  },
  description: ko.app.description,
  applicationName: ko.app.name,
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#181818',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AppProviders>
          <main className="app-shell">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
