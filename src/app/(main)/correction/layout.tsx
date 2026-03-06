import { LoginRequiredRouteGuard } from '@/components/LoginRequiredRouteGuard';

export default function CorrectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoginRequiredRouteGuard>{children}</LoginRequiredRouteGuard>
  );
}
