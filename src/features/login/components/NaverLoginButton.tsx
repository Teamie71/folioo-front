'use client';

import { NaverLogo } from '@/components/icons/NaverLogo';
import { SocialLoginButton } from '@/features/login/components/SocialLoginButton';
import { getNaverLoginUrl } from '@/features/login/hooks/socialLoginUrl';

export function NaverLoginButton() {
  const handleNaverLogin = () => {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      alert('API 주소가 설정되지 않았습니다.');
      return;
    }
    window.location.href = getNaverLoginUrl();
  };

  return (
    <SocialLoginButton variant='naver' onClick={handleNaverLogin}>
      <NaverLogo />
      <span>네이버로 로그인</span>
    </SocialLoginButton>
  );
}
