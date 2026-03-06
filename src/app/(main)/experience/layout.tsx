import type { Metadata } from 'next';
import { LoginRequiredRouteGuard } from '@/components/LoginRequiredRouteGuard';

export const metadata: Metadata = {
  title: '경험 정리 - Folioo',
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoginRequiredRouteGuard>{children}</LoginRequiredRouteGuard>
  );
}
