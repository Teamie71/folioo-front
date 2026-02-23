'use client';

import { KakaoLogo } from '@/components/icons/KakaoLogo';
import { SocialLoginButton } from '@/features/login/SocialLoginButton';

const KAKAO_CALLBACK_PATH = '/login/callback';

export function KakaoLoginButton() {
  const handleKakaoLogin = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      alert('API 주소가 설정되지 않았습니다.');
      return;
    }

    // 로그인은 Orval 코드를 쓰지 않고 브라우저를 직접 이동시키는 방식
    // Axios가 아닌 window.location.href를 사용
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const returnPath =
      typeof window !== 'undefined'
        ? window.location.pathname + window.location.search || '/'
        : '/';
    const redirectPathWithReturn = `${KAKAO_CALLBACK_PATH}?redirect_to=${encodeURIComponent(returnPath)}`;
    // 로그인 후 현재 페이지로 리다이렉트
    const params = new URLSearchParams({
      redirect_path: redirectPathWithReturn,
      redirect_url: origin,
    });
    window.location.href = `${baseUrl.replace(/\/$/, '')}/auth/kakao?${params.toString()}`;
  };

  return (
    <SocialLoginButton variant='kakao' onClick={handleKakaoLogin}>
      <KakaoLogo />
      <span>카카오로 로그인</span>
    </SocialLoginButton>
  );
}
