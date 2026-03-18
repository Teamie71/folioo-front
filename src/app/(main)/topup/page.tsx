import { headers } from 'next/headers';
import TopupClient from './TopupClient';
import TopupClientMobile from './TopupClientMobile';

export default async function TopupPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  const isMobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
    userAgent
  );

  if (isMobile) {
    return <TopupClientMobile />;
  }

  return <TopupClient />;
}
