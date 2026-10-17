import { test, expect } from './support/test';
import { mockGuest } from './support/api';

const MAP_URL = '/experience/workspace?view=map';
const LOADING = { name: '맵 뷰를 불러오는 중' };

test.describe('경험 맵 - 게스트', { tag: '@smoke' }, () => {
  test.beforeEach(async ({ page }) => {
    await mockGuest(page);
    await page.goto(MAP_URL);
    await expect(page.getByRole('progressbar', LOADING)).toBeHidden();
  });

  test('기본 데이터와 로그인 안내가 보인다', async ({ page }) => {
    await expect(page.getByText('안전하게 보관해 보세요')).toBeVisible();
    await expect(page.getByText('새로운 그룹 1').first()).toBeVisible();
  });

  test('리스트 뷰로 전환된다', async ({ page }) => {
    const listTab = page.getByRole('tab', { name: '리스트 뷰' });
    await listTab.click();

    await expect(listTab).toHaveAttribute('aria-selected', 'true');
    await expect(page).toHaveURL(/view=list/);
  });
});
