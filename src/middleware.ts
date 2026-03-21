import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isMobilePhone, isTablet } from '@/utils/device';

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

  // experience 하위 페이지 모바일 접근 시 차단 (모바일 전용은 목록만)
  if (pathname.startsWith('/experience/') && isMobilePhone(userAgent)) {
    return NextResponse.redirect(new URL('/mobile-blocked', request.url));
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
