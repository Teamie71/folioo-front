import Image from 'next/image';
import Link from 'next/link';
import { FEEDBACK_FORM_URL } from '@/constants/feedback';

export default function Footer() {
  return (
    <div className='mx-auto hidden w-full bg-[#F6F8FA] pt-[1.25rem] pb-[2.5rem] md:flex'>
      <div className='mx-auto flex min-w-[66rem] flex-col items-start justify-center gap-[2.5rem]'>
        <div className='flex w-full flex-col gap-[1.25rem]'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-[5rem] text-[1rem] leading-[150%]'>
              <p className='font-bold'>서비스</p>
              <Link href='/log' className='cursor-pointer'>
                인사이트 로그
              </Link>
              <Link href='/experience' className='cursor-pointer'>
                경험 정리
              </Link>
              <Link href='/correction' className='cursor-pointer'>
                포트폴리오 첨삭
              </Link>
            </div>

            <a
              href={FEEDBACK_FORM_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='cursor-pointer rounded-[0.375rem] border-[0.09375rem] border-[#9EA4A9] bg-[#ffffff] px-[1.5rem] py-[0.375rem] text-[1rem] font-semibold hover:bg-[#F6F8FA]'
            >
              서비스 피드백 남기기
            </a>
          </div>

          <div className='w-full border border-[#CDD0D5]' />
        </div>

        <div className='flex w-full justify-between'>
          <div className='flex flex-col gap-[1.5rem]'>
            <Image src='/MainLogo.svg' alt='MainLogo' width={128} height={32} />

            <div className='flex flex-col gap-[0.5rem] text-[0.875rem] leading-[150%] text-[#74777D]'>
              <div className='flex items-center gap-[1.5rem]'>
                <p>상호명: 티미(Teamie)</p>
                <p>대표자: 김수빈</p>
                <p>개인정보관리책임자: 김수빈</p>
              </div>

              <div className='flex items-center gap-[1.5rem]'>
                <p>사업자등록번호: 512-16-02706</p>
                <p>전화번호: 010-5797-0358</p>
                <p>이메일: teamie0701@gmail.com</p>
              </div>

              <div className='flex items-center gap-[1.5rem]'>
                <p>
                  주소: (23015) 인천광역시 강화군 하점면 창후로174번길 13-27,
                  일부
                </p>
              </div>
            </div>
          </div>

          <a
            href='https://www.instagram.com/folioo_ai'
            target='_blank'
            rel='noopener noreferrer'
            className='cursor-pointer'
          >
            <Image
              src='/InstagramIcon.svg'
              alt='InstagramIcon'
              width={40}
              height={40}
            />
          </a>
        </div>

        <div className='flex flex-col gap-[0.75rem]'>
          <div className='flex items-center gap-[1.25rem] text-[1rem] leading-[150%] text-[#74777D]'>
            <Link
              href='/privacy'
              className='cursor-pointer font-bold hover:underline'
            >
              개인정보 처리방침
            </Link>
            <div className='h-[1.25rem] border border-[#CDD0D5]' />
            <Link href='/tos' className='cursor-pointer hover:underline'>
              서비스 이용약관
            </Link>
            <div className='h-[1.25rem] border border-[#CDD0D5]' />
            <Link href='/marketing' className='cursor-pointer hover:underline'>
              마케팅 정보 수신
            </Link>
          </div>
          <p className='text-[0.875rem] leading-[150%] text-[#74777D]'>
            Copyright © 2026 Teamie. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
