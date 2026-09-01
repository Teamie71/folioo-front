import type { Metadata } from 'next';
import { LoginRequiredRouteGuard } from '@/components/LoginRequiredRouteGuard';

export const metadata: Metadata = {
  title: '새로운 경험 정리 - Folioo',
};

/* 새로운 경험 정리(AI 대화)는 로그인해야 쓸 수 있다. */
export default function ExperienceSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LoginRequiredRouteGuard>{children}</LoginRequiredRouteGuard>;
}
