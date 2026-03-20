import { headers } from 'next/headers';
import NotFoundClient from './NotFoundClient';
import NotFoundClientMobile from './NotFoundClientMobile';

export default async function NotFound() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile =
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      userAgent,
    );

  if (isMobile) {
    return <NotFoundClientMobile />;
  }

  return <NotFoundClient />;
}
