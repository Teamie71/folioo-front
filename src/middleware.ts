import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 스마트폰만 차단 (태블릿 제외)
const MOBILE_PHONE_UA_PATTERN =
  /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|CriOS|FxiOS/i;

function isTablet(userAgent: string | null): boolean {
  if (!userAgent) return false;
  // iPad는 항상 태블릿
  if (/iPad/.test(userAgent)) return true;
  // Android 중 'Mobile'이 없으면 태블릿으로 간주 (폰은 보통 Mobile 포함)
  if (/Android/.test(userAgent) && !/Mobile/.test(userAgent)) return true;
  return false;
}

function isMobilePhone(userAgent: string | null): boolean {
  if (!userAgent) return false;
  if (isTablet(userAgent)) return false;
  return MOBILE_PHONE_UA_PATTERN.test(userAgent);
}

export function middleware(request: NextRequest) {
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

  // 정적 파일, API, _next 제외
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // favicon, images, etc.
  ) {
    return NextResponse.next();
  }

  // 스마트폰만 차단 (태블릿은 허용)
  if (isMobilePhone(userAgent)) {
    return NextResponse.redirect(new URL('/mobile-blocked', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|FaviconWeb\\.svg).*)'],
};
