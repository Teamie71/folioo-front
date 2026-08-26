'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CommonButton } from '@/components/CommonButton';
import { LoginRequiredModal } from '@/components/LoginRequiredModal';
import { RecommendationInfoIcon } from '@/components/icons/RecommendationInfoIcon';
import { RecommendationShareIcon } from '@/components/icons/RecommendationShareIcon';
import { RecommendationHollandModal } from '@/features/recommendation/components/RecommendationHollandModal';
import { RecommendationHollandRadar } from '@/features/recommendation/components/RecommendationHollandRadar';
import { RecommendationWorkPodium } from '@/features/recommendation/components/RecommendationWorkPodium';
import {
  RecommendationCompanyCards,
  RecommendationJobCards,
} from '@/features/recommendation/components/RecommendationResultCards';
import { useRecommendationResult } from '@/features/recommendation/hooks/useRecommendationResult';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';
import { useUserControllerGetProfile } from '@/api/endpoints/user/user';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/utils/utils';

const RESULT_SHARE_PATH = '/recommendation/share';
const EXPERIENCE_HREF = '/experience';
const LOGIN_REQUIRED_REDIRECT_MS = 2000;

export type RecommendationResultVariant = 'result' | 'share';

interface RecommendationResultProps {
  variant?: RecommendationResultVariant;
}

export function RecommendationResult({
  variant = 'result',
}: RecommendationResultProps) {
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
  const isLocked = !isLoggedIn;
  const { data: profileRes } = useUserControllerGetProfile({
    query: { enabled: isLoggedIn },
  });
  const { result } = useRecommendationResult(isShare ? 'share' : 'mine');
  const hollandTypes = result.holland.types;
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
    <div className='min-h-[100dvh] bg-white pb-[6.25rem]'>
      <div className='mx-auto w-[64rem]'>
        <header className='flex h-[2.625rem] items-center bg-sub1 px-[8.6875rem]'>
          <h1 className='typo-h4 text-main'>직무 찾기 결과</h1>
        </header>

        {isShare && <ShareBanner />}

        <div className='mx-auto w-[46.625rem]'>
          <p className='typo-b2-b mt-[1.25rem] text-gray9'>
            {userName}님은...
          </p>
          <h2 className='typo-h3 mt-[1.5rem] text-center text-gray9'>
            {result.headline[0]}
            <br />
            {result.headline[1]}
          </h2>

          <div className='mt-[2.5rem] flex items-center gap-[0.5rem]'>
            <span className='typo-c1-b text-main'>전공</span>
            <span className='typo-c1 text-gray9'>{result.major}</span>
          </div>

          <section className='mt-[1.375rem]'>
            <h3 className='typo-c1-b text-main'>흥미 유형</h3>
            <div
              className={cn(
                'mt-[1rem] flex justify-between',
                hollandTypes.length >= 2 ? 'items-center' : 'items-start',
              )}
            >
              <RecommendationHollandRadar scores={result.holland.scores} />
              <div className='flex w-[20.5rem] flex-col items-end'>
                <button
                  type='button'
                  onClick={() => setTypesOpen(true)}
                  className='flex cursor-pointer items-center gap-[0.25rem] rounded-[8px] border border-gray3 bg-sub1 px-[0.5rem] py-[0.25rem]'
                >
                  <RecommendationInfoIcon />
                  <span className='typo-c2 text-gray9'>
                    전체 유형별 특성 보기
                  </span>
                </button>
                <div className='mt-[1rem] flex w-full flex-col gap-[0.75rem]'>
                  {hollandTypes.map((type) => (
                    <div
                      key={type.code}
                      className='shadow-chat-card min-h-[7.6875rem] w-full rounded-[12px] bg-gray1 px-[1rem] py-[1rem]'
                    >
                      <p className='typo-b2-sb text-gray9'>
                        {hollandCardName(type)}
                      </p>
                      <p className='typo-c1 mt-[0.25rem] text-gray9'>
                        {type.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className='mt-[2.5rem]'>
            <h3 className='typo-c1-b text-main'>선호 근무 조건</h3>
            <div className='mt-[0.75rem] flex justify-center'>
              <RecommendationWorkPodium items={result.workConditions} />
            </div>
          </section>

          <section className='mt-[2.5rem]'>
            <h3 className='typo-c1-b text-main'>
              {userName}님께 딱 맞는 직무
            </h3>
            <div className='mt-[0.75rem]'>
              <RecommendationJobCards
                jobs={result.jobs}
                locked={isLocked}
                loginHref={loginHref}
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
            <div className='mt-[0.75rem] h-[26.1875rem] border border-gray4 bg-gray2' />
            <CommonButton
              variantType='Execute'
              px='0.625rem'
              py='0.75rem'
              className='mt-[1rem] h-[3rem] w-full rounded-[12px]'
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

          <div className='mt-[1.5rem] flex items-center justify-center gap-[1rem]'>
            <button
              type='button'
              onClick={handleShare}
              className='flex h-[3rem] w-[9.75rem] cursor-pointer items-center justify-center gap-[0.375rem] rounded-[12px] border border-gray4 bg-white px-[0.625rem] py-[0.75rem]'
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
              className='flex h-[3rem] w-[9.75rem] cursor-pointer items-center justify-center rounded-[12px] border border-gray4 bg-white px-[0.625rem] py-[0.75rem]'
            >
              <span className='typo-b2 text-gray9'>테스트 다시하기</span>
            </button>
          </div>
        </div>
      </div>

      <RecommendationHollandModal
        open={typesOpen}
        onOpenChange={setTypesOpen}
      />

      <LoginRequiredModal
        open={loginRequiredOpen}
        onOpenChange={() => {}}
      />

      {copied && (
        <div className='shadow-chat-card fixed bottom-[2.5rem] left-1/2 z-50 -translate-x-1/2 rounded-[12px] border border-gray3 bg-sub1 px-[2rem] py-[1rem]'>
          <p className='typo-b2-sb whitespace-nowrap text-gray9'>
            공유 링크가 복사되었어요.
          </p>
        </div>
      )}
    </div>
  );
}

function hollandCardName(type: { code: string; name: string }) {
  const label = type.name.replace(/\s*\([^)]*\)\s*$/, '').trim();
  return `${label}(${type.code})`;
}

function ShareBanner() {
  const router = useRouter();
  const resetTest = useRecommendationTestStore((s) => s.reset);

  return (
    <div className='relative h-[9.375rem] w-full'>
      <div className='absolute inset-0 bg-gradient-to-b from-white to-main opacity-20' />
      <div className='relative flex flex-col items-center pt-[1.25rem]'>
        <p className='typo-c1 text-center text-gray9'>
          전공, 흥미, 선호 조건 기반으로
          <br />
          내 맞춤 직무를 3분 만에 찾아보세요!
        </p>
        <CommonButton
          variantType='Execute'
          px='0.625rem'
          py='0.75rem'
          className='mt-[1.25rem] rounded-[12px]'
          style={{ width: '46.625rem' }}
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
