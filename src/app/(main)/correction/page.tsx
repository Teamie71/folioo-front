import { headers } from 'next/headers';
import CorrectionClient from './CorrectionClient';
import CorrectionClientMobile from './CorrectionClientMobile';

export default async function CorrectionPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  const isMobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
    userAgent
  );

  if (isMobile) {
    return <CorrectionClientMobile />;
  }

  return <CorrectionClient />;
}
