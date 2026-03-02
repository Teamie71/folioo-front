import type { AuthControllerGoogleLoginParams } from '@/api/models/authControllerGoogleLoginParams';
import type { AuthControllerKakaoLoginParams } from '@/api/models/authControllerKakaoLoginParams';
import type { AuthControllerNaverLoginParams } from '@/api/models/authControllerNaverLoginParams';

/** 프론트 로그인 콜백 경로 (콜백 페이지와 동일) */
const CALLBACK_PATH = '/login/callback';

/** Orval auth 엔드포인트 경로 (auth.ts 생성 코드와 동일 유지) */
const AUTH_PATH = {
  KAKAO: '/auth/kakao',
  NAVER: '/auth/naver',
  GOOGLE: '/auth/google',
} as const;

function getOrigin(): string {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL ?? '';
}

function getReturnPath(): string {
  if (typeof window !== 'undefined') {
    const p = window.location.pathname + window.location.search;
    return p || '/';
  }
  return '/';
}

/* 리다이렉트 URL 생성 (카카오/네이버/구글 공통) */
export function getSocialLoginRedirectParams(): {
  redirect_path: string;
  redirect_url: string;
} {
  const origin = getOrigin();
  const returnPath = getReturnPath();
  const redirectPath = `${CALLBACK_PATH}?redirect_to=${encodeURIComponent(returnPath)}`;
  return { redirect_path: redirectPath, redirect_url: origin };
}

/* 카카오 로그인으로 이동할 URL  */
export function getKakaoLoginUrl(): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? '';
  const params: AuthControllerKakaoLoginParams = getSocialLoginRedirectParams();
  const q = new URLSearchParams(params as Record<string, string>).toString();
  return `${baseUrl}${AUTH_PATH.KAKAO}?${q}`;
}

/* 네이버 로그인으로 이동할 URL  */
export function getNaverLoginUrl(): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? '';
  const params: AuthControllerNaverLoginParams = getSocialLoginRedirectParams();
  const q = new URLSearchParams(params as Record<string, string>).toString();
  return `${baseUrl}${AUTH_PATH.NAVER}?${q}`;
}

/* 구글 로그인으로 이동할 URL */
export function getGoogleLoginUrl(): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? '';
  const params: AuthControllerGoogleLoginParams =
    getSocialLoginRedirectParams();
  const q = new URLSearchParams(params as Record<string, string>).toString();
  return `${baseUrl}${AUTH_PATH.GOOGLE}?${q}`;
}
