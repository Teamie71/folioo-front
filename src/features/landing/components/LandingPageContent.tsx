'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CommonButton } from '@/components/CommonButton';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/useAuthStore';
import { LandingVideo } from './LandingVideo';
import { StartCorrectionButton } from './StartCorrectionButton';

type ServiceCardProps = {
  title: string;
  description: string;
  iconSrc: string;
  buttonText: string;
  onClick: () => void;
};

const solutionCards = [
  {
    label: '지원 서류에 쓸 내용이 없어요.',
    number: 'Solution 01',
    description: '경험 정리를 해두면,\n어떤 서류든 문제 없어요!',
  },
  {
    label: '경험 정리하는 방법을 모르겠어요.',
    number: 'Solution 02',
    description: '카테고리별 템플릿으로\n체계적으로 정리하세요!',
  },
  {
    label: '정리하는 시간이 너무 오래 걸려요.',
    number: 'Solution 03',
    description:
      'AI 에이전트가 활동 자료와\n지원 서류를 바탕으로\n경험을 정리해줘요!',
  },
];

const portfolioPoints = [
  {
    label: 'POINT 1.',
    title: '지원 직무 & JD에 적합한 Fit 발굴',
    iconSrc: '/landing/fit-icon.svg',
  },
  {
    label: 'POINT 2.',
    title: '명확한 가이드라인으로 빠른 포트폴리오 개선 가능',
    iconSrc: '/landing/guideline-icon.svg',
  },
  {
    label: 'POINT 3.',
    title: '심층 기업 분석 정보 제공 및 맞춤 첨삭',
    iconSrc: '/landing/analysis-icon.svg',
  },
];

function LoginEntryButton() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (state) => state.sessionRestoreAttempted,
  );

  if (!sessionRestoreAttempted || accessToken != null) return null;

  return (
    <CommonButton
      variantType='Gradient'
      px='2.25rem'
      py='0.75rem'
      onClick={() => router.push('/login')}
    >
      무료로 시작하기 →
    </CommonButton>
  );
}

function ServiceCard({
  title,
  description,
  iconSrc,
  buttonText,
  onClick,
}: ServiceCardProps) {
  return (
    <article className='shadow-chat-card flex min-h-[22rem] w-full flex-col items-center rounded-[1.75rem] bg-[#FCFCFF] px-6 py-8 text-center sm:min-h-[25.125rem] sm:w-[21rem]'>
      <h2 className='text-gray9 text-[1.5rem] leading-[130%] font-bold sm:text-[1.75rem]'>
        {title}
      </h2>
      <Image
        src={iconSrc}
        alt=''
        width={120}
        height={120}
        className='my-6 h-20 w-20 sm:h-[7.5rem] sm:w-[7.5rem]'
      />
      <p className='text-gray9 min-h-[3rem] text-[0.875rem] leading-[150%] sm:text-[1rem]'>
        {description}
      </p>
      <CommonButton
        variantType='Outline'
        px='2.25rem'
        py='0.5rem'
        className='mt-auto text-[0.875rem] sm:text-[1rem]'
        onClick={onClick}
      >
        {buttonText} →
      </CommonButton>
    </article>
  );
}

function JobPreview() {
  return (
    <div
      className='relative h-[18rem] overflow-hidden rounded-[1.25rem] bg-[#EEF0F5] sm:h-[32.5rem]'
      role='img'
      aria-label='직무 찾기 결과 미리보기 이미지 준비 중'
    >
      <div className='absolute top-[10%] left-[5%] h-[72%] w-[31%] rounded-[0.75rem] bg-white/80 p-3 shadow-sm sm:p-5'>
        <div className='h-3 w-12 rounded bg-[#DCE5FF]' />
        <div className='mt-4 h-[46%] rounded-full border border-[#C9D3EE]' />
        <div className='mt-4 space-y-2'>
          <div className='h-2 w-full rounded bg-[#E9EAEC]' />
          <div className='h-2 w-4/5 rounded bg-[#E9EAEC]' />
        </div>
      </div>
      <div className='absolute top-[18%] left-[39%] h-[68%] w-[27%] rounded-[0.75rem] bg-white/75 p-3 shadow-sm sm:p-5'>
        <div className='h-3 w-20 rounded bg-[#DCE5FF]' />
        <div className='mt-4 h-14 rounded-lg bg-[#F6F8FA]' />
        <div className='mt-3 h-10 rounded-lg bg-[#F6F8FA]' />
        <div className='mt-3 h-10 rounded-lg bg-[#F6F8FA]' />
      </div>
      <div className='absolute top-[14%] right-[5%] h-[65%] w-[30%] rounded-[0.75rem] bg-white/75 p-3 shadow-sm sm:p-5'>
        <div className='h-3 w-16 rounded bg-[#DCE5FF]' />
        <div className='mt-4 space-y-3'>
          <div className='h-9 rounded-lg bg-[#F6F8FA]' />
          <div className='h-9 rounded-lg bg-[#F6F8FA]' />
          <div className='h-9 rounded-lg bg-[#F6F8FA]' />
        </div>
      </div>
      <p className='text-gray7 absolute inset-0 flex items-center justify-center text-center text-[1.25rem] font-bold sm:text-[2.625rem]'>
        이미지로 드리겠습니다.
      </p>
    </div>
  );
}

function SolutionCard({
  label,
  number,
  description,
}: (typeof solutionCards)[number]) {
  return (
    <article className='relative flex min-h-[21rem] flex-1 flex-col pt-[5.5rem] sm:min-h-[25rem]'>
      <p className='border-gray3 text-gray9 shadow-chat-card absolute top-0 z-10 flex min-h-[5.5rem] w-full items-center justify-center rounded-[0.75rem] border bg-white px-4 text-center text-[0.9375rem] leading-[150%] sm:text-[1.125rem]'>
        {label}
      </p>
      <div className='shadow-chat-card relative flex min-h-[16.5rem] flex-1 flex-col justify-end overflow-hidden rounded-[1.25rem] bg-[linear-gradient(145deg,#F6F8FF_0%,#CCD9FF_100%)] p-5 sm:min-h-[19.25rem] sm:p-8'>
        <span className='bg-sub1 text-main absolute top-3 left-5 rounded-full px-3 py-1 text-[0.75rem] sm:left-8 sm:text-[0.875rem]'>
          {number}
        </span>
        <span className='absolute top-[-1.875rem] left-1/2 h-[1.875rem] w-px -translate-x-1/2 bg-[#B8C4E7]' />
        <p className='text-gray9 text-[1.125rem] leading-[130%] font-bold whitespace-pre-line sm:text-[1.5rem]'>
          {description}
        </p>
      </div>
    </article>
  );
}

function VideoFeatureCard({
  title,
  description,
  className = '',
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <article
      className={`rounded-[1.25rem] bg-[#E7ECFF] p-4 sm:p-5 ${className}`}
    >
      <h3 className='text-main text-[1.25rem] leading-[130%] font-bold sm:text-[1.75rem]'>
        {title}
      </h3>
      <p className='text-gray6 mt-2 text-[0.8125rem] leading-[150%] sm:text-[1rem]'>
        {description}
      </p>
      <LandingVideo className='mt-5 !h-[12rem] !w-full sm:mt-6 sm:!h-[16.75rem]' />
    </article>
  );
}

export function LandingPageContent() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const navigateWithLoginGuard = (href: string) => {
    if (accessToken) {
      router.push(href);
      return;
    }

    router.push(`/login?redirect_to=${encodeURIComponent(href)}`);
  };

  return (
    <div className='text-gray9 overflow-x-hidden bg-white'>
      <div className='relative'>
        <div
          className='pointer-events-none absolute inset-x-0 top-0 -z-0 h-[118rem] opacity-50 blur-[3.125rem]'
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0) 0%, #C4CCFF 26%, rgba(242,244,255,0.45) 53%, rgba(255,255,255,0) 100%)',
          }}
        />

        <section className='relative z-10 mx-auto max-w-[66rem] px-5 pt-[6.25rem] pb-[9rem] sm:px-0 sm:pt-[6.25rem] sm:pb-[13.75rem]'>
          <div className='flex flex-col items-center text-center'>
            <h1 className='text-[2.25rem] leading-[130%] font-bold tracking-[-0.02em] sm:text-[3rem]'>
              당신의 모든 경험을
              <br />
              무한한 취업 경쟁력으로
            </h1>
            <p className='mt-7 text-[1rem] leading-[150%] font-bold sm:mt-9 sm:text-[1.25rem]'>
              Folioo의 AI 컨설턴트가 당신의 경험과 역량을 가장 효과적으로 활용할
              수 있도록 도와드려요.
            </p>
            <div className='mt-9'>
              <LoginEntryButton />
            </div>
          </div>

          <div className='mt-16 grid grid-cols-1 justify-items-center gap-5 sm:mt-[4.5rem] sm:grid-cols-3 sm:gap-6'>
            <ServiceCard
              title='직무 찾기'
              iconSrc='/landing/job-search-icon.svg'
              description='어렵고 막막한 진로 고민, 3분 테스트로 찾는 나의 직무'
              buttonText='테스트 시작하기'
              onClick={() => navigateWithLoginGuard('/recommendation')}
            />
            <ServiceCard
              title='경험 정리'
              iconSrc='/landing/experience-organize-icon.svg'
              description='흩어진 경험의 기록을 모아 취업 준비의 핵심 자산으로'
              buttonText='경험 정리하기'
              onClick={() => navigateWithLoginGuard('/experience/workspace')}
            />
            <ServiceCard
              title='포트폴리오 첨삭'
              iconSrc='/landing/portfolio-correction-icon.svg'
              description='매번 새로 쓰는 부담 없이, 공고마다 빠르게, 맞춤 전략으로'
              buttonText='첨삭 의뢰하기'
              onClick={() => navigateWithLoginGuard('/correction/new')}
            />
          </div>
        </section>

        <section className='relative z-10 mx-auto max-w-[66rem] px-5 pb-[8rem] sm:px-0 sm:pb-[10rem]'>
          <p className='text-[1.125rem] leading-[130%] font-bold sm:text-[1.25rem]'>
            직무 찾기
          </p>
          <h2 className='mt-7 text-[1.875rem] leading-[130%] font-bold sm:text-[2rem]'>
            어렵고 막막한 진로 고민,
            <br />
            3분 테스트로 찾는 나의 직무
          </h2>
          <CommonButton
            variantType='Gradient'
            px='2.25rem'
            py='0.75rem'
            className='mt-8'
            onClick={() => navigateWithLoginGuard('/recommendation')}
          >
            테스트 시작하기 →
          </CommonButton>

          <div className='mt-14 grid items-center gap-8 sm:mt-16 sm:grid-cols-[minmax(0,43.75rem)_1fr] sm:gap-[5.5rem]'>
            <JobPreview />
            <div>
              <ol className='text-gray9 space-y-2 text-[1rem] leading-[150%] sm:text-[1.125rem]'>
                <li>01 전공 선택</li>
                <li>02 흥미 유형 검사</li>
                <li>03 근무 조건 밸런스게임</li>
              </ol>
              <p className='mt-6 text-[1.5rem] leading-[130%] font-bold sm:text-[2rem]'>
                3단계 테스트로 3분 만에!
              </p>
              <p className='mt-16 text-[1.25rem] leading-[130%] font-bold sm:mt-[5.75rem] sm:text-[1.5rem]'>
                나의 성향에 딱 맞는 직무와
                <br />
                기업 형태를 찾아보세요.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className='bg-[#E6E9FF]/30 py-[7.5rem] sm:py-[10rem]'>
        <div className='mx-auto max-w-[66rem] px-5 sm:px-0'>
          <p className='text-[1.125rem] leading-[130%] font-bold sm:text-[1.25rem]'>
            경험 정리
          </p>
          <h2 className='mt-7 text-[1.875rem] leading-[130%] font-bold sm:text-[2rem]'>
            흩어진 경험의 기록을 모아
            <br />
            취업 준비의 핵심 자산으로
          </h2>
          <CommonButton
            variantType='Gradient'
            px='2.25rem'
            py='0.75rem'
            className='mt-8'
            onClick={() => navigateWithLoginGuard('/experience/workspace')}
          >
            경험 정리하기 →
          </CommonButton>

          <div className='mt-16 grid gap-9 sm:mt-[5.75rem] sm:grid-cols-3 sm:gap-[2.75rem]'>
            {solutionCards.map((card) => (
              <SolutionCard key={card.number} {...card} />
            ))}
          </div>

          <div className='mt-16 grid gap-6 sm:mt-[5.75rem] sm:grid-cols-2'>
            <VideoFeatureCard
              title='템플릿을 활용해 체계적으로'
              description='준비된 템플릿을 통해, 누구나 체계적으로 정리할 수 있어요.'
            />
            <VideoFeatureCard
              title='AI 에이전트와 쉽고, 빠르게'
              description='AI 에이전트가 자료를 분석하여 경험을 정리해줘요.'
            />
            <VideoFeatureCard
              className='sm:col-span-2'
              title='나의 경험을 구조적으로 볼 수 있는 두 가지 뷰'
              description='맵 뷰로 경험의 구조를 한눈에 파악하고, 리스트 뷰로 경험을 깊이 있게 정리해요.'
            />
          </div>
        </div>
      </section>

      <section className='relative overflow-hidden py-[7.5rem] sm:py-[10rem]'>
        <div
          className='pointer-events-none absolute inset-x-0 top-0 h-[48rem] opacity-50 blur-[3.125rem]'
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0) 0%, #C4CCFF 46%, rgba(242,244,255,0.55) 86%, rgba(255,255,255,0) 100%)',
          }}
        />
        <div className='relative mx-auto max-w-[66rem] px-5 sm:px-0'>
          <p className='text-[1.125rem] leading-[130%] font-bold sm:text-[1.25rem]'>
            포트폴리오 첨삭
          </p>
          <h2 className='mt-7 text-[1.875rem] leading-[130%] font-bold sm:text-[2rem]'>
            매번 새로 쓰는 부담 없이,
            <br />
            공고마다 빠르게, 맞춤 전략으로
          </h2>
          <div className='mt-8'>
            <StartCorrectionButton>첨삭 의뢰하기 →</StartCorrectionButton>
          </div>

          <div className='relative mt-24 min-h-[19rem] sm:mt-[8.75rem] sm:min-h-[25rem]'>
            <div className='absolute top-0 left-[5%] h-20 w-[70%] rounded-full border border-white/70 bg-white/55 blur-[1px] sm:left-[6rem] sm:h-[5.5rem] sm:w-[23.625rem]' />
            <p className='absolute top-6 left-[10%] max-w-[19rem] text-[0.9375rem] leading-[150%] sm:top-8 sm:left-[12.5rem] sm:max-w-[28rem] sm:text-[1rem]'>
              특정 직무에 적합한 활동을 주로 했는데, 막상 취업 시장에 나와보니
              다른 직무도 지원할 수밖에 없어요.
            </p>
            <div className='shadow-chat-card absolute top-28 right-[2%] h-24 w-[78%] rounded-full border border-white/70 bg-white/75 sm:top-[5.5rem] sm:right-[2rem] sm:h-[7.375rem] sm:w-[40.5rem]' />
            <p className='absolute top-[8.75rem] right-[7%] max-w-[22rem] text-[0.9375rem] leading-[150%] sm:top-[7.5rem] sm:right-[7.5rem] sm:max-w-[30.5rem] sm:text-[1rem]'>
              포트폴리오 하나로 여러 직무와 기업에 지원하니 경쟁력이 떨어지지만,
              공고마다 새로 포트폴리오를 쓰기에는 시간이 너무 오래 걸려요.
            </p>
          </div>

          <div className='mx-auto max-w-[46.25rem] text-center'>
            <h3 className='text-[1.75rem] leading-[130%] font-bold sm:text-[2rem]'>
              AI 컨설턴트가 제공하는
              <br />
              지원 상황에 최적화된 첨삭 보고서로 해결하세요.
            </h3>
            <div className='mt-12 space-y-4 sm:mt-16 sm:space-y-6'>
              {portfolioPoints.map((point) => (
                <article
                  key={point.label}
                  className='border-gray3 shadow-chat-card flex min-h-[7rem] items-center justify-between rounded-[1.25rem] border bg-white px-5 py-4 text-left sm:min-h-[9.4375rem] sm:px-10'
                >
                  <div>
                    <p className='text-gray6 text-[0.875rem] leading-[150%] sm:text-[1rem]'>
                      <span className='mr-2 inline-flex h-4 w-4 items-center justify-center rounded-sm bg-[#7890E9] text-[0.625rem] text-white'>
                        ✓
                      </span>
                      {point.label}
                    </p>
                    <p className='text-main mt-2 text-[1.125rem] leading-[130%] font-bold sm:text-[1.5rem]'>
                      {point.title}
                    </p>
                  </div>
                  <Image
                    src={point.iconSrc}
                    alt=''
                    width={95}
                    height={95}
                    className='h-12 w-12 shrink-0 sm:h-[5.9375rem] sm:w-[5.9375rem]'
                  />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
