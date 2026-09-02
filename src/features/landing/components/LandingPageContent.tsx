'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { type ReactNode, useState } from 'react';
import { CommonButton } from '@/components/CommonButton';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/useAuthStore';
import { useRecommendationTestStore } from '@/store/useRecommendationTestStore';
import { LandingVideo } from './LandingVideo';
import { PortfoliloPoints } from './PortfolioPoints';
import { StartCorrectionButton } from './StartCorrectionButton';

type ServiceCardProps = {
  title: string;
  description: string;
  iconSrc: string;
  iconClassName?: string;
  buttonText: string;
  onClick: () => void;
  onCardClick?: () => void;
};

type SolutionConnector = 'single' | 'dual-center' | 'dual-right';

const solutionCards = [
  {
    label: '지원 서류에 쓸 내용이 없어요.',
    number: 'Solution 01',
    description: '경험 정리를 해두면,\n어떤 서류든 문제 없어요!',
    connector: 'single' as const,
    gradient: 'linear-gradient(45.280686deg, #CCDBFF 1.0308%, #F6F8FF 98.969%)',
  },
  {
    label: '경험 정리하는 방법을 모르겠어요.',
    number: 'Solution 02',
    description: '카테고리별 템플릿으로\n체계적으로 정리하세요!',
    connector: 'dual-center' as const,
    gradient:
      'linear-gradient(161.758259deg, #CCDBFF 8.8394%, #F6F8FF 91.161%)',
  },
  {
    label: '정리하는 시간이 너무 오래 걸려요.',
    number: 'Solution 03',
    description:
      'AI 에이전트가 활동 자료와\n지원 서류를 바탕으로\n경험을 정리해줘요!',
    connector: 'dual-right' as const,
    gradient: 'linear-gradient(-64.14626deg, #CCDBFF 15.769%, #F6F8FF 98.691%)',
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

type Faq = {
  question: string;
  numberIconSrc: string;
  answer: ReactNode;
};

const faqs: Faq[] = [
  {
    question: 'Folioo는 어떤 서비스인가요?',
    numberIconSrc: '/landing/faq-number-1.svg',
    answer: (
      <div>
        <p>
          Folioo는{' '}
          <strong>취업 준비 과정 전반을 보조하는 AI 커리어 솔루션</strong>
          {'이에요.'}
        </p>
        <p>
          AI를 중심으로 재편된 채용 환경에서,{' '}
          <strong>
            취업준비생이 서류화의 부담에서 벗어나 온전히 경험과 성장에만
            몰입하는 환경
          </strong>
          을
        </p>
        <p>만들고자 서비스를 시작하게 되었어요.</p>
        <p>
          모든 취업준비생이 자신의 경험을 구체적인 데이터로 소유하고, 언제든
          가장 매력적인 형태로 증명할 수 있게 되는 것을
        </p>
        <p>목표로 하고 있어요.</p>
      </div>
    ),
  },
  {
    question: 'Folioo는 취업 준비의 어느 단계에서 쓰면 좋은가요?',
    numberIconSrc: '/landing/faq-number-2.svg',
    answer: (
      <div>
        <p>
          Folioo의 세 기능은 <strong>취업 준비의 전체 단계</strong>에서 사용할
          수 있어요.
        </p>
        <div className='h-6 sm:h-[1.875rem]' />
        <p>
          먼저,{' '}
          <strong>본격적으로 경험과 스펙을 쌓기 전, 희망 직무를 고민</strong>
          {'하고 있다면 '}
          <strong>직무 찾기</strong> 기능을 사용해 보세요. 3분 만에
        </p>
        <p>
          진행되는 간단한 테스트를 통해 나의 성향을 파악하고, 가장 적합한 직무와
          기업 형태를 찾을 수 있어요.
        </p>
        <div className='h-6 sm:h-[1.875rem]' />
        <p>
          다음으로, <strong>경험을 쌓는 과정</strong>에서는 이를{' '}
          <strong>체계적으로 기록</strong>할 수 있는 <strong>경험 정리</strong>{' '}
          기능을 사용해 보세요. 사소한 경험도
        </p>
        <p>
          체계적으로 정리해두면 이력서, 자기소개서, 포트폴리오, 면접까지
          채용사이클 전체에서 활용 가능한 핵심 자산이 돼요.
        </p>
        <p>
          시간이 지나면 기억이 소실되기 때문에, 구체적인 기록을 위해서는 경험을
          쌓으면서 바로바로 정리하는 것을 추천해요.
        </p>
        <div className='h-6 sm:h-[1.875rem]' />
        <p>
          마지막으로, 실제로 <strong>공고에 지원하는 과정</strong>에서는{' '}
          <strong>포트폴리오 첨삭</strong> 기능을 사용해 보세요. AI 컨설턴트의
          첨삭 가이드를
        </p>
        <p>활용하면 여러 개의 공고에 맞춤형 서류로 빠르게 지원할 수 있어요.</p>
      </div>
    ),
  },
  {
    question: '직무를 정하지 못한 상황에서도 Folioo가 도움이 되나요?',
    numberIconSrc: '/landing/faq-number-3.svg',
    answer: (
      <div>
        <p>
          네, Folioo의 <strong>직무 찾기</strong> 기능이{' '}
          <strong>막막한 직무 고민의 해결</strong>을 도와드려요.
        </p>
        <p>
          어떤 직무가 나에게 잘 맞을지, 어떤 기업 형태가 나의 조건에 가장
          부합할지, 목표를 설정하지 못해 고민 중이신
        </p>
        <p>분들에게 유용해요.</p>
        <div className='h-6 sm:h-[1.875rem]' />
        <p>
          <strong>3분 만에 끝나는 간단한 테스트</strong>를 진행하면 나의 전공,
          흥미 유형, 선호 근무 조건을 파악하고 분석해요.
        </p>
        <p>
          분석된 결과를 바탕으로{' '}
          <strong>적합도가 가장 높은 직무 3가지와 기업 형태 1가지</strong>를
          발굴하여 소개해 드려요.
        </p>
        <p>
          딱 맞는 직무에 바로 도전할 수 있도록 핵심 스킬과 추천 활동 정보까지
          제공해서, 누구나 쉽게 취업 준비를 시작할
        </p>
        <p>수 있어요.</p>
      </div>
    ),
  },
  {
    question: '경험 정리는 어떤 상황에서 필요한가요?',
    numberIconSrc: '/landing/faq-number-4.svg',
    answer: (
      <div>
        <p>두 가지 상황에 경험 정리를 강력하게 추천해요!</p>
        <div className='h-6 sm:h-[1.875rem]' />
        <p>
          먼저, 아직{' '}
          <strong>
            실제 공고에 지원하고 있지는 않지만 취업 준비를 위해 경험을 쌓고 있는
            대학생
          </strong>
          {'에게 필요해요. 경험을 쌓는'}
        </p>
        <p>
          것도 중요하지만, 이를 채용 전형에서 제대로 활용하기 위해서는
          체계적이고 구체적인 기록이 필수적이기 때문이에요.
        </p>
        <p>
          작은 경험이라도 바로바로 경험 정리 기능의 구조에 맞게 정리해두면, 나를
          증명하는 구체적인 스토리로 활용할 수 있어요.
        </p>
        <div className='h-6 sm:h-[1.875rem]' />
        <p>
          다음으로, <strong>실제 공고에 지원을 앞두고 있는 취업준비생</strong>
          {'에게 필요해요. 상/하반기 채용 시즌이 시작되고 나면 서류 전형,'}
        </p>
        <p>
          인적성 검사, 각종 과제 및 면접 전형 등을 수행하느라 시간이 많이
          부족해져요. 본격적인 채용 시즌이 시작되기 전에
        </p>
        <p>
          가진 경험을 꼼꼼하게 정리해두면, 각각의 전형을 준비하는 과정은 줄이고,
          퀄리티는 높일 수 있어요.
        </p>
        <div className='h-6 sm:h-[1.875rem]' />
        <p>
          Folioo에서 제공하는 <strong>템플릿</strong>을 활용하면 나의 경험을
          체계적으로 정리할 수 있어요. 지원 서류나 활동 자료를 업로드하면
        </p>
        <p>
          <strong>AI 에이전트</strong>가 이를 분석하여 빠르게 경험을 정리해줘요.
        </p>
      </div>
    ),
  },
  {
    question: '포트폴리오 첨삭 기능은 어떤 상황에서 도움이 되나요?',
    numberIconSrc: '/landing/faq-number-5.svg',
    answer: (
      <div>
        <p>
          <strong>
            여러 공고에 실제로 지원하는 과정에서 서류 작성에 많은 시간을 사용
          </strong>
          {'하고 있다면 '}
          <strong>포트폴리오 첨삭</strong> 기능을 활용해 보세요.
        </p>
        <div className='h-6 sm:h-[1.875rem]' />
        <p>
          지원하고자 하는 공고와 기존에 만들어둔 포트폴리오를 업로드하면 AI
          컨설턴트가 공고와 포트폴리오를 분석해요.
        </p>
        <p>
          분석한 정보와 생성한 기업 분석 정보를 바탕으로{' '}
          <strong>맞춤 첨삭 가이드</strong>를 제공해요.
        </p>
        <p>
          수정 예시가 포함된 첨삭 가이드를 반영하여{' '}
          <strong>공고 적합도가 높은 포트폴리오를 빠르게 제출</strong>할 수
          있어요.
        </p>
      </div>
    ),
  },
];

function LoginEntryButton({
  children = '무료로 시작하기 →',
}: {
  children?: string;
}) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  return (
    <CommonButton
      variantType='Gradient'
      px='2.25rem'
      py='0.75rem'
      className='leading-[150%] font-bold'
      onClick={() => router.push(accessToken ? '/recommendation' : '/login')}
    >
      {children}
    </CommonButton>
  );
}

function ServiceCard({
  title,
  description,
  iconSrc,
  iconClassName = 'h-full w-full',
  buttonText,
  onClick,
  onCardClick,
}: ServiceCardProps) {
  return (
    <article className='shadow-chat-card relative flex min-h-[22rem] w-full flex-col items-center rounded-[1.75rem] bg-[#FCFCFF] px-6 py-8 text-center sm:min-h-[25.125rem] sm:w-[21rem] sm:p-10'>
      {onCardClick && (
        <button
          type='button'
          aria-label={`${title} 소개로 이동`}
          className='absolute inset-0 z-0 cursor-pointer rounded-[1.75rem]'
          onClick={onCardClick}
        />
      )}
      <div
        className={`relative z-10 flex w-full flex-col items-center ${
          onCardClick ? 'pointer-events-none' : ''
        }`}
      >
        <h2 className='text-gray9 text-[1.5rem] leading-[130%] font-bold sm:text-[1.75rem]'>
          {title}
        </h2>
        <div className='my-6 flex h-20 w-20 items-center justify-center sm:h-[7.5rem] sm:w-[7.5rem]'>
          <Image
            src={iconSrc}
            alt=''
            width={120}
            height={120}
            className={iconClassName}
          />
        </div>
        <p className='text-gray9 min-h-[3rem] text-[0.875rem] leading-[150%] whitespace-pre-line sm:text-[1rem]'>
          {description}
        </p>
      </div>
      <CommonButton
        variantType='Outline'
        px='2.25rem'
        py='0.5rem'
        className='relative z-10 mt-auto border text-[0.875rem] font-bold sm:text-[1rem]'
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
      className='relative h-[18rem] overflow-hidden bg-[#EEF0F5] sm:h-[32.5rem]'
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

function SolutionCardConnector({ type }: { type: SolutionConnector }) {
  if (type === 'single') {
    return (
      <div className='absolute -top-5 left-1/2 z-10 h-[2.2708rem] w-[0.6667rem] -translate-x-1/2'>
        <Image
          src='/landing/solution-connector-single.svg'
          alt=''
          width={36.3333}
          height={10.6667}
          className='absolute top-1/2 left-1/2 h-[0.6667rem] w-[2.2708rem] max-w-none'
          style={{ transform: 'translate(-50%, -50%) rotate(-90deg)' }}
        />
      </div>
    );
  }

  return (
    <Image
      src='/landing/solution-connector-dual.svg'
      alt=''
      width={270.667}
      height={36.3333}
      className='absolute -top-5 left-[1.6667rem] z-10 h-[2.2708rem] w-[16.9167rem]'
    />
  );
}

function SolutionCard({
  label,
  number,
  description,
  connector,
  gradient,
}: (typeof solutionCards)[number]) {
  return (
    <article className='relative flex min-h-[23.25rem] flex-1 flex-col pt-[6.75rem] sm:min-h-[26rem]'>
      <p className='border-gray3 text-gray9 shadow-chat-card absolute top-0 z-20 flex min-h-[5.5rem] w-full items-center justify-center rounded-[0.75rem] border bg-[#FDFDFD] px-4 text-center text-[0.9375rem] leading-[150%] sm:text-[1.125rem]'>
        {label}
      </p>
      <div className='shadow-chat-card relative flex min-h-[16.5rem] flex-1 flex-col justify-end rounded-[1.25rem] p-5 sm:min-h-[19.25rem] sm:p-8'>
        <div
          aria-hidden
          className='absolute inset-0 rounded-[inherit] opacity-80'
          style={{ background: gradient }}
        />
        <SolutionCardConnector type={connector} />
        <span className='bg-sub1 text-main absolute top-7 left-5 z-10 rounded-full px-3 py-1 text-[0.75rem] sm:left-8 sm:text-[0.875rem]'>
          {number}
        </span>
        <p className='text-gray9 relative z-10 mt-auto text-[1.125rem] leading-[130%] font-bold whitespace-pre-line sm:text-[1.5rem]'>
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
  const isSplitView = mediaCount === 2;

  return (
    <article
      className={`relative overflow-hidden rounded-[1.25rem] p-4 sm:px-9 sm:pt-7 sm:pb-5 ${
        isSplitView ? 'sm:h-[26.5625rem]' : 'sm:h-[25.875rem]'
      } ${className}`}
    >
      <div
        aria-hidden
        className='absolute inset-0 rounded-[inherit] bg-gradient-to-b from-[#CCDBFF] to-[#F6F8FF] opacity-30 shadow-[0_4px_8px_0_rgba(0,0,0,0.1)]'
      >
        <div className='absolute inset-0 rounded-[inherit] shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1)]' />
      </div>
      <h3 className='text-main relative text-[1.25rem] leading-[130%] font-bold sm:text-[1.75rem]'>
        {title}
      </h3>
      <p className='text-gray6 relative mt-2 text-[0.8125rem] leading-[150%] sm:text-[1.125rem]'>
        {description}
      </p>
      <div
        className={`relative mt-5 grid gap-4 sm:-mx-4 sm:mt-7 ${
          isSplitView ? 'sm:grid-cols-2 sm:gap-7' : ''
        }`}
      >
        {Array.from({ length: mediaCount }, (_, index) => (
          <LandingVideo
            key={index}
            className={`!h-[12rem] !w-full ${
              isSplitView ? 'sm:!h-[17.375rem]' : 'sm:!h-[16.6875rem]'
            }`}
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
        className='mt-8 grid grid-cols-2 sm:mt-10 sm:grid-cols-4'
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
              className={`cursor-pointer border-b-4 px-3 py-3 text-center sm:px-6 ${
                isActive ? 'border-main text-main' : 'border-gray3 text-gray4'
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
      <p className='mx-auto mt-7 flex h-[3rem] max-w-[37.5rem] items-center justify-center text-center text-[1rem] leading-[150%] text-black sm:mt-10 sm:h-[3.375rem] sm:text-[1.125rem]'>
        {step.description}
      </p>
      <div className='relative mt-8 flex items-center gap-3 sm:mt-11 sm:block'>
        <button
          type='button'
          aria-label='이전 첨삭 단계'
          className='z-10 shrink-0 cursor-pointer transition-transform hover:-translate-x-0.5 sm:absolute sm:top-1/2 sm:-left-[4.25rem] sm:-translate-y-1/2'
          onClick={() => moveStep(-1)}
        >
          <span className='relative block h-9 w-9 sm:h-11 sm:w-11'>
            <Image
              src='/landing/workflow-arrow-left.svg?v=2'
              alt=''
              width={52}
              height={52}
              className='absolute -top-[4.55%] -left-[9.09%] h-[118.18%] w-[118.18%] max-w-none'
            />
          </span>
        </button>
        <LandingVideo className='!h-[15rem] !w-full !rounded-none sm:!h-[37.125rem]' />
        <button
          type='button'
          aria-label='다음 첨삭 단계'
          className='z-10 shrink-0 cursor-pointer transition-transform hover:translate-x-0.5 sm:absolute sm:top-1/2 sm:-right-[4.25rem] sm:-translate-y-1/2 2xl:-right-[7rem]'
          onClick={() => moveStep(1)}
        >
          <span className='relative block h-9 w-9 sm:h-11 sm:w-11'>
            <Image
              src='/landing/workflow-arrow-right.svg?v=2'
              alt=''
              width={52}
              height={52}
              className='absolute -top-[4.55%] -left-[9.09%] h-[118.18%] w-[118.18%] max-w-none'
            />
          </span>
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
              className={`relative cursor-pointer rounded-[1rem] px-5 py-6 transition-colors sm:rounded-[1.25rem] sm:px-10 sm:py-7 ${
                isOpen
                  ? 'bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.04),inset_0px_2px_4px_0px_rgba(0,0,0,0.04)]'
                  : 'bg-gradient-to-r from-[#CCDDFF]/30 to-[#F6F8FF]/30 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.04),inset_0px_2px_4px_0px_rgba(0,0,0,0.04)] hover:from-white hover:to-white'
              }`}
              onClick={() => setOpenedIndex(isOpen ? null : index)}
            >
              <button
                type='button'
                className='relative z-10 flex w-full cursor-pointer items-center gap-3 text-left sm:gap-4'
                aria-expanded={isOpen}
              >
                <Image
                  src={faq.numberIconSrc}
                  alt=''
                  aria-hidden
                  width={28}
                  height={28}
                  className='h-6 w-6 shrink-0 sm:h-7 sm:w-7'
                />
                <span className='flex-1 text-[1rem] leading-[130%] font-bold text-[#1A1A1A] sm:text-[1.25rem]'>
                  {faq.question}
                </span>
                <Image
                  src='/landing/faq-dropdown.svg'
                  alt=''
                  aria-hidden
                  width={40}
                  height={40}
                  className={`h-10 w-10 shrink-0 transition-transform ${
                    isOpen ? '' : 'rotate-180'
                  }`}
                />
              </button>
              {isOpen && (
                <div className='relative z-10 mt-6 text-[1rem] leading-[150%] font-medium text-[#1A1A1A] sm:mt-7 sm:text-[1.25rem]'>
                  {faq.answer}
                </div>
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
  const hasSavedRecommendationResult = useRecommendationTestStore(
    (state) => state.hasSavedResult,
  );

  const navigateWithLoginGuard = (href: string) => {
    if (accessToken) {
      router.push(href);
      return;
    }

    router.push(`/login?redirect_to=${encodeURIComponent(href)}`);
  };

  const navigateToRecommendation = () => {
    router.push(
      accessToken && hasSavedRecommendationResult
        ? '/recommendation/result'
        : '/recommendation',
    );
  };

  const scrollToIntroduction = (sectionId: string) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className='text-gray9 overflow-x-hidden bg-white tracking-normal'>
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
            <h1 className='text-[2.25rem] leading-[130%] font-bold sm:text-[3rem]'>
              당신의 모든 경험을
              <br />
              무한한 취업 경쟁력으로
            </h1>
            <p className='mt-7 text-[1rem] leading-[130%] font-bold sm:mt-[3.125rem] sm:text-[1.25rem]'>
              Folioo의 AI 컨설턴트가 당신의 경험과 역량을 가장 효과적으로 활용할
              수 있도록 도와드려요.
            </p>
            <div className='mt-9 sm:mt-[3.25rem]'>
              <LoginEntryButton />
            </div>
          </div>

          <div className='mt-16 grid grid-cols-1 justify-items-center gap-5 sm:mt-[4.5rem] sm:grid-cols-3 sm:gap-6'>
            <ServiceCard
              title='직무 찾기'
              iconSrc='/landing/job-search-icon.svg'
              description={
                '어렵고 막막한 진로 고민,\n3분 테스트로 찾는 나의 직무'
              }
              buttonText='테스트 시작하기'
              onClick={navigateToRecommendation}
              onCardClick={() =>
                scrollToIntroduction('job-search-introduction')
              }
            />
            <ServiceCard
              title='경험 정리'
              iconSrc='/landing/experience-organize-icon.svg'
              iconClassName='h-[61.111%] w-[71.667%] opacity-75'
              description={
                '흩어진 경험의 기록을 모아\n취업 준비의 핵심 자산으로'
              }
              buttonText='경험 정리하기'
              onClick={() => navigateWithLoginGuard('/experience/workspace')}
              onCardClick={() =>
                scrollToIntroduction('experience-organization-introduction')
              }
            />
            <ServiceCard
              title='포트폴리오 첨삭'
              iconSrc='/landing/portfolio-correction-icon.svg'
              description={
                '매번 새로 쓰는 부담 없이,\n공고마다 빠르게, 맞춤 전략으로'
              }
              buttonText='첨삭 의뢰하기'
              onClick={() => navigateWithLoginGuard('/correction/new')}
              onCardClick={() =>
                scrollToIntroduction('portfolio-correction-introduction')
              }
            />
          </div>
        </section>

        <section
          id='job-search-introduction'
          className='relative z-10 mx-auto max-w-[66rem] scroll-mt-[9.5rem] px-5 pb-[8rem] sm:scroll-mt-[12.5rem] sm:px-0 sm:pb-[10rem]'
        >
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
            onClick={navigateToRecommendation}
          >
            테스트 시작하기 →
          </CommonButton>

          <div className='mt-14 grid items-center gap-8 sm:mt-16 sm:grid-cols-[minmax(0,43.75rem)_1fr] sm:gap-[5.5rem]'>
            <JobPreview />
            <div className='relative sm:translate-y-[0.8125rem] sm:pl-5'>
              <Image
                src='/landing/job-preview-divider.svg'
                alt=''
                width={8}
                height={80}
                className='absolute top-3 left-0 hidden h-20 w-2 sm:top-[0.875rem] sm:block'
              />
              <ol className='text-gray9 space-y-0 text-[1rem] leading-[200%] sm:text-[1.125rem] sm:whitespace-nowrap'>
                <li>01 전공 선택</li>
                <li>02 흥미 유형 검사</li>
                <li>03 근무 조건 밸런스게임</li>
              </ol>
              <p className='mt-3 text-[1.5rem] leading-[130%] font-bold sm:-ml-5 sm:text-[1.5rem] sm:whitespace-nowrap'>
                3단계 테스트로 3분 만에!
              </p>
              <p className='mt-16 text-[1.25rem] leading-[130%] font-bold sm:mt-[6.1875rem] sm:-ml-5 sm:text-[1.5rem] sm:whitespace-nowrap'>
                나의 성향에 딱 맞는 직무와
                <br />
                기업 형태를 찾아보세요.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section
        id='experience-organization-introduction'
        className='scroll-mt-[3.5rem] bg-[#E6E9FF]/30 py-[7.5rem] sm:scroll-mt-[6.5rem] sm:py-[10rem]'
      >
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

          <div className='mt-16 grid gap-9 sm:mt-[4.375rem] sm:grid-cols-3 sm:gap-[2.75rem]'>
            {solutionCards.map((card) => (
              <SolutionCard key={card.number} {...card} />
            ))}
          </div>

          <div className='mt-16 grid gap-6 sm:mt-[10rem] sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10'>
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

      <section
        id='portfolio-correction-introduction'
        className='relative scroll-mt-[3.5rem] overflow-hidden py-[7.5rem] sm:min-h-[113.6875rem] sm:scroll-mt-[6.5rem] sm:pt-[10rem] sm:pb-[6.875rem]'
      >
        <div
          aria-hidden
          className='pointer-events-none absolute inset-0 z-0 hidden sm:block'
        >
          <div className='relative mx-auto h-full max-w-[66rem]'>
            <div className='border-gray3 absolute top-[41.25rem] left-[3.9375rem] h-[5.4078125rem] w-[23.625rem] rounded-full border bg-[#FDFDFD] shadow-[0_4px_8px_0_rgba(0,0,0,0.2)] blur-[0.3125rem]' />
            <div className='border-gray3 absolute top-[46.6875rem] left-[29.5rem] h-[7.375rem] w-[40.5rem] rounded-full border bg-[#FDFDFD] shadow-[0_4px_8px_0_rgba(0,0,0,0.2)] blur-[0.3125rem]' />
          </div>
        </div>
        <div
          className='pointer-events-none absolute inset-0 z-10 opacity-50 blur-[3.125rem]'
          style={{
            background:
              'linear-gradient(180.083456732145deg, rgba(255, 255, 255, 0) 20.046%, rgb(196, 204, 255) 51.997%, rgba(255, 255, 255, 0.4) 79.954%)',
          }}
        />
        <div className='relative z-20 mx-auto max-w-[66rem] px-5 sm:px-0'>
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

          <div className='relative mt-24 min-h-[19rem] sm:mt-[8.75rem] sm:min-h-[34.875rem]'>
            <div
              aria-hidden
              className='absolute top-[25.6875rem] left-1/2 z-0 hidden h-[5.0625rem] w-[17.625rem] -translate-x-1/2 sm:block'
            >
              <span className='absolute top-0 left-1/2 h-[1.375rem] w-[17.625rem] -translate-x-1/2 rounded-full bg-white opacity-30 blur-[0.1875rem]' />
              <span className='absolute top-[1.875rem] left-1/2 h-[1.125rem] w-48 -translate-x-1/2 rounded-full bg-white opacity-50 blur-[0.1875rem]' />
              <span className='absolute top-[3.5rem] left-[calc(50%+1.5px)] h-[0.6875rem] w-[7.5625rem] -translate-x-1/2 rounded-full bg-white opacity-70 blur-[0.1875rem]' />
              <span className='absolute top-[4.6875rem] left-[calc(50%+2px)] h-1.5 w-[4.75rem] -translate-x-1/2 rounded-full bg-white opacity-90 blur-[0.1875rem]' />
            </div>
            <div className='border-gray3 absolute top-0 left-[5%] z-10 h-20 w-[70%] rounded-full border bg-white shadow-[0_4px_8px_0_rgba(0,0,0,0.2)] sm:left-[7.5625rem] sm:h-[7.375rem] sm:w-[36.8125rem]' />
            <p className='absolute top-6 left-[10%] z-10 max-w-[19rem] text-[0.9375rem] leading-[150%] sm:top-8 sm:left-[12.5rem] sm:max-w-[28.5rem] sm:text-[1.125rem] sm:whitespace-nowrap'>
              <span className='block'>
                특정 직무에 적합한 활동을 주로 했는데,
              </span>
              <span>막상 취업 시장에 나와보니 </span>
              <strong className='text-[1.25rem] leading-[130%] font-bold'>
                다른 직무도 지원할 수밖에 없어요.
              </strong>
            </p>
            <div className='border-gray3 absolute top-28 right-[2%] z-10 h-24 w-[78%] rounded-full border bg-[#FDFDFD] shadow-[0_4px_8px_0_rgba(0,0,0,0.2)] sm:top-[10.625rem] sm:right-[2rem] sm:h-[7.375rem] sm:w-[40.5rem]' />
            <p className='absolute top-[8.75rem] right-[7%] z-10 max-w-[22rem] text-[0.9375rem] leading-[150%] sm:top-[12.625rem] sm:right-[6.9375rem] sm:max-w-[30.5rem] sm:text-[1.125rem] sm:whitespace-nowrap'>
              <span className='block'>
                포트폴리오 하나로 여러 직무와 기업에 지원하니 경쟁력이
                떨어지지만,
              </span>
              <span>공고마다 새로 포트폴리오를 쓰기에는</span>
              <strong className='text-[1.25rem] leading-[130%] font-bold'>
                {' '}
                시간이 너무 오래 걸려요.
              </strong>
            </p>
          </div>

          <div className='mx-auto max-w-[46.25rem] text-center'>
            <h3 className='text-[1.75rem] leading-[130%] font-bold sm:text-[2rem]'>
              AI 컨설턴트가 제공하는
              <br />
              지원 상황에 최적화된 첨삭 보고서로 해결하세요.
            </h3>
            <div className='mt-12 sm:mt-[3.125rem]'>
              <PortfoliloPoints />
            </div>
          </div>
        </div>
      </section>

      <CorrectionWorkflow />
      <LandingFaq />

      <section className='relative overflow-hidden pt-[7.5rem] pb-40 sm:pt-[28.75rem] sm:pb-[25rem]'>
        <Image
          src='/landing/landing-cta-gradient.svg'
          alt=''
          width={2510}
          height={1823}
          aria-hidden='true'
          className='pointer-events-none absolute top-[3.75rem] left-1/2 h-auto w-[max(130.73vw,156.875rem)] max-w-none -translate-x-1/2 sm:top-[11.25rem]'
        />
        <div className='relative flex flex-col items-center text-center'>
          <h2 className='text-[2.25rem] leading-[130%] font-bold sm:text-[3rem]'>
            지금,
            <br />
            경험을 서류로 바꾸세요.
          </h2>
          <div className='mt-10 sm:mt-[3.75rem]'>
            <LoginEntryButton>무료로 사용하기 →</LoginEntryButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
