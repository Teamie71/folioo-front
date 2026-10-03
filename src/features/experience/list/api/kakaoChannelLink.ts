import axios from 'axios';
import {
  kakaoLinkControllerAuthorize,
  kakaoLinkControllerLink,
  kakaoLinkControllerStatus,
} from '@/api/endpoints/kakao-channel-link/kakao-channel-link';

type ApiEnvelope<T> = {
  isSuccess?: boolean;
  result?: T;
  code?: string;
  message?: string;
};

function unwrap<T>(response: T | ApiEnvelope<T>, fallback: string): T {
  if (response && typeof response === 'object' && 'result' in response) {
    const body = response as ApiEnvelope<T>;
    if (body.isSuccess === false || body.result == null) {
      throw new Error(body.message || fallback);
    }
    return body.result;
  }
  if (response == null) throw new Error(fallback);
  return response as T;
}

export async function getKakaoLinkStatus(): Promise<boolean> {
  const response = await kakaoLinkControllerStatus();
  const result = unwrap(response, '카카오톡 연결 상태를 확인하지 못했어요.');
  if (typeof result.linked !== 'boolean') {
    throw new Error('카카오톡 연결 상태를 확인하지 못했어요.');
  }
  return result.linked;
}

export async function getKakaoAuthorizeUrl(): Promise<string> {
  const response = await kakaoLinkControllerAuthorize();
  const result = unwrap(response, '카카오 계정 연결을 시작하지 못했어요.');
  const url = result.authorize_url;
  if (!url || !/^https:\/\//i.test(url)) {
    throw new Error('카카오 인증 주소가 올바르지 않아요.');
  }
  return url;
}

export async function confirmKakaoLink(linkToken: string): Promise<void> {
  const response = await kakaoLinkControllerLink({ link_token: linkToken });
  if (response && typeof response === 'object' && 'isSuccess' in response) {
    const body = response as ApiEnvelope<unknown>;
    if (body.isSuccess === false) {
      const error = new Error(
        body.message || '카카오톡 계정을 연결하지 못했어요.',
      );
      Object.assign(error, { code: body.code });
      throw error;
    }
  }
}

export function getKakaoLinkErrorCode(cause: unknown): string | null {
  if (!axios.isAxiosError(cause)) {
    const code = (cause as { code?: unknown } | null)?.code;
    return typeof code === 'string' ? code : null;
  }
  const data = cause.response?.data as
    | { code?: unknown; errorCode?: unknown; error?: { code?: unknown } }
    | undefined;
  const code = data?.code ?? data?.errorCode ?? data?.error?.code;
  return typeof code === 'string' ? code : null;
}

export const KAKAO_CHANNEL_CHAT_URL =
  process.env.NEXT_PUBLIC_KAKAO_CHANNEL_CHAT_URL ||
  'http://pf.kakao.com/_ZJnxaX';
