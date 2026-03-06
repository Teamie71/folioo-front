import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '약관 동의 - Folioo',
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
