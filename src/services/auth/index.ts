import { authControllerHandleRefresh } from '@/api/endpoints/auth/auth';

/** refreshToken 쿠키로 accessToken 재발급 (로그인 콜백 / 앱 로드 시) */
export async function refreshAccessToken(): Promise<string> {
  // customInstance는 response.data만 반환
  const body = (await authControllerHandleRefresh({
    withCredentials: true,
  })) as { isSuccess?: boolean; result?: string | null } | undefined;
  if (body?.isSuccess && body?.result != null) {
    return body.result;
  }
  throw new Error('토큰 재발급에 실패했습니다.');
}
