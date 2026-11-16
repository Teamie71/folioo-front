import { test, expect } from './support/test';
import { mockGuest, mockLoggedIn } from './support/api';
import { experienceMapEmpty } from './data/experienceMap';

const MAP_URL = '/experience/workspace?view=map';
const LOADING = { name: '맵 뷰를 불러오는 중' };

test.describe('경험 맵 - 실패 상황', { tag: '@full' }, () => {
  test('로그인 확인에 실패하면 게스트 모드로 기본 데이터가 보인다', async ({
    page,
  }) => {
    await mockGuest(page);
    await page.goto(MAP_URL);

    await expect(page.getByText('안전하게 보관해 보세요')).toBeVisible();
    await expect(page.getByText('새로운 그룹 1').first()).toBeVisible();
  });

  test('맵 조회에 실패해도 로딩 화면에 멈추지 않는다', async ({ page }) => {
    await mockLoggedIn(page, { map: 'error' });
    await page.goto(MAP_URL);

    await expect(page.getByRole('progressbar', LOADING)).toBeHidden();
  });

  test('블록 문구 목록 조회에 실패해도 맵이 열린다', async ({ page }) => {
    await mockLoggedIn(page, { templates: 'error' });
    await page.goto(MAP_URL);

    await expect(page.getByRole('progressbar', LOADING)).toBeHidden();
    await expect(page.getByText('미분류').first()).toBeVisible();
  });

  test('경험 데이터가 없으면 빈 상태로 열린다', async ({ page }) => {
    await mockLoggedIn(page, { map: experienceMapEmpty });
    await page.goto(MAP_URL);

    await expect(page.getByRole('progressbar', LOADING)).toBeHidden();
  });

  test('그룹 추가 저장에 실패하면 맵을 다시 불러와 되돌린다', async ({
    page,
  }) => {
    await mockLoggedIn(page);

    let mapRequests = 0;
    page.on('request', (req) => {
      if (req.method() === 'GET' && req.url().endsWith('/experience-map')) {
        mapRequests += 1;
      }
    });
    await page.route('**/experience-map/blocks', (route) =>
      route.fulfill({ status: 500, json: { isSuccess: false } }),
    );

    await page.goto(MAP_URL);
    await expect(page.getByRole('progressbar', LOADING)).toBeHidden();
    const loadedRequests = mapRequests;

    // 그룹 추가 버튼은 행에 마우스를 올려야 눌린다.
    await page.getByText('미분류').first().hover();
    await page.getByRole('button', { name: '그룹 추가' }).first().click();
    await expect(page.getByText(/새로운 그룹/).first()).toBeVisible();

    await expect.poll(() => mapRequests).toBeGreaterThan(loadedRequests);
    await expect(page.getByText(/새로운 그룹/)).toHaveCount(0);
  });

  test('그룹 추가 저장에 실패하면 저장 실패 안내가 보인다', async ({
    page,
  }) => {
    await mockLoggedIn(page);
    await page.route('**/experience-map/blocks', (route) =>
      route.fulfill({ status: 500, json: { isSuccess: false } }),
    );

    await page.goto(MAP_URL);
    await expect(page.getByRole('progressbar', LOADING)).toBeHidden();

    await page.getByText('미분류').first().hover();
    await page.getByRole('button', { name: '그룹 추가' }).first().click();

    await expect(
      page.getByRole('alert').filter({
        hasText: '변경 사항을 저장하지 못했습니다.',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: '편집 사본 다운로드' }),
    ).toBeVisible();
  });

  test('사용 중 로그인이 풀리면 세션 만료 안내가 보인다', async ({ page }) => {
    await mockLoggedIn(page);
    await page.goto(MAP_URL);
    await expect(page.getByRole('progressbar', LOADING)).toBeHidden();

    // 이후 갱신 요청은 실패시키고, 저장 API는 401을 줘서 세션 만료 흐름을 탄다.
    await page.route('**/auth/refresh', (route) =>
      route.fulfill({ status: 401, json: { isSuccess: false } }),
    );
    await page.route('**/experience-map/blocks', (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill({
          status: 401,
          json: {
            isSuccess: false,
            error: { errorCode: 'COMMON401' },
          },
        });
      }
      return route.fallback();
    });

    await page.getByText('미분류').first().hover();
    await page.getByRole('button', { name: '그룹 추가' }).first().click();

    await expect(
      page.getByRole('alert').filter({
        hasText: '로그인 세션을 갱신하지 못했습니다',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: '다시 로그인' }),
    ).toBeVisible();
  });
});
