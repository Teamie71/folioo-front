import type { Metadata } from 'next';
import { SITE_URL } from '@/constants/seo';
import LandingClient from './LandingClient';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '당신의 모든 경험을 무한한 취업 경쟁력으로, Folioo',
  description:
    '인사이트 기록부터 AI 컨설턴트와의 쉽고 체계적인 경험 정리, 지원 맞춤 포트폴리오 첨삭까지. Folioo와 함께 나의 경쟁력을 발굴하세요.',
  openGraph: {
    title: '체계적인 AI 경험 정리, 맞춤 포트폴리오 첨삭까지, Folioo',
    description: 'Folioo와 함께 나의 경쟁력을 발굴하세요.',
    url: SITE_URL,
    siteName: 'Folioo',
    images: ['/OGImage.svg'],
    locale: 'ko_KR',
  },
  verification: {
    google: 'zx2xS9zkEKvDTaSxdyddrJI-0z7XyJHLogZ59erqQm4',
    other: {
      'naver-site-verification': '838193402b08d72203dba9cc1832023167e854b0',
    },
  },
};

export default function LandingPage() {
  return <LandingClient />;
}
