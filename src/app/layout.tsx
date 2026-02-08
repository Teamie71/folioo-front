import '../styles/globals.css';
import localFont from 'next/font/local';
import NavbarWrapper from '@/components/NavbarHideWrapper';

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
        <NavbarWrapper>{children}</NavbarWrapper>
      </body>
    </html>
  );
}
