import type { Metadata } from 'next';
import { SITE_URL } from '@/constants/seo';

export const metadata: Metadata = {
  title: '직무 찾기 - Folioo',
  description:
    '전공, 흥미, 선호 조건으로 3분 만에 알아보는 나에게 딱 맞는 직무 찾기 테스트.',
  openGraph: {
    title: '직무 찾기 - Folioo',
    description:
      '전공, 흥미, 선호 조건으로 3분 만에 알아보는 나에게 딱 맞는 직무 찾기 테스트.',
    url: `${SITE_URL}/recommendation`,
    siteName: 'Folioo',
    images: ['/OGImage.svg'],
    locale: 'ko_KR',
  },
};

export default function RecommendationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
