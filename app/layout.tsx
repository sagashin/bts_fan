import type { Metadata, Viewport } from 'next';
import { Noto_Sans_JP, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
});

export const viewport: Viewport = {
  themeColor: '#6D28D9',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Borahae Archive — パーソナル推し活手帳',
  description:
    'BTSとARMYのためのプライベート推し活Webアプリ。日替わり名言・記念日カウントダウン・気分別処方箋・推し活日記＆トレカコレクション管理。',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Borahae',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Borahae Archive — パーソナル推し活手帳',
    description:
      'BTSとARMYのためのプライベート推し活Webアプリ。日替わり名言・記念日カウントダウン・気分別処方箋・推し活日記＆トレカコレクション管理。',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Borahae Archive — パーソナル推し活手帳',
    description:
      'BTSとARMYのためのプライベート推し活Webアプリ。日替わり名言・記念日カウントダウン・気分別処方箋・推し活日記＆トレカコレクション管理。',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${plusJakarta.variable} ${notoSansJP.variable}`}
    >
      <body
        suppressHydrationWarning
        className="font-sans antialiased selection:bg-purple-200 selection:text-purple-950"
      >
        {children}
      </body>
    </html>
  );
}
