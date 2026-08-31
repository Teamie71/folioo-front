import { headers } from 'next/headers';
import { RecommendationValuesStep } from '@/features/recommendation/components/RecommendationValuesStep';
import { RecommendationValuesStepMobile } from '@/features/recommendation/components/mobile/RecommendationValuesStepMobile';
import { RecommendationPageMobileGate } from '@/features/recommendation/components/RecommendationPageMobileGate';
import { isTopupMobileUserAgent } from '@/utils/device';

export default async function RecommendationValuesPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = isTopupMobileUserAgent(userAgent);

  return (
    <RecommendationPageMobileGate
      serverMobile={isMobile}
      mobile={<RecommendationValuesStepMobile />}
      desktop={<RecommendationValuesStep />}
    />
  );
}
