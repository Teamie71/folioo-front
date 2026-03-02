'use client';

import { GoogleLogo } from '@/components/icons/GoogleLogo';
import { SocialLoginButton } from '@/features/login/components/SocialLoginButton';

import { getGoogleLoginUrl } from '@/features/login/hooks/socialLoginUrl';

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      alert('API 주소가 설정되지 않았습니다.');
      return;
    }
    window.location.href = getGoogleLoginUrl();
  };

  return (
    <SocialLoginButton variant='google' onClick={handleGoogleLogin}>
      <GoogleLogo />
      <span>Google로 로그인</span>
    </SocialLoginButton>
  );
}
