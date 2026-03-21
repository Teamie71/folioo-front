import { headers } from 'next/headers';
import { isTopupMobileUserAgent } from '@/utils/device';
import InvoiceClient from './InvoiceClient';

export default async function InvoicePage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = isTopupMobileUserAgent(userAgent);

  return <InvoiceClient isMobile={isMobile} />;
}
