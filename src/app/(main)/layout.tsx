import { headers } from 'next/headers';
import { isTopupMobileUserAgent } from '@/utils/device';
import LayoutContent from '@/components/LayoutContent';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = isTopupMobileUserAgent(userAgent);

  return <LayoutContent isMobileDevice={isMobile}>{children}</LayoutContent>;
}
