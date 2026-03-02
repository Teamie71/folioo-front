import { authControllerHandleRefresh } from '@/api/endpoints/auth/auth';

/** refreshToken 쿠키로 accessToken 재발급 (로그인 콜백 / 앱 로드 시) */
export async function refreshAccessToken(): Promise<string> {
  const res = (await authControllerHandleRefresh({
    withCredentials: true,
  })) as {
    status: number;
    data?: { isSuccess?: boolean; result?: string | null };
  };
  const body = res.data;
  if (res.status === 201 && body?.isSuccess && body?.result != null) {
    return body.result;
  }
  throw new Error('토큰 재발급에 실패했습니다.');
}
