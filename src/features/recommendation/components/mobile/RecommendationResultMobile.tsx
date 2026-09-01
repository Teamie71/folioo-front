'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CommonButton } from '@/components/CommonButton';
import { cn } from '@/utils/utils';
import { LoginRequiredModal } from '@/components/LoginRequiredModal';
import { ToastMessage } from '@/features/recommendation/components/ToastMessage';
import { RecommendationShareIcon } from '@/components/icons/RecommendationShareIcon';
import { RecommendationHollandInterestSection } from '@/features/recommendation/components/RecommendationHollandInterestSection';
import { RecommendationHollandModal } from '@/features/recommendation/components/RecommendationHollandModal';
import { RecommendationWorkPodium } from '@/features/recommendation/components/RecommendationWorkPodium';
import {
  RecommendationCompanyCards,
  RecommendationJobCards,
} from '@/features/recommendation/components/RecommendationResultCards';
import type { RecommendationResultVariant } from '@/features/recommendation/components/RecommendationResult';
import { useHollandTypesPreview } from '@/features/recommendation/hooks/useHollandTypesPreview';
import { useRecommendationResult } from '@/features/recommendation/hooks/useRecommendationResult';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';
import { useUserControllerGetProfile } from '@/api/endpoints/user/user';
import { useAuthStore } from '@/store/useAuthStore';

const RESULT_SHARE_PATH = '/recommendation/share';
const EXPERIENCE_HREF = '/experience';
const LOGIN_REQUIRED_REDIRECT_MS = 2000;

interface RecommendationResultMobileProps {
  variant?: RecommendationResultVariant;
}

export function RecommendationResultMobile({
  variant = 'result',
}: RecommendationResultMobileProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isShare = variant === 'share';
  const resetTest = useRecommendationTestStore((s) => s.reset);
  const [typesOpen, setTypesOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loginRequiredOpen, setLoginRequiredOpen] = useState(false);
  const loginRequiredTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const loginRedirectRef = useRef(pathname || RESULT_SHARE_PATH);
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );
  const isLoggedIn = sessionRestoreAttempted && Boolean(accessToken);
  const isLocked = isShare ? false : !isLoggedIn;
  const { data: profileRes } = useUserControllerGetProfile({
    query: { enabled: isLoggedIn },
  });
  const { result } = useRecommendationResult(isShare ? 'share' : 'mine');
  const hollandTypes = useHollandTypesPreview(result.holland.types);
  const userName = isLoggedIn
    ? (profileRes?.result?.name ?? result.userName)
    : result.userName;

  useEffect(() => {
    if (!loginRequiredOpen) return;

    loginRequiredTimerRef.current = setTimeout(() => {
      loginRequiredTimerRef.current = null;
      setLoginRequiredOpen(false);
      router.push(
        `/login?redirect_to=${encodeURIComponent(loginRedirectRef.current)}`,
      );
    }, LOGIN_REQUIRED_REDIRECT_MS);

    return () => {
      if (loginRequiredTimerRef.current) {
        clearTimeout(loginRequiredTimerRef.current);
      }
    };
  }, [loginRequiredOpen, pathname, router]);

  const handleShare = async () => {
    if (!sessionRestoreAttempted) return;

    if (!accessToken) {
      loginRedirectRef.current = pathname || RESULT_SHARE_PATH;
      setLoginRequiredOpen(true);
      return;
    }

    const url = `${window.location.origin}${RESULT_SHARE_PATH}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('공유 링크를 복사하세요.', url);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleExperienceStart = () => {
    if (!sessionRestoreAttempted) return;

    if (!accessToken) {
      loginRedirectRef.current = EXPERIENCE_HREF;
      setLoginRequiredOpen(true);
      return;
    }

    router.push(EXPERIENCE_HREF);
  };

  const loginHref = `/login?redirect_to=${encodeURIComponent(pathname || RESULT_SHARE_PATH)}`;

  return (
    <div className='min-h-[calc(100dvh-52px)] bg-white pb-[2.5rem]'>
      {isShare && <ShareBannerMobile />}

      <div className={cn('px-[1rem]', isShare ? 'pt-[1.25rem]' : 'pt-[0.75rem]')}>

        <p className='typo-b2-b text-gray9'>{userName}님은...</p>

        <h2 className='typo-h3 mt-[1.5rem] text-center text-gray9'>
          {result.headline[0]}
          <br />
          {result.headline[1]}
        </h2>

        <div className='mt-[2.5rem] flex items-center gap-[0.5rem]'>
          <span className='typo-c1-b text-main'>전공</span>
          <span className='typo-c1 text-gray9'>{result.major}</span>
        </div>

        <RecommendationHollandInterestSection
          scores={result.holland.scores}
          types={hollandTypes}
          onOpenTypesModal={() => setTypesOpen(true)}
          variant='mobile'
        />

        <section className='mt-[2.5rem]'>
          <h3 className='typo-c1-b text-main'>선호 근무 조건</h3>
          <div className='mt-[0.75rem] flex justify-center'>
            <RecommendationWorkPodium items={result.workConditions} />
          </div>
        </section>

        <section className='mt-[2.5rem]'>
          <h3 className='typo-c1-b text-main'>{userName}님께 딱 맞는 직무</h3>
          <div className='mt-[0.75rem]'>
            <RecommendationJobCards
              jobs={result.jobs}
              locked={isLocked}
              loginHref={loginHref}
              variant='mobile'
            />
          </div>
        </section>

        <section className='mt-[2.5rem]'>
          <h3 className='typo-c1-b text-main'>
            {userName}님께 딱 맞는 기업 형태
          </h3>
          <div className='mt-[0.75rem]'>
            <RecommendationCompanyCards
              companies={result.companies}
              locked={isLocked}
              loginHref={loginHref}
              variant='mobile'
            />
          </div>
        </section>

        <section className='mt-[2.5rem]'>
          <h3 className='typo-b2-b text-gray9'>
            모든 직무 준비의 시작, 경험 정리!
          </h3>
          <p className='typo-c1 mt-[0.25rem] text-gray9'>
            수업, 동아리, 아르바이트 경험도 모두 활용할 수 있어요.
          </p>
          <div className='mt-[1rem] h-[11.5625rem] border border-gray4 bg-gray2' />
          <CommonButton
            variantType='Execute'
            px='0.625rem'
            py='0.75rem'
            className='typo-nav-select mt-[1rem] w-full rounded-[12px]'
            style={{ width: '100%' }}
            onClick={handleExperienceStart}
          >
            경험 정리 시작하기
          </CommonButton>
        </section>

        <p className='typo-c1 mt-[2.5rem] text-center text-gray9'>
          내 친구들의 맞춤 직무는 무엇일까요?
          <br />
          결과를 공유해 보세요!
        </p>

        <div className='mt-[2.5rem] flex gap-[1rem]'>
          <button
            type='button'
            onClick={handleShare}
            className='flex flex-1 cursor-pointer items-center justify-center gap-[0.375rem] rounded-[12px] border border-gray4 bg-white px-[0.625rem] py-[0.75rem]'
          >
            <RecommendationShareIcon />
            <span className='typo-b2 text-gray9'>결과 공유하기</span>
          </button>
          <button
            type='button'
            onClick={() => {
              resetTest();
              router.push('/recommendation');
            }}
            className='flex flex-1 cursor-pointer items-center justify-center rounded-[12px] border border-gray4 bg-white px-[0.625rem] py-[0.75rem]'
          >
            <span className='typo-b2 text-gray9'>테스트 다시하기</span>
          </button>
        </div>
      </div>

      <RecommendationHollandModal
        open={typesOpen}
        onOpenChange={setTypesOpen}
        variant='mobile'
      />

      <LoginRequiredModal open={loginRequiredOpen} onOpenChange={() => {}} />

      <ToastMessage
        open={copied}
        message='공유 링크가 복사되었어요.'
        variant='mobile'
      />
    </div>
  );
}

function ShareBannerMobile() {
  const router = useRouter();
  const resetTest = useRecommendationTestStore((s) => s.reset);

  return (
    <div className='relative h-[9.375rem] w-full'>
      <div className='absolute inset-0 bg-gradient-to-b from-white to-main opacity-20' />
      <div className='relative flex w-full flex-col px-[1rem] pt-[1.25rem]'>
        <p className='typo-c1 text-center text-gray9'>
          전공,흥미, 선호 조건 기반으로
          <br />
          내 맞춤 직무를 3분 만에 찾아보세요!
        </p>
        <CommonButton
          variantType='Execute'
          px='0.625rem'
          py='0.75rem'
          className='typo-nav-select mt-[1.25rem] w-full rounded-[12px]'
          style={{ width: '100%' }}
          onClick={() => {
            resetTest();
            router.push('/recommendation/major');
          }}
        >
          직무 찾기 테스트 시작하기
        </CommonButton>
      </div>
    </div>
  );
}
