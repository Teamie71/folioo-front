import { test, expect } from './support/test';
import { mockGuest } from './support/api';

test('랜딩 페이지가 열린다', { tag: '@smoke' }, async ({ page }) => {
  await mockGuest(page);
  await page.goto('/');

  await expect(page).toHaveTitle(/Folioo/);
});
