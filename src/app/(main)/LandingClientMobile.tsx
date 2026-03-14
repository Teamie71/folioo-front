'use client';

import { motion } from 'framer-motion';
import { ContentCard } from '@/features/landing/components/ContentCard';
import { CommonButton } from '@/components/CommonButton';
import { StartCorrectionButton } from '@/features/landing/components/StartCorrectionButton';
import { ExperienceCard } from '@/features/landing/components/ExperienceCard';
import { ExperienceHIW } from '@/features/landing/components/ExperienceHIW';
import { PortfolioComments } from '@/features/landing/components/PortfolioProblems';
import { PortfoliloPoints } from '@/features/landing/components/PortfolioPoints';
import { PortfolioHIW } from '@/features/landing/components/PortfolioHIW';
import { LandingVideo } from '@/features/landing/components/LandingVideo';
import { useAuthStore } from '@/store/useAuthStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

function LoginEntryButton() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );

  if (!sessionRestoreAttempted) return null;
  if (accessToken != null) return null;

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

export default function LandingClientMobile() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  const navigateWithLoginGuard = (href: string) => {
    if (accessToken) {
      router.push(href);
      return;
    }
    router.push(`/login?redirect_to=${encodeURIComponent(href)}`);
  };

  return (
    <div className='w-full overflow-x-hidden'>
      {/* 배경 */}
      <div className='relative'>
        <div
          className='pointer-events-none absolute inset-0 -z-10'
          style={{
            background:
              'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #C4CCFF 35%, #F2F4FF 60%, rgba(255, 255, 255, 0) 100%)',
            opacity: 0.5,
            filter: 'blur(100px)',
          }}
        />

        {/* 메인 히어로 */}
        <section className='relative z-10 mx-auto flex w-full max-w-[66rem] flex-col gap-[2.5rem] px-4 pt-[4rem] pb-[3rem]'>
          <motion.div
            className='flex flex-col items-center gap-[1.25rem]'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <h1 className='typo-h2 text-gray9 text-center'>
              당신의 모든 경험을 <br /> 무한한 취업 경쟁력으로
            </h1>
            <p className='typo-body2 text-gray6 text-center'>
              Folioo의 AI 컨설턴트가 당신의 경험과 역량을
              <br /> 가장 효과적으로 활용할 수 있도록 도와드려요.
            </p>
            <div className='mt-[2.5rem]'>
              <LoginEntryButton />
            </div>
          </motion.div>

          {/* 기능 카드 3개 - 모바일에서는 세로 스택 */}
          <motion.div
            className='flex flex-col items-center gap-[1.5rem]'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <ContentCard
              title='인사이트 로그'
              scrollToBelowCard={50}
              icon={
                <Image
                  src='/InsightLogIconLanding.svg'
                  alt='InsightLogIconLanding'
                  width={80}
                  height={80}
                />
              }
              description={
                <>
                  스쳐 지나가는 작은 인사이트, <br />
                  나를 증명하는 스토리로
                </>
              }
              buttonText='로그 작성하기 →'
              buttonHref='/log'
            />
            <ContentCard
              title='경험 정리'
              sectionId='section-experience-mobile'
              icon={
                <Image
                  src='/ExperienceIconLanding.svg'
                  alt='ExperienceIconLanding'
                  width={80}
                  height={80}
                />
              }
              description={
                <>
                  컨설턴트와의 체계적인 대화를
                  <br />
                  바로 쓸 수 있는 포트폴리오로
                </>
              }
              buttonText='대화 시작하기 →'
              buttonHref='/experience/settings'
              requireLogin
            />
            <ContentCard
              title='포트폴리오 첨삭'
              sectionId='section-portfolio-correction-mobile'
              icon={
                <Image
                  src='/CorrectionIconLanding.svg'
                  alt='CorrectionIconLanding'
                  width={80}
                  height={80}
                />
              }
              description={
                <>
                  매번 새로 쓰는 부담 없이, <br />
                  공고마다 빠르게, 맞춤 전략으로
                </>
              }
              buttonText='첨삭 의뢰하기 →'
              customButton={
                <StartCorrectionButton
                  variantType='Outline'
                  px='2.25rem'
                  py='0.5rem'
                >
                  첨삭 의뢰하기 →
                </StartCorrectionButton>
              }
            />
          </motion.div>
        </section>

        {/* 인사이트 로그 섹션 */}
        <motion.section
          id='section-insight-log'
          className='relative z-10 mx-auto mt-[4.25rem] flex w-full max-w-[66rem] flex-col items-center pb-12'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className='flex w-full max-w-[66rem] flex-col items-center gap-[2.875rem]'>
            <div className='flex w-[20.25rem] flex-col items-start gap-[1rem]'>
              <p className='typo-b2-sb text-gray9'>인사이트 로그</p>
              <h2 className='typo-h3 text-gray9'>
                스쳐 지나가는 작은 인사이트,
                <br />
                나를 증명하는 스토리로
              </h2>
              <div className='mt-[1.5rem]'>
                <CommonButton
                  variantType='Gradient'
                  px='2.25rem'
                  py='0.75rem'
                  onClick={() => router.push('/log')}
                >
                  로그 작성하기 →
                </CommonButton>
              </div>
            </div>

            <div className='flex w-full max-w-[66rem] flex-col items-center gap-[0.625rem]'>
              <LandingVideo
                src='/landing/log1.mp4'
                width='20.5rem'
                height='12.25rem'
              />
              <p className='typo-b2 text-gray9 w-[20.25rem]'>
                기업이 진짜 궁금한 건, <br />
                &apos;무엇을 했는지&apos;보다 &apos;무엇을 느꼈는지&apos;예요.
              </p>
              <p className='typo-b2-sb text-gray9 w-[20.25rem]'>
                Why? 에 최적화된 템플릿으로 <br />
                쉽고 빠르게 나의 가치를 <br />
                기록하세요.
              </p>
            </div>

            <div className='mt-[0.875rem] flex w-full max-w-[66rem] flex-col items-center gap-[1rem]'>
              <LandingVideo
                src='/landing/log2.mp4'
                width='20.5rem'
                height='12.25rem'
              />
              <div className='flex w-[20.25rem] flex-col items-start gap-[0.5rem]'>
                <p className='typo-b2 text-gray9'>
                  쌓인 기록들은 풍부한 경험 정리의 재료이자,
                </p>
                <p className='typo-b2-sb text-gray9'>
                  채용 사이클 전체에서
                  <br />
                  활용 가능한 핵심 자산이 돼요.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* 경험 정리 섹션 */}
      <section id='section-experience-mobile' className='w-full bg-[#E6E9FF]/30 py-12'>
        <div className='mx-auto flex max-w-[66rem] flex-col items-center gap-12 px-4'>
          <motion.div
            className='flex w-full max-w-[66rem] flex-col items-center gap-[3.75rem] text-center'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className='flex w-[20.25rem] flex-col items-start gap-[1rem]'>
              <p className='typo-b2-sb text-gray9'>경험 정리</p>
              <h2 className='typo-h3 text-gray9'>
                컨설턴트와의 체계적인 대화를 <br />
                바로 쓸 수 있는 포트폴리오로
              </h2>

              <div className='mt-[1.5rem]'>
                <CommonButton
                  variantType='Gradient'
                  px='2.25rem'
                  py='0.75rem'
                  onClick={() => navigateWithLoginGuard('/experience/settings')}
                >
                  대화 시작하기 →
                </CommonButton>
              </div>
            </div>
            <div className='flex w-full max-w-[66rem] flex-col items-center gap-[3.75rem]'>
              <ExperienceCard
                direction='top-right'
                number='Solution 01'
                label='지원 서류에 쓸 내용이 없어요.'
              >
                경험 정리를 해두면, <br />
                어떤 서류든 문제 없어요!
              </ExperienceCard>
              <ExperienceCard
                direction='bottom-right'
                number='Solution 02'
                label='경험 정리하는 방법을 모르겠어요.'
              >
                AI가 주도하는 대화를 통해 <br />
                제대로 정리할 수 있어요!
              </ExperienceCard>
              <ExperienceCard
                direction='top-left'
                number='Solution 03'
                label='포트폴리오가 처음이라 막막해요.'
              >
                대화 내용을 기반으로 AI가 작성한 <br />
                포트폴리오를 바로 활용하세요!
              </ExperienceCard>
            </div>
          </motion.div>
          <motion.div
            className='flex w-full max-w-[66rem] flex-col items-center gap-6 text-center'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className='text-[1rem] leading-[130%] font-bold text-[#74777D]'>
              How It Works
            </p>
            <ExperienceHIW />
          </motion.div>
        </div>
      </section>

      {/* 포트폴리오 첨삭 섹션 */}
      <section
        id='section-portfolio-correction-mobile'
        className='flex flex-col gap-12 py-12'
      >
        <div className='relative'>
          <div
            className='pointer-events-none absolute inset-0 -z-10'
            style={{
              background:
                'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #C4CCFF 55%, #F2F4FF 65%, rgba(255, 255, 255, 0) 100%)',
              opacity: 0.5,
              filter: 'blur(100px)',
            }}
          />
          <div className='relative z-10 mx-auto flex max-w-[66rem] flex-col items-center px-4'>
            <div className='flex w-[20.25rem] flex-col items-start gap-4'>
              <p className='typo-b2-sb text-[#000000]'>포트폴리오 첨삭</p>
              <h2 className='typo-h3 text-gray9'>
                매번 새로 쓰는 부담 없이,
                <br />
                공고마다 빠르게, 맞춤 전략으로
              </h2>
              <div className='mt-[1.5rem]'>
                <StartCorrectionButton>첨삭 의뢰하기 →</StartCorrectionButton>
              </div>
            </div>

            <div className='relative z-10 w-full max-w-[66rem] pt-8 pb-6'>
              <PortfolioComments />
            </div>
            <motion.div
              className='relative z-10 flex w-full max-w-[66rem] flex-col items-center gap-6 text-center'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className='flex flex-col gap-0 text-[1.25rem] leading-[130%] font-bold text-[#000000]'>
                <p>AI 컨설턴트가 제공하는</p>
                <p>지원 상황에 최적화된</p>
                <p>첨삭 보고서로 해결하세요.</p>
              </div>
              <PortfoliloPoints />
            </motion.div>
          </div>
          <motion.div
            className='mx-auto mt-[5rem] flex max-w-[66rem] flex-col items-center gap-6 px-4 pt-10 text-center'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className='text-[1rem] leading-[130%] font-bold text-[#74777D]'>
              How It Works
            </p>
            <PortfolioHIW />
          </motion.div>
        </div>
      </section>

      {/* 엔딩 CTA */}
      <section className='relative overflow-hidden py-12'>
        <div
          className='pointer-events-none absolute -z-10'
          style={{
            left: '50%',
            bottom: '0',
            transform: 'translate(-50%, 50%)',
            width: '200vw',
            height: '100vh',
            maxWidth: '4000px',
            maxHeight: '2000px',
            background:
              'radial-gradient(ellipse at center, #5060C5 0%, #93B3F4 25%, rgba(255, 255, 255, 0) 60%)',
            opacity: 0.4,
            filter: 'blur(100px)',
          }}
        />
        <motion.div
          className='relative z-10 flex flex-col items-center gap-8 px-4 py-[12.5rem] text-center'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className='text-[1.5rem] leading-[130%] font-bold text-[#000000]'>
            지금, <br />
            경험을 서류로 바꾸세요.
          </p>
          <LoginEntryButton />
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
