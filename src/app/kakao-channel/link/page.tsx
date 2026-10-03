'use client';

import { useCallback, useEffect, useState } from 'react';
import { LoginRequiredRouteGuard } from '@/components/LoginRequiredRouteGuard';
import { KakaoLogo } from '@/components/icons/KakaoLogo';
import {
  getKakaoAuthorizeUrl,
  getKakaoLinkStatus,
  KAKAO_CHANNEL_CHAT_URL,
} from '@/features/experience/list/api/kakaoChannelLink';
import { useAuthStore } from '@/store/useAuthStore';

function LinkEntryContent() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [linked, setLinked] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const loadStatus = useCallback(async () => {
    setError('');
    try {
      setLinked(await getKakaoLinkStatus());
    } catch {
      setError('카카오톡 연결 상태를 확인하지 못했어요. 다시 시도해 주세요.');
    }
  }, []);

  useEffect(() => {
    if (accessToken) void loadStatus();
  }, [accessToken, loadStatus]);

  const authorize = async () => {
    if (pending) return;
    setPending(true);
    setError('');
    try {
      window.location.assign(await getKakaoAuthorizeUrl());
    } catch {
      setError('카카오 계정 연결을 시작하지 못했어요. 다시 시도해 주세요.');
      setPending(false);
    }
  };

  return (
    <main className='mx-auto flex min-h-screen w-full max-w-[520px] flex-col items-center justify-center px-[24px] text-center'>
      <span className='mb-[24px] flex size-[56px] items-center justify-center rounded-[14px] bg-[#FEE500]'>
        <KakaoLogo />
      </span>
      <h1 className='text-gray9 text-[24px] leading-[34px] font-bold'>
        카카오톡 계정 연결
      </h1>
      {linked === null && !error ? (
        <p role='status' className='text-gray6 mt-[20px]'>
          연결 상태를 확인하고 있어요.
        </p>
      ) : linked ? (
        <>
          <p className='text-gray7 mt-[20px] leading-[24px]'>
            이미 Folioo 계정과 카카오톡이 연결되어 있어요.
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
          {!error && (
            <p className='text-gray7 mt-[20px] leading-[24px]'>
              카카오 계정을 연결하면 Folioo 채널에서 경험을 정리할 수 있어요.
            </p>
          )}
          {error && (
            <p role='alert' className='mt-[20px] text-red-600'>
              {error}
            </p>
          )}
          <button
            type='button'
            onClick={error && linked === null ? loadStatus : authorize}
            disabled={pending}
            className='mt-[28px] rounded-[10px] bg-[#FEE500] px-[24px] py-[12px] font-semibold text-black/85 disabled:opacity-60'
          >
            {error && linked === null
              ? '다시 시도하기'
              : '카카오톡 계정 연결하기'}
          </button>
        </>
      )}
    </main>
  );
}

export default function KakaoLinkEntryPage() {
  return (
    <LoginRequiredRouteGuard>
      <LinkEntryContent />
    </LoginRequiredRouteGuard>
  );
}
