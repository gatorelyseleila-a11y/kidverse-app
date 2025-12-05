import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import { locales, type Locale } from '../../../i18n';
import '@/styles/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'KIDVERSE - Écosystème Intelligent de Garderie',
    template: '%s | KIDVERSE',
  },
  description: "La première plateforme SaaS complète de gestion de garderies, combinant pédagogie moderne, blockchain et intelligence artificielle.",
  keywords: ['garderie', 'daycare', 'gestion', 'enfants', 'éducation', 'SaaS', 'blockchain'],
  authors: [{ name: 'GALYLÉ Technologies Inc.' }],
  creator: 'GALYLÉ Technologies Inc.',
  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    alternateLocale: 'en_CA',
    url: 'https://kidverse.app',
    siteName: 'KIDVERSE',
    title: 'KIDVERSE - Écosystème Intelligent de Garderie',
    description: "L'univers intelligent qui grandit avec vos enfants",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KIDVERSE',
    description: "L'univers intelligent qui grandit avec vos enfants",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  
  // Valider le locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Charger les messages de traduction
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              {children}
              <Toaster />
            </NextIntlClientProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

