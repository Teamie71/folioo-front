import Link from 'next/link';
import InputArea from '@/components/InputArea';
import { ExperienceIcon } from '@/components/icons/ExperienceIcon';
import { CommonButton } from '@/components/CommonButton';
import { SearchButton } from '@/components/SearchButton';

export default function ExperiencePage() {
  return (
    <div className='flex flex-col gap-[4.5rem]'>
      {/* 경험정리 헤더 */}
      <div className='mx-auto flex h-[15.625rem] w-full min-w-[66rem] bg-[#F6F5FF]'>
        <div className='mx-auto flex min-w-[66rem] items-center justify-between'>
          {/* 경험정리 타이틀 */}
          <div>
            <div className='flex flex-col gap-[1.25rem]'>
              <div className='flex items-center gap-[1.125rem]'>
                <ExperienceIcon />
                <span className='text-[1.5rem] font-bold'>경험 정리</span>
              </div>
              <span className='text-[1.125rem] leading-[150%] text-[#464B53]'>
                AI 비서 티미와의 채팅을 통해 경험을 체계적으로 정리해보세요.
                <br />
                채팅이 종료되면, 텍스트형 포트폴리오가 생성됩니다.
              </span>
            </div>
          </div>

          {/* 새로운 경험 정리 시작하기 버튼 */}
          <Link href='/experience/settings' className='no-underline'>
            <CommonButton variantType='StartChat'>
              새로운 경험 정리 시작하기
            </CommonButton>
          </Link>
        </div>
      </div>

      {/* 나의 경험 */}
      <div className='mx-auto flex w-[66rem] flex-col gap-[3rem]'>
        <div className='flex flex-col gap-[2rem]'>
          <span className='text-[1.25rem] font-bold'>나의 경험</span>

          {/* 나의 경험 검색 */}
          <InputArea
            variant='rounded'
            placeholder='검색어를 입력하세요.'
            rightElement={<SearchButton />}
          />
        </div>

        {/* 나의 경험 카드 
        TODO: 경험 카드 없을 때, 검색 결과 없을 때 문구
        */}
        <div className='grid grid-cols-2 gap-[1.5rem]'>
          <div className='rounded-[1rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2rem] py-[1.75rem] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
            <div className='flex flex-col gap-[1.25rem]'>
              <span className='text-[1.125rem]'>대중문화와 미디어 팀플</span>
              <div className='flex items-end justify-between'>
                <div className='rounded-[6.25rem] border border-[#CDD0D5] px-[0.75rem] py-[0.25rem] text-[0.875rem]'>
                  기획
                </div>
                <span className='text-[1rem] text-[#74777D]'>2000-00-00</span>
              </div>
            </div>
          </div>
          <div className='rounded-[1rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2rem] py-[1.75rem] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
            <div className='flex flex-col gap-[1.25rem]'>
              <span className='text-[1.125rem]'>대중문화와 미디어 팀플</span>
              <div className='flex items-end justify-between'>
                <div className='rounded-[6.25rem] border border-[#CDD0D5] px-[0.75rem] py-[0.25rem] text-[0.875rem]'>
                  기획
                </div>
                <span className='text-[1rem] text-[#74777D]'>2000-00-00</span>
              </div>
            </div>
          </div>
          <div className='rounded-[1rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[2rem] py-[1.75rem] shadow-[0_0.25rem_0.5rem_0_#00000033]'>
            <div className='flex flex-col gap-[1.25rem]'>
              <span className='text-[1.125rem]'>대중문화와 미디어 팀플</span>
              <div className='flex items-end justify-between'>
                <div className='rounded-[6.25rem] border border-[#CDD0D5] px-[0.75rem] py-[0.25rem] text-[0.875rem]'>
                  기획
                </div>
                <span className='text-[1rem] text-[#74777D]'>2000-00-00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
