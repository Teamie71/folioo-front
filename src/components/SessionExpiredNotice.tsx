'use client';

import { useAuthStore } from '@/store/useAuthStore';

export function SessionExpiredNotice() {
  const expired = useAuthStore((s) => s.sessionExpired);
  if (!expired) return null;
  return (
    <div
      role='alert'
      className='fixed inset-x-4 top-4 z-[200] mx-auto max-w-lg rounded-xl border border-gray-300 bg-white p-4 shadow-lg'
    >
      <p>로그인 세션을 갱신하지 못했습니다. 다시 로그인해 주세요.</p>
      <button
        type='button'
        className='mt-2 underline'
        onClick={() => {
          const returnTo = `${window.location.pathname}${window.location.search}`;
          window.location.assign(
            `/login?redirect_to=${encodeURIComponent(returnTo)}`,
          );
        }}
      >
        다시 로그인
      </button>
    </div>
  );
}
