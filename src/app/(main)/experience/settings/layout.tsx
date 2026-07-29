import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '새로운 경험 정리 - Folioo',
};

export default function ExperienceSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
