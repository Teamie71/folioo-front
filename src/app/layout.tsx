import '../styles/globals.css';
import localFont from 'next/font/local';
import LayoutContent from '@/components/LayoutContent';

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
  return (
    <html lang='ko' className={pretendard.className}>
      <body>
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
