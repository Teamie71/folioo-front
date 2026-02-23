'use client';

import { GoogleLogo } from '@/components/icons/GoogleLogo';
import { SocialLoginButton } from '@/features/login/SocialLoginButton';

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    // TODO: 구글 로그인 연동
  };

  return (
    <SocialLoginButton variant='google' onClick={handleGoogleLogin}>
      <GoogleLogo />
      <span>Google로 로그인</span>
    </SocialLoginButton>
  );
}
