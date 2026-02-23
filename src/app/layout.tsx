import '../styles/globals.css';
import localFont from 'next/font/local';
import { AuthProvider } from '@/contexts/AuthProvider';
import { QueryProvider } from '@/contexts/QueryProvider';

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

  return (
    <html lang='ko' className={pretendard.className}>
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{ __html: bannerScript }}
          suppressHydrationWarning
        />
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
