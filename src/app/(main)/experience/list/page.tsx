import { headers } from 'next/headers';
import ExperienceListClient from '@/features/experience/list/components/ExperienceListClient';
import ExperienceListClientMobile from '@/features/experience/list/components/mobile/ExperienceListClientMobile';
import { isTopupMobileUserAgent } from '@/utils/device';

export default async function ExperienceListPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = isTopupMobileUserAgent(userAgent);

  if (isMobile) {
    return <ExperienceListClientMobile />;
  }

  return <ExperienceListClient />;
}
