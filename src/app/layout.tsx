import type { Metadata } from 'next';
import Script from 'next/script';
import '../styles/globals.css';
import localFont from 'next/font/local';
import { GoogleAnalyticsPageView } from '@/components/GoogleAnalyticsPageView';
import { AuthProvider } from '@/contexts/AuthProvider';
import { QueryProvider } from '@/contexts/QueryProvider';
import { SITE_URL } from '@/constants/seo';

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID ?? 'G-ZSXFDE6Q13';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Folioo',
  icons: {
    icon: [{ url: '/FaviconWeb.svg', type: 'image/svg+xml' }],
  },
};

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bannerScript = `
    (function(){
      try {
        if (sessionStorage.getItem('bannerBetaDismissed') === 'true') {
          document.body.dataset.bannerDismissed = 'true';
        }
      } catch (e) {}
    })();
  `;

  const gtagInitScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}');
  `;

  return (
    <html lang='ko' className={pretendard.className}>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy='beforeInteractive'
        />
        <Script id='gtag-init' strategy='beforeInteractive'>
          {gtagInitScript}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{ __html: bannerScript }}
          suppressHydrationWarning
        />
        <QueryProvider>
          <AuthProvider>
            {children}
            <GoogleAnalyticsPageView />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
