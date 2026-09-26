import { LoginRequiredRouteGuard } from '@/components/LoginRequiredRouteGuard';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LoginRequiredRouteGuard>{children}</LoginRequiredRouteGuard>;
}
