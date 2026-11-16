import AxeBuilder from '@axe-core/playwright';
import type { Page, TestInfo } from '@playwright/test';
import { test, expect } from './support/test';
import { mockGuest } from './support/api';

const REQUIRED_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const WARNING_TAGS = ['wcag22aa'];

async function checkA11y(page: Page, testInfo: TestInfo) {
  const required = await new AxeBuilder({ page })
    .withTags(REQUIRED_TAGS)
    .analyze();
  const warnings = await new AxeBuilder({ page })
    .withTags(WARNING_TAGS)
    .analyze();

  for (const v of warnings.violations) {
    testInfo.annotations.push({
      type: 'a11y-warning (WCAG 2.2)',
      description: `${v.id}: ${v.help} (${v.nodes.length}곳)`,
    });
  }

  await testInfo.attach('axe-violations.json', {
    body: JSON.stringify(required.violations, null, 2),
    contentType: 'application/json',
  });

  const summary = required.violations.map(
    (v) =>
      `${v.id} [${v.impact}] ${v.help}\n` +
      v.nodes.map((n) => `    - ${n.target.join(' ')}`).join('\n'),
  );
  expect(summary, 'WCAG 2.1 AA 위반').toEqual([]);
}

test.describe('접근성 (WCAG 2.1 AA)', { tag: '@full' }, () => {
  test.beforeEach(async ({ page }) => {
    await mockGuest(page);
  });

  test('랜딩 페이지', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await checkA11y(page, testInfo);
  });

  test('경험 맵 (게스트)', async ({ page }, testInfo) => {
    await page.goto('/experience/workspace?view=map');
    await expect(
      page.getByRole('progressbar', { name: '맵 뷰를 불러오는 중' }),
    ).toBeHidden();
    await checkA11y(page, testInfo);
  });
});
