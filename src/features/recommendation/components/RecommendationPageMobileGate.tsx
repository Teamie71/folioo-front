'use client';

import type { ReactNode } from 'react';

interface RecommendationPageMobileGateProps {
  serverMobile: boolean;
  mobile: ReactNode;
  desktop: ReactNode;
}

export function RecommendationPageMobileGate({
  serverMobile,
  mobile,
  desktop,
}: RecommendationPageMobileGateProps) {
  if (serverMobile) {
    return mobile;
  }

  return desktop;
}
