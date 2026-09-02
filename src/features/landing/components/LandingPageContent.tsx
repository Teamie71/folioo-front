'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

const correctionSteps = [
  {
    eyebrow: 'STEP 01',
    title: '지원 정보',
    description: '기업과 직무, JD를 입력하여 맞춤 첨삭을 시작하세요.',
  },
  {
    eyebrow: 'STEP 02',
    title: '포트폴리오 업로드',
    description:
      '가지고 있는 PDF 포트폴리오를 업로드하면, AI 컨설턴트가 문서의 구조와 내용을 빠짐없이 파악하여 첨삭을 준비해요.',
  },
  {
    eyebrow: 'STEP 03',
    title: '기업 분석',
    description:
      'AI 컨설턴트가 최신 정보를 반영하여 지원하는 기업의 심층 분석 자료를 생성해요. 강조할 부분을 정해주시면, 참고하여 첨삭을 진행할게요.',
  },
  {
    eyebrow: 'STEP 04',
    title: '첨삭 결과',
    description:
      '총평과 구체적인 개선 방향이 제시된 지원 맞춤 첨삭 보고서를 받아보세요! 수정 예시를 함께 제공하여, 가이드대로 고치기만 하면 바로 서류가 완성돼요.',
  },
];

const faqs = [
  {
    question: 'Folioo는 어떤 서비스인가요?',
    answer:
      'Folioo는 취업 준비 과정 전반을 보조하는 AI 커리어 솔루션이에요. AI를 중심으로 재편된 채용 환경에서, 취업준비생이 서류화의 부담에서 벗어나 온전히 경험과 성장에만 몰입하는 환경을 만들고자 서비스를 시작하게 되었어요. 모든 취업준비생이 자신의 경험을 구체적인 데이터로 소유하고, 언제든 가장 매력적인 형태로 증명할 수 있게 되는 것을 목표로 하고 있어요.',
  },
  {
    question: 'Folioo는 취업 준비의 어느 단계에서 쓰면 좋은가요?',
    answer:
      'Folioo의 세 기능은 취업 준비의 전체 단계에서 사용할 수 있어요. 희망 직무를 고민하고 있다면 3분 테스트로 성향에 맞는 직무와 기업 형태를 찾고, 경험을 쌓는 과정에서는 경험 정리 기능으로 기록을 체계화해 보세요. 실제 공고에 지원할 때는 AI 컨설턴트의 첨삭 가이드를 활용해 공고 맞춤형 서류를 빠르게 완성할 수 있어요.',
  },
  {
    question: '직무를 정하지 못한 상황에서도 Folioo가 도움이 되나요?',
    answer:
      '네, 직무 찾기 기능이 막막한 진로 고민의 해결을 도와드려요. 3분 만에 끝나는 간단한 테스트로 전공, 흥미 유형, 선호 근무 조건을 분석해 적합도가 높은 직무와 기업 형태를 소개해 드려요. 핵심 스킬과 추천 활동 정보도 함께 제공해 쉽게 취업 준비를 시작할 수 있어요.',
  },
  {
    question: '경험 정리는 어떤 상황에서 필요한가요?',
    answer:
      '경험을 쌓고 있는 대학생과 실제 지원을 앞둔 취업준비생 모두에게 필요해요. 작은 경험도 바로 구조에 맞춰 기록해두면 나를 증명하는 구체적인 스토리로 활용할 수 있고, 채용 시즌에는 이력서·자기소개서·포트폴리오·면접을 더 빠르고 밀도 있게 준비할 수 있어요.',
  },
  {
    question: '포트폴리오 첨삭 기능은 어떤 상황에서 도움이 되나요?',
    answer:
      '여러 공고에 실제로 지원하면서 서류 작성에 많은 시간을 쓰고 있다면 활용해 보세요. 지원 공고와 기존 포트폴리오를 업로드하면 AI 컨설턴트가 두 자료와 기업 정보를 분석하고, 수정 예시가 포함된 맞춤 첨삭 가이드를 제공해요.',
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
  mediaCount = 1,
}: {
  title: string;
  description: string;
  className?: string;
  mediaCount?: 1 | 2;
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
      <div
        className={`mt-5 grid gap-4 sm:mt-6 ${
          mediaCount === 2 ? 'sm:grid-cols-2' : ''
        }`}
      >
        {Array.from({ length: mediaCount }, (_, index) => (
          <LandingVideo
            key={index}
            className='!h-[12rem] !w-full sm:!h-[16.75rem]'
          />
        ))}
      </div>
    </article>
  );
}

function CorrectionWorkflow() {
  const [activeStep, setActiveStep] = useState(0);
  const step = correctionSteps[activeStep];

  const moveStep = (direction: -1 | 1) => {
    setActiveStep(
      (current) =>
        (current + direction + correctionSteps.length) % correctionSteps.length,
    );
  };

  return (
    <section className='mx-auto max-w-[66rem] px-5 py-[7.5rem] sm:px-0 sm:py-[13.75rem]'>
      <p className='text-gray6 text-center text-[1.125rem] leading-[130%] font-bold sm:text-[1.25rem]'>
        How It Works
      </p>
      <div
        className='border-gray3 mt-8 grid grid-cols-2 border-b sm:mt-[3.75rem] sm:grid-cols-4'
        role='tablist'
        aria-label='포트폴리오 첨삭 단계'
      >
        {correctionSteps.map((item, index) => {
          const isActive = index === activeStep;

          return (
            <button
              key={item.eyebrow}
              type='button'
              role='tab'
              aria-selected={isActive}
              className={`border-b-2 px-3 pt-3 pb-4 text-center transition-colors sm:px-6 sm:pt-3 sm:pb-5 ${
                isActive
                  ? 'border-main text-main'
                  : 'text-gray4 hover:text-gray6 border-transparent'
              }`}
              onClick={() => setActiveStep(index)}
            >
              <span className='block text-[0.75rem] leading-[150%] sm:text-[0.875rem]'>
                {item.eyebrow}
              </span>
              <span className='mt-1 block text-[0.9375rem] leading-[130%] font-bold sm:mt-2 sm:text-[1.25rem]'>
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
      <p className='text-gray9 mx-auto mt-7 max-w-[37.5rem] text-center text-[1rem] leading-[150%] sm:mt-10 sm:text-[1.125rem]'>
        {step.description}
      </p>
      <div className='relative mt-8 flex items-center gap-3 sm:mt-11 sm:gap-14'>
        <button
          type='button'
          aria-label='이전 첨삭 단계'
          className='shrink-0 transition-transform hover:-translate-x-0.5'
          onClick={() => moveStep(-1)}
        >
          <Image
            src='/landing/workflow-arrow-left.svg'
            alt=''
            width={44}
            height={44}
            className='h-9 w-9 sm:h-11 sm:w-11'
          />
        </button>
        <LandingVideo className='!h-[15rem] !w-full sm:!h-[37.125rem]' />
        <button
          type='button'
          aria-label='다음 첨삭 단계'
          className='shrink-0 transition-transform hover:translate-x-0.5'
          onClick={() => moveStep(1)}
        >
          <Image
            src='/landing/workflow-arrow-left.svg'
            alt=''
            width={44}
            height={44}
            className='h-9 w-9 rotate-180 sm:h-11 sm:w-11'
          />
        </button>
      </div>
    </section>
  );
}

function LandingFaq() {
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);

  return (
    <section className='mx-auto max-w-[66rem] px-5 pb-[8rem] sm:px-0 sm:pb-[10rem]'>
      <p className='text-main text-center text-[1.125rem] leading-[130%] font-bold sm:text-[1.25rem]'>
        FAQ
      </p>
      <h2 className='mt-3 text-center text-[1.875rem] leading-[130%] font-bold sm:text-[2rem]'>
        자주 묻는 질문
      </h2>
      <div className='mt-12 space-y-4 sm:mt-[5rem] sm:space-y-5'>
        {faqs.map((faq, index) => {
          const isOpen = openedIndex === index;

          return (
            <article
              key={faq.question}
              className='rounded-[1rem] bg-[#F6F8FF] transition-colors hover:bg-white'
            >
              <button
                type='button'
                className='flex w-full items-center gap-3 px-5 py-6 text-left sm:px-8 sm:py-8'
                aria-expanded={isOpen}
                onClick={() => setOpenedIndex(isOpen ? null : index)}
              >
                <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#647BE1] text-[0.875rem] font-bold text-white'>
                  {index + 1}
                </span>
                <span className='flex-1 text-[1rem] leading-[150%] font-bold sm:text-[1.125rem]'>
                  {faq.question}
                </span>
                <span
                  aria-hidden
                  className={`text-gray5 text-[1.5rem] leading-none transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  ⌄
                </span>
              </button>
              {isOpen && (
                <p className='border-gray3 text-gray7 border-t px-5 py-6 text-[0.9375rem] leading-[170%] sm:px-8 sm:py-8 sm:text-[1rem]'>
                  {faq.answer}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
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
              mediaCount={2}
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

      <CorrectionWorkflow />
      <LandingFaq />

      <section className='relative overflow-hidden py-[7.5rem] sm:py-[10rem]'>
        <div
          className='pointer-events-none absolute inset-x-0 bottom-[-18rem] h-[58rem] opacity-45 blur-[4rem]'
          style={{
            background:
              'radial-gradient(ellipse at center, #5060C5 0%, #93B3F4 32%, rgba(255,255,255,0) 70%)',
          }}
        />
        <div className='relative flex flex-col items-center text-center'>
          <h2 className='text-[2.25rem] leading-[130%] font-bold sm:text-[3rem]'>
            지금,
            <br />
            경험을 서류로 바꾸세요.
          </h2>
          <div className='mt-10 sm:mt-[3.75rem]'>
            <LoginEntryButton />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
