import { headers } from 'next/headers';
import { RecommendationResult } from '@/features/recommendation/components/RecommendationResult';
import { RecommendationResultMobile } from '@/features/recommendation/components/mobile/RecommendationResultMobile';
import { RecommendationPageMobileGate } from '@/features/recommendation/components/RecommendationPageMobileGate';
import { isTopupMobileUserAgent } from '@/utils/device';

export default async function RecommendationResultPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = isTopupMobileUserAgent(userAgent);

  return (
    <RecommendationPageMobileGate
      serverMobile={isMobile}
      mobile={<RecommendationResultMobile variant='result' />}
      desktop={<RecommendationResult variant='result' />}
    />
  );
}
