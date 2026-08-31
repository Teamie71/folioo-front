import { headers } from 'next/headers';
import { RecommendationWaiting } from '@/features/recommendation/components/RecommendationWaiting';
import { RecommendationWaitingMobile } from '@/features/recommendation/components/mobile/RecommendationWaitingMobile';
import { RecommendationPageMobileGate } from '@/features/recommendation/components/RecommendationPageMobileGate';
import { isTopupMobileUserAgent } from '@/utils/device';

export default async function RecommendationWaitingPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = isTopupMobileUserAgent(userAgent);

  return (
    <RecommendationPageMobileGate
      serverMobile={isMobile}
      mobile={<RecommendationWaitingMobile />}
      desktop={<RecommendationWaiting />}
    />
  );
}
