import { LoginRequiredRouteGuard } from '@/components/LoginRequiredRouteGuard';

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoginRequiredRouteGuard>{children}</LoginRequiredRouteGuard>
  );
}
