import type { Metadata } from 'next';
import { LoginRequiredRouteGuard } from '@/components/LoginRequiredRouteGuard';

export const metadata: Metadata = {
  title: '포트폴리오 첨삭 - Folioo',
};

export default function CorrectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoginRequiredRouteGuard>{children}</LoginRequiredRouteGuard>
  );
}
