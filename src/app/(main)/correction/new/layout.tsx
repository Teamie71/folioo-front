import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '새로운 포트폴리오 첨삭 - Folioo',
};

export default function CorrectionNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
