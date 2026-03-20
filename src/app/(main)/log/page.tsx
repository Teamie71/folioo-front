import { headers } from 'next/headers';
import LogClient from './LogClient';
import LogClientMobile from './LogClientMobile';
import { isTopupMobileUserAgent } from '@/utils/device';

export default async function LogPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  const isMobile = isTopupMobileUserAgent(userAgent);

  if (isMobile) {
    return <LogClientMobile />;
  }

  return <LogClient />;
}
