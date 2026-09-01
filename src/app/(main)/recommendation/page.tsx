import { headers } from 'next/headers';
import { RecommendationLanding } from '@/features/recommendation/components/RecommendationLanding';
import { RecommendationLandingMobile } from '@/features/recommendation/components/mobile/RecommendationLandingMobile';
import { RecommendationPageMobileGate } from '@/features/recommendation/components/RecommendationPageMobileGate';
import { isTopupMobileUserAgent } from '@/utils/device';

export default async function RecommendationPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = isTopupMobileUserAgent(userAgent);

  return (
    <RecommendationPageMobileGate
      serverMobile={isMobile}
      mobile={<RecommendationLandingMobile />}
      desktop={<RecommendationLanding />}
    />
  );
}
