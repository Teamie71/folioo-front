import { headers } from 'next/headers';
import { isTopupMobileUserAgent } from '@/utils/device';
import InvoiceRefundClient from './InvoiceRefundClient';

export default async function InvoiceRefundPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = isTopupMobileUserAgent(userAgent);

  return <InvoiceRefundClient isMobile={isMobile} />;
}
