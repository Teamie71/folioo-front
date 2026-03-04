import type { Metadata } from 'next';
import { SITE_URL } from '@/constants/seo';

export const metadata: Metadata = {
  title: '로그인 - Folioo',
  description:
    '지금 가입하고, AI 컨설턴트와 함께 무료로 합격 준비를 시작하세요!',
  openGraph: {
    title: 'Folioo 시작하기',
    description:
      '지금 가입하고, AI 컨설턴트와 함께 무료로 합격 준비를 시작하세요!',
    url: `${SITE_URL}/login`,
    siteName: 'Folioo',
    images: ['/OgImage.svg'],
    locale: 'ko_KR',
  },
};

export default function LoginLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
