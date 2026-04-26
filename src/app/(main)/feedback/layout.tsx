import { LoginRequiredRouteGuard } from '@/components/LoginRequiredRouteGuard';

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LoginRequiredRouteGuard>{children}</LoginRequiredRouteGuard>;
}
