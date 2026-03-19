import { headers } from 'next/headers';
import TopupClient from './TopupClient';
import TopupClientMobile from './TopupClientMobile';
import { isTopupMobileUserAgent } from '@/utils/device';

export default async function TopupPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  const isMobile = isTopupMobileUserAgent(userAgent);

  if (isMobile) {
    return <TopupClientMobile />;
  }

  return <TopupClient />;
}
