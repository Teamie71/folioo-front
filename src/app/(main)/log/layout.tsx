import type { Metadata } from 'next';
import { SITE_URL } from '@/constants/seo';

export const metadata: Metadata = {
  title: '스쳐 지나가는 작은 인사이트, 나를 증명하는 스토리로 - Folioo',
  description:
    '나의 인사이트를 체계적으로 기록하고, 채용 사이클 전체에서 활용 가능한 핵심 자산을 확보하세요.',
  openGraph: {
    title: '인사이트 로그 - Folioo',
    description:
      '나의 인사이트를 체계적으로 기록하고, 채용 사이클 전체에서 활용 가능한 핵심 자산을 확보하세요.',
    url: `${SITE_URL}/log`,
    siteName: 'Folioo',
    images: ['/OgImage.svg'],
    locale: 'ko_KR',
  },
};

export default function LogLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
