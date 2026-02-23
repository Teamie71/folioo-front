'use client';

import { NaverLogo } from '@/components/icons/NaverLogo';
import { SocialLoginButton } from '@/features/login/SocialLoginButton';

export function NaverLoginButton() {
  const handleNaverLogin = () => {
    // TODO: 네이버 로그인 연동
  };

  return (
    <SocialLoginButton variant='naver' onClick={handleNaverLogin}>
      <NaverLogo />
      <span>네이버로 로그인</span>
    </SocialLoginButton>
  );
}
