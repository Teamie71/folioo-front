import { headers } from 'next/headers';
import { RecommendationMajorStep } from '@/features/recommendation/components/RecommendationMajorStep';
import { RecommendationMajorStepMobile } from '@/features/recommendation/components/mobile/RecommendationMajorStepMobile';
import { RecommendationPageMobileGate } from '@/features/recommendation/components/RecommendationPageMobileGate';
import { isTopupMobileUserAgent } from '@/utils/device';

export default async function RecommendationMajorPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = isTopupMobileUserAgent(userAgent);

  return (
    <RecommendationPageMobileGate
      serverMobile={isMobile}
      mobile={<RecommendationMajorStepMobile />}
      desktop={<RecommendationMajorStep />}
    />
  );
}
