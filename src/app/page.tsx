'use client';

import { motion } from 'framer-motion';
import { ContentCard } from '@/features/landing/components/ContentCard';
import { CommonButton } from '@/components/CommonButton';
import { ExperienceCard } from '@/features/landing/components/ExperienceCard';
import { ExperienceHIW } from '@/features/landing/components/ExperienceHIW';
import { PortfolioComments } from '@/features/landing/components/PortfolioProblems';
import { PortfoliloPoints } from '@/features/landing/components/PortfolioPoints';
import { PortfolioHIW } from '@/features/landing/components/PortfolioHIW';

export default function LandingPage() {
  return (
    <div className='w-full'>
      {/* ~ 메인 */}
      <section className='mx-auto w-[66rem] flex flex-col gap-[4.5rem] pt-[10rem] pb-[13.75rem]'>
        <motion.div 
          className='flex flex-col gap-[3.25rem] items-center'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
            <h1 className='text-[3rem] leading-[130%] font-bold text-[#000000] text-center'>
              당신의 모든 경험을 <br /> 무한한 취업 경쟁력으로
            </h1>
            <p className='text-[1.25rem] leading-[130%] font-bold text-[#000000]'>
              Folioo의 AI 컨설턴트가 당신의 경험과 역량을 가장 효과적으로 활용할
              수 있도록 도와드려요.
            </p>
            <CommonButton variantType='Gradient' px='2.25rem' py='0.75rem'>
              무료로 시작하기 →
            </CommonButton>
        </motion.div>
        <motion.div 
          className='flex gap-[1.5rem]'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <ContentCard title='인사이트 로그' description={
              <>
                스쳐 지나가는 작은 인사이트, <br />
                나를 증명하는 스토리로
              </>
            }
            buttonText='로그 작성하기 →'
          />
          <ContentCard
            title='경험 정리'
            description={
              <>
                컨설턴트와의 체계적인 대화를
                 <br />
                바로 쓸 수 있는 포트폴리오로
              </>
            }
            buttonText='대화 시작하기 →'
          />
          <ContentCard
            title='포트폴리오 첨삭'
            description={
              <>
                매번 새로 쓰는 부담 없이, <br />
                공고마다 빠르게, 맞춤 전략으로
              </>
            }
            buttonText='첨삭 의뢰하기 →'
          />
        </motion.div>
      </section>

      {/* ~ 인사이트 로그 */}
      <motion.section 
        className='mx-auto w-[66rem] pb-[10rem]'
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className='flex flex-col gap-[5.75rem]'>
        <div className='flex flex-col gap-[1.75rem]'>
          <p className='text-[1.25rem] leading-[130%] font-bold text-[#000000]'>인사이트 로그</p>
           
          <div className='flex flex-col gap-[2rem] items-start'>
          <h1 className='text-[2rem] leading-[130%] font-bold text-[#000000]'>스쳐 지나가는 작은 인사이트,
            <br />
            나를 증명하는 스토리로
          </h1>
          <CommonButton variantType='Gradient' px='2.25rem' py='0.75rem'>로그 작성하기 →</CommonButton>
          </div>
        </div>

        { /* 영상 */}
        <div className='flex flex-col gap-[1.25rem]'>
          <div className='flex justify-between w-full'>
            <div className='w-[31.25rem] h-[18.75rem] bg-[#D9D9D9]' />

            <div className='flex h-[18.75rem] w-[31.25rem] flex-col gap-[1rem] justify-center pl-[5rem]'>
              <p className='text-[1.125rem] leading-[150%] text-[#000000]'>
                기업이 진짜 궁금한 건, <br />
                '무엇을 했는지'보다 '무엇을 느꼈는지'예요.
              </p>
              <p className='text-[1.5rem] font-bold leading-[130%] text-[#000000]'>
                Why? 에 최적화된 템플릿으로 <br />
                쉽고 빠르게 나의 가치를 기록하세요.
              </p>
            </div>
          </div>

          <div className='flex justify-between w-full'>
          <div className='flex h-[18.75rem] w-[31.25rem] flex-col gap-[1rem] justify-center'>
              <p className='text-[1.125rem] leading-[150%] text-[#000000]'>
              쌓인 기록들은 <br />
              풍부한 경험 정리의 재료이자,
              </p>
              <p className='text-[1.5rem] font-bold leading-[130%] text-[#000000]'>
              채용 사이클 전체에서  <br />
              활용 가능한 핵심 자산이 돼요.
              </p>
            </div>

            <div className='w-[31.25rem] h-[18.75rem] bg-[#D9D9D9]' />
          </div>
        </div>
        </div>
      </motion.section>

      {/* ~ 경험 정리 */}
      <section className='mx-auto w-full pb-[10rem] bg-[#E6E9FF]/30 pt-[10rem] pb-[13.75rem]'>
        <div className='flex flex-col gap-[16.25rem]'>
          <motion.div 
            className='flex flex-col gap-[4.5rem] w-[66rem] mx-auto'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
          <div className='flex flex-col gap-[1.75rem]'>
            <p className='text-[1.25rem] leading-[130%] font-bold text-[#000000]'>경험 정리</p>
           
              <div className='flex flex-col gap-[2rem] items-start'>
                <h1 className='text-[2rem] leading-[130%] font-bold text-[#000000]'>
                  컨설턴트와의 체계적인 대화를 <br />
                  바로 쓸 수 있는 포트폴리오로
                  </h1>
                  <CommonButton variantType='Gradient' px='2.25rem' py='0.75rem'>대화 시작하기 →</CommonButton>
                  </div>
          </div>

          {/* Solution 카드 */}
          <div className='flex gap-[2.75rem]'>
          <ExperienceCard direction='top-right' number='Solution 01' label='지원 서류에 쓸 내용이 없어요.'>
          경험 정리를 해두면, <br />
          어떤 서류든 문제 없어요!
          </ExperienceCard>
          <ExperienceCard direction='bottom-right' number='Solution 02' label='경험 정리하는 방법을 모르겠어요.'>
          AI가 주도하는 대화를 통해 <br />
          제대로 정리할 수 있어요!
          </ExperienceCard>
          <ExperienceCard direction='top-left' number='Solution 03' label='포트폴리오가 처음이라 막막해요.'>
          대화 내용을 기반으로 <br />
          AI가 작성한 포트폴리오를 <br />
          바로 활용하세요!
          </ExperienceCard>
          </div>
          </motion.div>

          { /* how it works */}
          <motion.div 
            className='flex flex-col gap-[3.75rem] w-[93.375rem] mx-auto'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className='text-[1.25rem] leading-[130%] font-bold text-[#74777D]'>How It Works</p>
            <ExperienceHIW />
          </motion.div>
        </div>
      </section>

      {/* ~ 포트폴리오 첨삭 + 시작하기 */}
      <section className='mx-auto pt-[10rem] pb-[25rem] flex flex-col gap-[28.75rem]'>
        <div>
        <motion.div 
          className='flex flex-col gap-[1.75rem] w-[66rem] mx-auto'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className='text-[1.25rem] leading-[130%] font-bold text-[#000000]'>포트폴리오 첨삭</p>
           
          <div className='flex flex-col gap-[2rem] items-start'>
          <h1 className='text-[2rem] leading-[130%] font-bold text-[#000000]'>매번 새로 쓰는 부담 없이,
            <br />
            공고마다 빠르게, 맞춤 전략으로
          </h1>
          <CommonButton variantType='Gradient' px='2.25rem' py='0.75rem'>첨삭 의뢰하기 →</CommonButton>
          </div>
        </motion.div>

        { /* 말풍선들 */}
        <div className='pt-[8.75rem] pb-[4.125rem]'>
        <PortfolioComments />
        </div>

        { /* Points */}
        <motion.div 
          className='flex flex-col gap-[3rem] w-[46.25rem] mx-auto text-center'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className='text-[2rem] leading-[130%] font-bold text-[#000000]'>AI 컨설턴트가 제공하는 <br />
          지원 상황에 최적화된 첨삭 보고서로 해결하세요.</p>
        <PortfoliloPoints />
        </motion.div>
        
        { /* How It Works */}
        <motion.div 
          className='flex flex-col gap-[3.75rem] w-[77rem] mx-auto pt-[13.75rem]'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
        <p className='text-[1.25rem] leading-[130%] font-bold text-[#74777D] text-center'>How It Works</p>
          <PortfolioHIW />
        </motion.div>
        </div>

        { /* 엔딩 문구 + 시작하기 */}
        <motion.div 
          className='flex flex-col gap-[3.75rem] items-center text-center'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className='text-[3rem] leading-[130%] font-bold text-[#000000]'>지금, <br />
          경험을 서류로 바꾸세요.
          </p>
          <CommonButton variantType='Gradient' px='2.25rem' py='0.75rem'>무료로 시작하기 →</CommonButton>
        </motion.div>
      </section>
    </div>
  );
}
