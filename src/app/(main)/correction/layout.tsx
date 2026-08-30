import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '포트폴리오 첨삭 - Folioo',
};

export default function CorrectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
