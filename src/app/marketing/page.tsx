import { BackButton } from '@/components/BackButton';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function MarketingPage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <div className='mx-auto flex w-[66rem] min-w-[66rem] flex-col gap-[3.75rem] pt-[3.75rem] pb-[6.25rem]'>
        {/* 로고 */}
        <Image src='/MainLogo.svg' alt='MainLogo' width={128} height={32} />

        {/* 마케팅 정보 수신 */}
        <div className='flex flex-col gap-[3.125rem]'>
          {/* 헤더 */}
          <div className='flex flex-col gap-[1.25rem]'>
            <div className='flex items-center gap-[1.25rem]'>
              <BackButton />
              <span className='text-[1.5rem] font-bold'>마케팅 정보 수신</span>
            </div>

            <p className='w-full border border-[#CDD0D5]' />
          </div>

          {/* 내용 */}
          <div className='flex flex-col gap-[1.25rem] px-[0.5rem]'>
            <div className='flex w-full flex-col gap-[2.5rem]'>
              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 1조 (목적) <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  이 약관은 티미(Teamie) (이하 &quot;회사&quot;)는 회사가
                  제공하는 Folioo 서비스 (이하 &quot;서비스&quot;) 이용자에게
                  마케팅 정보(서비스 업데이트, 이벤트·프로모션, 설문조사, 신규
                  기능 안내 등)를 전송하기 위해 필요한 수신 동의 사항을 규정함을
                  목적으로 합니다.
                  <br />
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 2조 (정의)
                <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  <span className='ml-[0.25rem] block'>
                    1. &quot;마케팅 정보&quot;란 회사가 제공하는 서비스 관련
                    소식, 이벤트·프로모션, 설문조사, 신규 기능 안내 등을
                    의미합니다.
                    <br />
                    2. &quot;수신 동의&quot;란 이용자가 회사로부터 마케팅 정보를
                    수신하는 것에 대해 명시적으로 동의하는 행위를 말합니다.
                  </span>
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 3조 (수집 및 이용 항목)
                <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  본 약관에서 사용하는 주요 용어의 정의는 다음과 같습니다.{' '}
                  <br />
                  <span className='ml-[0.25rem] block'>
                    1. 수집 항목
                    <br />
                    {'\u00A0\u00A0'}• 성명, 이메일 주소
                    <br />
                    2. 이용 목적
                    <br />
                    {'\u00A0\u00A0'}• 마케팅 정보의 발송과 통계·분석을 통한
                    서비스 개선
                  </span>
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 4조 (수신 방법)
                <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  회사는 본 약관에 동의한 이용자에게 아래 채널을 통해 마케팅
                  정보를 발신할 수 있습니다.
                  <br />
                  <span className='ml-[0.25rem] block'>1. 이메일</span>
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 5조 (보유 및 이용 기간)
                <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  <span className='ml-[0.25rem] block'>
                    1. 수신 동의 철회 전까지 회사는 동의 정보를 보유·이용합니다.
                    <br />
                    2. 동의 철회 시 회사는 지체 없이 해당 정보의 &apos;마케팅
                    목적 이용&apos;을 중단합니다. 단, 서비스 가입 및 이용을 위해
                    필수 수집된 식별 정보는 회사
                    <br />
                    {'\u00A0\u00A0\u00A0\u00A0'}「개인정보처리방침」에 명시된
                    기간 동안 안전하게 보관됩니다.
                  </span>
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 6조 (동의 거부 및 철회 방법)
                <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  본 약관에서 사용하는 주요 용어의 정의는 다음과 같습니다.{' '}
                  <br />
                  <span className='ml-[0.25rem] block'>
                    1. 서비스 내의 [프로필 &gt; &apos;마케팅 정보 수신
                    동의&apos; 토글]을 통해 수신 동의를 철회하실 수 있습니다.
                  </span>
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 7조 (동의 거부에 따른 불이익)
                <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  <span className='ml-[0.25rem] block'>
                    1. 본 동의는 선택 사항이므로 동의를 거부하실 수 있습니다.
                    동의를 거부하시더라도 서비스의 가입 및 이용에는 아무런
                    불이익이 없습니다.
                    <br />
                    {'\u00A0\u00A0\u00A0\u00A0'}단, 동의 거부 시 마케팅 정보를
                    통한 유용한 혜택 제공이 제한될 수 있습니다.
                  </span>
                </p>
              </div>

              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 8조 (약관의 효력 및 변경)
                <br />
                <p className='font-regular text-[1.125rem] leading-[150%]'>
                  <span className='ml-[0.25rem] block'>
                    1. 본 약관은 2026년 3월 9일부터 적용됩니다.
                    <br />
                    2. 법령·정책·서비스 변경에 따라 내용이 변경될 경우, 변경
                    사유 및 시행일자를 명시하여 사전 공지합니다.
                  </span>
                </p>
              </div>

              {/* 제 8조 (약관의 효력 및 변경) */}
              <div className='flex flex-col gap-[1.25rem]'>
                <div className='text-[1.125rem] font-bold text-[#1A1A1A]'></div>
                <div className='flex flex-col gap-[1.25rem] px-[0.25rem] text-[1rem] leading-[150%] text-[#464B53]'>
                  <div className='flex flex-col gap-[0.75rem]'>
                    <p></p>
                    <p></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
