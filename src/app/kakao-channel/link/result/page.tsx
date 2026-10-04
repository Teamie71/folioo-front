'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  confirmKakaoLink,
  getKakaoLinkErrorCode,
  KAKAO_CHANNEL_CHAT_URL,
} from '@/features/experience/list/api/kakaoChannelLink';
import {
  KAKAO_LINK_RESULT_PATH,
  KAKAO_LINK_RETURN_TO_CHANNEL_KEY,
  KAKAO_LINK_TOKEN_KEY,
} from '@/features/experience/list/lib/kakaoLinkReturn';
import { useAuthStore } from '@/store/useAuthStore';

type ResultState =
  | 'loading'
  | 'success'
  | 'canceled'
  | 'failed'
  | 'expired'
  | 'other-account'
  | 'already-linked';

function resultFromCode(code: string | null): ResultState {
  if (code === 'KAKAO400') return 'expired';
  if (code === 'KAKAO409') return 'other-account';
  if (code === 'KAKAO4091') return 'already-linked';
  return 'failed';
}

const RESULT_COPY: Record<
  Exclude<ResultState, 'loading' | 'success'>,
  string
> = {
  canceled: '카카오 인증이 취소됐어요.',
  failed: '카카오톡 계정을 연결하지 못했어요. 다시 시도해 주세요.',
  expired: '연결 정보가 만료됐거나 유효하지 않아요. 다시 연결해 주세요.',
  'other-account': '이 카카오 계정은 다른 Folioo 계정에 연결되어 있어요.',
  'already-linked':
    '현재 Folioo 계정에는 다른 카카오 계정이 이미 연결되어 있어요.',
};

export default function KakaoLinkResultPage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const restored = useAuthStore((state) => state.sessionRestoreAttempted);
  const [state, setState] = useState<ResultState>('loading');
  const [token, setToken] = useState<string | null>(null);
  const attempted = useRef(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const url = new URL(window.location.href);
    const receivedToken = url.searchParams.get('link_token');
    const error = url.searchParams.get('error');
    if (receivedToken) {
      sessionStorage.setItem(
        KAKAO_LINK_TOKEN_KEY,
        JSON.stringify({ value: receivedToken, receivedAt: Date.now() }),
      );
    }
    url.searchParams.delete('link_token');
    url.searchParams.delete('error');
    window.history.replaceState(
      window.history.state,
      '',
      url.pathname + url.search + url.hash,
    );

    if (error) {
      sessionStorage.removeItem(KAKAO_LINK_TOKEN_KEY);
      sessionStorage.removeItem(KAKAO_LINK_RETURN_TO_CHANNEL_KEY);
      setState(error === 'CANCELED' ? 'canceled' : 'failed');
      return;
    }
    const saved = sessionStorage.getItem(KAKAO_LINK_TOKEN_KEY);
    try {
      const parsed = saved
        ? (JSON.parse(saved) as { value: string; receivedAt: number })
        : null;
      if (!parsed?.value || Date.now() - parsed.receivedAt > 5 * 60 * 1000) {
        sessionStorage.removeItem(KAKAO_LINK_TOKEN_KEY);
        sessionStorage.removeItem(KAKAO_LINK_RETURN_TO_CHANNEL_KEY);
        setState('expired');
        return;
      }
      setToken(parsed.value);
    } catch {
      sessionStorage.removeItem(KAKAO_LINK_TOKEN_KEY);
      sessionStorage.removeItem(KAKAO_LINK_RETURN_TO_CHANNEL_KEY);
      setState('expired');
    }
  }, []);

  useEffect(() => {
    if (!token || !restored || attempted.current) return;
    if (!accessToken) {
      router.replace(
        `/login?redirect_to=${encodeURIComponent(KAKAO_LINK_RESULT_PATH)}`,
      );
      return;
    }
    attempted.current = true;
    void confirmKakaoLink(token)
      .then(() => {
        setState('success');
        if (sessionStorage.getItem(KAKAO_LINK_RETURN_TO_CHANNEL_KEY) === '1') {
          sessionStorage.removeItem(KAKAO_LINK_RETURN_TO_CHANNEL_KEY);
          window.location.replace(KAKAO_CHANNEL_CHAT_URL);
        }
      })
      .catch((cause) => {
        sessionStorage.removeItem(KAKAO_LINK_RETURN_TO_CHANNEL_KEY);
        setState(resultFromCode(getKakaoLinkErrorCode(cause)));
      })
      .finally(() => sessionStorage.removeItem(KAKAO_LINK_TOKEN_KEY));
  }, [token, restored, accessToken, router]);

  return (
    <main className='mx-auto flex min-h-screen w-full max-w-[520px] flex-col items-center justify-center px-[24px] text-center'>
      <h1 className='text-gray9 text-[24px] leading-[34px] font-bold'>
        카카오톡 계정 연결
      </h1>
      {state === 'loading' ? (
        <p role='status' className='text-gray6 mt-[20px]'>
          연결 결과를 확인하고 있어요.
        </p>
      ) : state === 'success' ? (
        <>
          <p className='text-gray7 mt-[20px] leading-[24px]'>
            카카오톡 계정 연결이 완료됐어요.
            <br />
            카카오톡으로 돌아가 /활동변경을 보내 활동을 선택해 주세요.
          </p>
          {KAKAO_CHANNEL_CHAT_URL && (
            <a
              href={KAKAO_CHANNEL_CHAT_URL}
              className='mt-[28px] rounded-[10px] bg-[#FEE500] px-[24px] py-[12px] font-semibold text-black/85'
            >
              카카오톡 채널로 이동
            </a>
          )}
        </>
      ) : (
        <>
          <p role='alert' className='text-gray7 mt-[20px] leading-[24px]'>
            {RESULT_COPY[state]}
          </p>
          {(state === 'canceled' ||
            state === 'failed' ||
            state === 'expired') && (
            <button
              type='button'
              onClick={() => router.replace('/kakao-channel/link')}
              className='mt-[28px] rounded-[10px] bg-[#FEE500] px-[24px] py-[12px] font-semibold text-black/85'
            >
              다시 연결하기
            </button>
          )}
        </>
      )}
    </main>
  );
}
