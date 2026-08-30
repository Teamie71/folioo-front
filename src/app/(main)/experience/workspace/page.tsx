import { headers } from 'next/headers';
import ExperienceWorkspaceClient from '@/features/experience/workspace/ExperienceWorkspaceClient';
import ExperienceListClientMobile from '@/features/experience/list/components/mobile/ExperienceListClientMobile';
import { isMobileLayoutUserAgent } from '@/utils/device';

export default async function ExperienceWorkspacePage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  // proxy의 view 정규화와 반드시 같은 기준을 써야 URL과 실제 뷰가 어긋나지 않는다.
  const isMobile = isMobileLayoutUserAgent(userAgent);

  if (isMobile) {
    return <ExperienceListClientMobile />;
  }

  return <ExperienceWorkspaceClient />;
}
