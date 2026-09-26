import Image from 'next/image';
import Link from 'next/link';
import { SIDEBAR_MENU_ITEMS } from '@/constants/sidebarNavigation';
import { FEEDBACK_PATH } from '@/constants/feedback';

export function MobileFooter() {
  return (
    <footer
      aria-label='모바일 푸터'
      className='bg-gray2 text-gray6 px-4 pt-10 pb-5 md:hidden'
    >
      <div className='flex h-[33px] items-center justify-between'>
        <p className='typo-c1-b text-gray9'>서비스</p>
        <Link
          href={FEEDBACK_PATH}
          className='typo-c1-b border-gray5 text-gray9 flex h-[33px] items-center rounded-md border bg-white px-6'
        >
          서비스 피드백 남기기
        </Link>
      </div>

      <nav
        aria-label='푸터 서비스'
        className='typo-c1 text-gray9 mt-2 flex flex-col items-start gap-2'
      >
        {SIDEBAR_MENU_ITEMS.filter((item) => item.href !== FEEDBACK_PATH).map(
          (item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ),
        )}
      </nav>

      <div className='mt-[27px] h-px bg-[url(/mobile/footer-divider.svg)] bg-repeat-x' />
      <div className='mt-5 flex h-10 items-center justify-between'>
        <Link href='/' aria-label='Folioo 홈으로 이동'>
          <Image
            src='/mobile/footer-logo.svg'
            alt='Folioo'
            width={96}
            height={24}
          />
        </Link>
        <a
          href='https://www.instagram.com/folioo_ai'
          target='_blank'
          rel='noopener noreferrer'
          aria-label='Folioo 인스타그램'
        >
          <Image src='/mobile/instagram.svg' alt='' width={40} height={40} />
        </a>
      </div>

      <div className='typo-c2 mt-5 flex flex-col items-start gap-2'>
        <p>상호명: 티미(Teamie)</p>
        <div className='flex flex-wrap gap-x-5 gap-y-2'>
          <p>대표자: 김수빈</p>
          <p>개인정보관리책임자: 김수빈</p>
        </div>
        <a
          href='https://www.ftc.go.kr/bizCommPop.do?wrkr_no=5121602706'
          target='_blank'
          rel='noopener noreferrer'
          aria-label='공정거래위원회 사업자정보공개'
        >
          사업자등록번호: 512-16-02706
        </a>
        <p>주소: (23015) 인천광역시 강화군 하점면 창후로174번길 13-27, 일부</p>
        <p>전화번호: 010-5797-0358</p>
        <p>이메일: teamie0701@gmail.com</p>
      </div>

      <nav
        aria-label='푸터 약관'
        className='typo-c2 mt-10 flex flex-wrap items-center gap-x-3 gap-y-2'
      >
        <Link href='/privacy' className='font-bold'>
          개인정보 처리방침
        </Link>
        <span
          aria-hidden
          className='flex h-[14px] w-px items-center justify-center'
        >
          <Image
            src='/mobile/footer-policy-divider.svg'
            alt=''
            width={14}
            height={1}
            className='max-w-none shrink-0 rotate-90'
          />
        </span>
        <Link href='/tos'>서비스 이용약관</Link>
        <span
          aria-hidden
          className='flex h-[14px] w-px items-center justify-center'
        >
          <Image
            src='/mobile/footer-policy-divider.svg'
            alt=''
            width={14}
            height={1}
            className='max-w-none shrink-0 rotate-90'
          />
        </span>
        <Link href='/marketing'>마케팅 정보 수신</Link>
      </nav>
      <p className='typo-c1 mt-3'>
        Copyright © {new Date().getFullYear()} Teamie. All rights reserved.
      </p>
    </footer>
  );
}
