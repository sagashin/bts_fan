import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Borahae Archive — パーソナル推し活手帳',
    short_name: 'Borahae',
    description: '毎日を紫に彩る、あなただけのプライベート推し活＆癒やし手帳アプリ。',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#FAF7FF',
    theme_color: '#6D28D9',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
