import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isMobileLayoutUserAgent, isMobilePhone } from '@/utils/device';
import {
  DEFAULT_WORKSPACE_VIEW,
  WORKSPACE_PATH,
  WORKSPACE_VIEW_PARAM,
  parseWorkspaceView,
} from '@/features/experience/workspace/model/workspaceView';

/** 모바일에서 접근을 허용하는 experience 하위 경로 */
const MOBILE_ALLOWED_EXPERIENCE_PATHS = new Set([
  '/experience/list',
  WORKSPACE_PATH,
]);

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const userAgent = request.headers.get('user-agent');

  // /mobile-blocked에서 새로고침 시
  // - 스마트폰이면 그대로 유지
  // - 스마트폰이 아니면 기본 페이지(/)로 리다이렉트
  if (pathname.startsWith('/mobile-blocked')) {
    if (!isMobilePhone(userAgent)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // experience 하위 페이지 모바일 접근 시 차단 (모바일 전용은 목록만)
  if (
    pathname.startsWith('/experience/') &&
    !MOBILE_ALLOWED_EXPERIENCE_PATHS.has(pathname) &&
    isMobilePhone(userAgent)
  ) {
    return NextResponse.redirect(new URL('/mobile-blocked', request.url));
  }

  // 워크스페이스 view 파라미터 정규화.
  //
  // 클라이언트(useWorkspaceView)는 데스크톱에서만 마운트되므로
  // 누락/잘못된 값/모바일의 map 접근을 서버 단계에서 한 번에 정리한다.
  // 판별 기준은 workspace/page.tsx의 렌더링 분기와 동일한 함수를 쓴다.
  if (pathname === WORKSPACE_PATH) {
    const rawView = request.nextUrl.searchParams.get(WORKSPACE_VIEW_PARAM);
    // 맵은 데스크톱 전용이다.
    const nextView = isMobileLayoutUserAgent(userAgent)
      ? DEFAULT_WORKSPACE_VIEW
      : parseWorkspaceView(rawView);

    if (rawView !== nextView) {
      const url = request.nextUrl.clone();
      url.searchParams.set(WORKSPACE_VIEW_PARAM, nextView);
      return NextResponse.redirect(url);
    }
  }

  // 데스크톱에서 모바일 전용 페이지(/profile) 접근 시 홈으로 리다이렉트
  if (pathname === '/profile' && !isMobilePhone(userAgent)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 정적 파일, API, _next 제외
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // favicon, images, etc.
  ) {
    return NextResponse.next();
  }

  // 모바일이 구현된 페이지들
  const exactAllowedMobilePaths = [
    '/',
    '/log',
    '/experience',
    '/experience/list',
    WORKSPACE_PATH,
    '/correction',
    '/topup',
    '/profile',
    '/invoice',
    '/invoice/refund',
    '/terms',
    '/tos',
    '/privacy',
    '/marketing',
    '/login',
    '/login/callback',
    '/verify',
    '/withdraw',
    '/error',
  ];

  const isExactAllowed = exactAllowedMobilePaths.includes(pathname);

  if (isMobilePhone(userAgent) && !isExactAllowed) {
    return NextResponse.redirect(new URL('/mobile-blocked', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|FaviconWeb\\.svg).*)'],
};
