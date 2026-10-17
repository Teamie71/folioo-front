import { test as base, expect } from '@playwright/test';

/**
 * 모든 테스트에 공통으로 적용하는 설정.
 * - 테스트 실행이 실제 GA 통계에 섞이지 않도록 분석 요청을 막는다.
 */
export const test = base.extend<{ blockAnalytics: void }>({
  blockAnalytics: [
    async ({ page }, use) => {
      await page.route(
        /googletagmanager\.com|google-analytics\.com/,
        (route) => route.abort(),
      );
      await use();
    },
    { auto: true },
  ],
});

export { expect };
