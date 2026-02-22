import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types/api/common';
import type {
  SendAuthSmsRequest,
  SendAuthSmsResponse,
  VerifyAuthSmsRequest,
  VerifyAuthSmsResponse,
} from '@/types/api/auth';

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
