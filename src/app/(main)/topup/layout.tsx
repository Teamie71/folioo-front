import type { Metadata } from 'next';
import { SITE_URL } from '@/constants/seo';

export const metadata: Metadata = {
  title: '이용권 구매 - Folioo',
  description:
    '이벤트로 받는 무료 이용권부터 1회권, 다회권까지. 나에게 딱 필요한 횟수만 구매해서 사용해보세요.',
  openGraph: {
    title: '이용권 구매 - Folioo',
    description:
      '이벤트로 받는 무료 이용권부터 1회권, 다회권까지. 나에게 딱 필요한 횟수만 구매해서 사용해보세요.',
    url: `${SITE_URL}/topup`,
    siteName: 'Folioo',
    images: ['/OGImage.svg'],
    locale: 'ko_KR',
  },
};

export default function TopupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
