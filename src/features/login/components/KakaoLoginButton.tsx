'use client';

import { KakaoLogo } from '@/components/icons/KakaoLogo';
import { SocialLoginButton } from '@/features/login/components/SocialLoginButton';
import { getKakaoLoginUrl } from '@/features/login/hooks/socialLoginUrl';

export function KakaoLoginButton() {
  const handleKakaoLogin = () => {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      alert('API 주소가 설정되지 않았습니다.');
      return;
    }
    window.location.href = getKakaoLoginUrl();
  };

  return (
    <SocialLoginButton variant='kakao' onClick={handleKakaoLogin}>
      <KakaoLogo />
      <span>카카오로 로그인</span>
    </SocialLoginButton>
  );
}
