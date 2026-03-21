import { headers } from 'next/headers';
import NotFoundClient from './NotFoundClient';
import NotFoundClientMobile from './NotFoundClientMobile';
import { isTopupMobileUserAgent } from '@/utils/device';

export default async function NotFound() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = isTopupMobileUserAgent(userAgent);

  if (isMobile) {
    return <NotFoundClientMobile />;
  }

  return <NotFoundClient isMobileDevice={isMobile} />;
}
