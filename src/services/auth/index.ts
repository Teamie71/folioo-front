import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types/api/common';
import type {
  SendAuthSmsRequest,
  SendAuthSmsResponse,
  VerifyAuthSmsRequest,
  VerifyAuthSmsResponse,
} from '@/types/api/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/* refreshToken 쿠키로 accessToken 재발급 (로그인 콜백 후 호출) */
export async function refreshAccessToken(): Promise<string> {
  if (!API_BASE_URL) {
    throw new Error('API 주소가 설정되지 않았습니다.');
  }
  const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  const json = (await res.json()) as {
    isSuccess?: boolean;
    result?: string | null;
    error?: { reason?: string };
  };
  if (!res.ok || !json.isSuccess || json.result == null) {
    throw new Error(json.error?.reason ?? '토큰 재발급에 실패했습니다.');
  }
  return json.result;
}

/** 전화번호 인증번호 발송 */
export async function sendAuthSms(
  body: SendAuthSmsRequest,
): Promise<SendAuthSmsResponse> {
  const response = await apiClient.post<ApiResponse<SendAuthSmsResponse>>(
    '/auth/sms/send',
    body,
  );

  if (response.data.isSuccess && response.data.result != null) {
    return response.data.result;
  }

  throw new Error('인증번호 발송에 실패했습니다.');
}

/** 전화번호 인증번호 검증 */
export async function verifyAuthSms(
  body: VerifyAuthSmsRequest,
): Promise<VerifyAuthSmsResponse> {
  const response = await apiClient.post<ApiResponse<VerifyAuthSmsResponse>>(
    '/auth/sms/verify',
    body,
  );

  if (response.data.isSuccess && response.data.result != null) {
    return response.data.result;
  }

  throw new Error('인증에 실패했습니다.');
}
