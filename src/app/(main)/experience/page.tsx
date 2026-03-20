import { headers } from 'next/headers';
import ExperienceClient from './ExperienceClient';
import ExperienceClientMobile from './ExperienceClientMobile';
import { isTopupMobileUserAgent } from '@/utils/device';

export default async function ExperiencePage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  const isMobile = isTopupMobileUserAgent(userAgent);

  if (isMobile) {
    return <ExperienceClientMobile />;
  }

  return <ExperienceClient />;
}
