import type { Metadata } from 'next';
import { SITE_URL } from '@/constants/seo';

export const metadata: Metadata = {
  title: '인사이트 로그 - Folioo',
  description:
    '나의 인사이트를 체계적으로 기록하고, 채용 사이클 전체에서 활용 가능한 핵심 자산을 확보하세요.',
  openGraph: {
    title: '인사이트 로그 - Folioo',
    description:
      '나의 인사이트를 체계적으로 기록하고, 채용 사이클 전체에서 활용 가능한 핵심 자산을 확보하세요.',
    url: `${SITE_URL}/log`,
    siteName: 'Folioo',
    images: ['/OGImage.svg'],
    locale: 'ko_KR',
  },
};

export default function LogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
