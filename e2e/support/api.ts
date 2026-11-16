import type { Page } from '@playwright/test';
import {
  activityStatusesEmpty,
  experienceMapDefault,
  templatesEmpty,
  userProfile,
} from '../data/experienceMap';

type Mocked = object | 'error';

const SERVER_ERROR = { status: 500, json: { isSuccess: false } };

function respond(body: Mocked) {
  return body === 'error' ? SERVER_ERROR : { json: body };
}

/** 로그인 확인이 실패해 게스트로 시작한다. */
export async function mockGuest(page: Page) {
  await page.route('**/auth/refresh', (route) =>
    route.fulfill({ status: 401, json: { isSuccess: false } }),
  );
}

/** 로그인된 사용자로 시작한다. 각 응답은 테스트에서 바꿔 끼울 수 있다. */
export async function mockLoggedIn(
  page: Page,
  {
    map = experienceMapDefault,
    templates = templatesEmpty,
  }: { map?: Mocked; templates?: Mocked } = {},
) {
  await page.route('**/auth/refresh', (route) =>
    route.fulfill({ json: { isSuccess: true, result: 'e2e-access-token' } }),
  );
  await page.route('**/users/me', (route) =>
    route.fulfill({ json: userProfile }),
  );
  await page.route('**/experience-map/activity-status', (route) =>
    route.fulfill({ json: activityStatusesEmpty }),
  );
  await page.route('**/templates', (route) =>
    route.fulfill(respond(templates)),
  );
  await page.route('**/experience-map', (route) =>
    route.fulfill(respond(map)),
  );
}
