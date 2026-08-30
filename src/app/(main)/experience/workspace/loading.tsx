/**
 * 워크스페이스는 headers() 때문에 동적 라우트다.
 * loading.tsx가 있어야 부분 prefetch가 가능해지고,
 * /experience/settings/* 에서 돌아올 때 서버 응답 전에 즉시 피드백을 줄 수 있다.
 */
export default function ExperienceWorkspaceLoading() {
  return (
    <div className='flex h-[100dvh] w-full overflow-hidden bg-white'>
      {/* 사이드바 자리 */}
      <div className='border-gray3 hidden w-[260px] shrink-0 border-r md:block' />

      <div className='flex min-w-0 flex-1 flex-col'>
        {/* 툴바 자리 */}
        <div className='flex h-[79px] shrink-0 items-center gap-[20px] px-[20px]'>
          <div className='bg-gray3 h-[29px] w-[158px] animate-pulse rounded-[6px]' />
          <div className='bg-gray3 h-[28px] w-[60px] animate-pulse rounded-[6px]' />
        </div>

        {/* 본문 자리 */}
        <div className='flex min-h-0 flex-1 flex-col gap-[20px] px-[60px] pt-[44px]'>
          <div className='bg-gray3 h-[28px] w-[280px] animate-pulse rounded-[6px]' />
          <div className='bg-gray3 h-[16px] w-full max-w-[720px] animate-pulse rounded-[4px]' />
          <div className='bg-gray3 h-[16px] w-full max-w-[640px] animate-pulse rounded-[4px]' />
          <div className='bg-gray3 h-[16px] w-full max-w-[560px] animate-pulse rounded-[4px]' />
        </div>
      </div>
    </div>
  );
}
