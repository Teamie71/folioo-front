import { headers } from 'next/headers';
import { RecommendationInterestStep } from '@/features/recommendation/components/RecommendationInterestStep';
import { RecommendationInterestStepMobile } from '@/features/recommendation/components/mobile/RecommendationInterestStepMobile';
import { RecommendationPageMobileGate } from '@/features/recommendation/components/RecommendationPageMobileGate';
import { RecommendationStepGate } from '@/features/recommendation/components/RecommendationStepGate';
import { isTopupMobileUserAgent } from '@/utils/device';

export default async function RecommendationInterestPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = isTopupMobileUserAgent(userAgent);

  return (
    <RecommendationStepGate step='interest'>
      <RecommendationPageMobileGate
        serverMobile={isMobile}
        mobile={<RecommendationInterestStepMobile />}
        desktop={<RecommendationInterestStep />}
      />
    </RecommendationStepGate>
  );
}
