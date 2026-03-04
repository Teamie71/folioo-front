'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import {
  useUserControllerUpdateMarketingConsent,
  getUserControllerGetProfileQueryKey,
} from '@/api/endpoints/user/user';
import { CommonButton } from '@/components/CommonButton';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { ButtonSpinnerIcon } from '@/components/icons/ButtonSpinnerIcon';
import { DropdownIcon } from '@/components/icons/DropdownIcon';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/utils/utils';

const ACCESS_TOKEN_PARAM = 'access_token';
const REFRESH_TOKEN_PARAM = 'refresh_token';

export default function TermsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setRefreshTokenCookie = useAuthStore((s) => s.setRefreshTokenCookie);
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );
  const processedTokensFromUrlRef = useRef(false);

  const [agreedService, setAgreedService] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedMarketing, setAgreedMarketing] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isMarketingOpen, setIsMarketingOpen] = useState(false);

  const isAllAgreed =
    agreedService && agreedPrivacy && agreedMarketing;
  const isRequiredAgreed = agreedService && agreedPrivacy;

  const { mutate: updateMarketingConsent, isPending: isSubmitting } =
    useUserControllerUpdateMarketingConsent({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getUserControllerGetProfileQueryKey(),
          });
          router.replace('/');
        },
        onError: () => {
          window.alert(
            '동의 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
          );
        },
      },
    });

  useEffect(() => {
    const accessTokenFromUrl = searchParams.get(ACCESS_TOKEN_PARAM);
    const refreshTokenFromUrl = searchParams.get(REFRESH_TOKEN_PARAM);
    if (accessTokenFromUrl) {
      setAccessToken(accessTokenFromUrl);
    }
    if (refreshTokenFromUrl) {
      setRefreshTokenCookie(refreshTokenFromUrl);
    }
    if (accessTokenFromUrl || refreshTokenFromUrl) {
      processedTokensFromUrlRef.current = true;
      const url = new URL(window.location.href);
      url.searchParams.delete(ACCESS_TOKEN_PARAM);
      url.searchParams.delete(REFRESH_TOKEN_PARAM);
      const clean = url.pathname + (url.search || '');
      window.history.replaceState(null, '', clean || '/terms');
    }
  }, [searchParams, setAccessToken, setRefreshTokenCookie]);

  useEffect(() => {
    if (!sessionRestoreAttempted || accessToken == null) return;
    if (processedTokensFromUrlRef.current) return;
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [sessionRestoreAttempted, accessToken, router]);

  const handleSignUp = () => {
    if (!isRequiredAgreed) return;
    updateMarketingConsent({
      data: { isMarketingAgreed: agreedMarketing },
    });
  };

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='mx-auto flex w-[66rem] min-w-[66rem] flex-col gap-[3.75rem] pt-[3.75rem] pb-[6.25rem]'>
        {/* 로고 */}
        <Image src='/MainLogo.svg' alt='MainLogo' width={128} height={32} />

        {/* 서비스 이용 약관 */}
        <div className='flex flex-col gap-[1.75rem]'>
          {/* 헤더 */}
          <div className='flex flex-col gap-[1.25rem]'>
            <div className='flex items-center justify-between'>
              <span className='text-[1.5rem] font-bold'>약관 동의</span>

              <CommonButton
                variantType='Primary'
                px='2.25rem'
                py='0.75rem'
                disabled={!isRequiredAgreed || isSubmitting}
                onClick={handleSignUp}
                className={cn(
                  !isRequiredAgreed
                    ? '!bg-[#CDD0D5] hover:!bg-[#CDD0D5]'
                    : isSubmitting
                      ? '!h-[3rem] !w-[8rem] !min-w-0 !bg-[#5060C5] hover:!bg-[#5060C5] disabled:!bg-[#5060C5] disabled:hover:!bg-[#5060C5]'
                      : undefined,
                )}
              >
                {isSubmitting ? (
                  <span className='flex items-center justify-center'>
                    <ButtonSpinnerIcon size={32} />
                  </span>
                ) : (
                  '가입하기'
                )}
              </CommonButton>
            </div>

            <p className='w-full border border-[#CDD0D5]' />
          </div>

          <CheckboxPrimitive.Root
            id='terms-all-agree'
            checked={isAllAgreed}
            onCheckedChange={(checked) => {
              const v = checked === true;
              setAgreedService(v);
              setAgreedPrivacy(v);
              setAgreedMarketing(v);
            }}
            className='flex h-[4.25rem] w-full cursor-pointer items-center gap-[0.75rem] rounded-[0.75rem] border-none bg-[#F6F5FF] px-[1.25rem] py-[1.25rem] outline-none focus-visible:ring-2 focus-visible:ring-[#5060C5] focus-visible:ring-offset-2'
          >
            <span className='flex h-[1.25rem] w-[1.25rem] shrink-0 items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
                className='h-[1.25rem] w-[1.25rem]'
              >
                <g clipPath='url(#clip0_terms_agree)'>
                  <path
                    d='M10.0003 18.3334C11.0949 18.3348 12.1789 18.1198 13.1901 17.701C14.2014 17.2821 15.1198 16.6675 15.8928 15.8926C16.6678 15.1196 17.2823 14.2011 17.7012 13.1899C18.1201 12.1787 18.335 11.0946 18.3337 10.0001C18.335 8.90554 18.1201 7.82152 17.7012 6.81029C17.2823 5.79907 16.6678 4.88058 15.8928 4.10759C15.1198 3.33265 14.2014 2.7181 13.1901 2.29922C12.1789 1.88034 11.0949 1.6654 10.0003 1.66675C8.90579 1.6654 7.82176 1.88034 6.81054 2.29922C5.79931 2.7181 4.88082 3.33265 4.10783 4.10759C3.3329 4.88058 2.71834 5.79907 2.29946 6.81029C1.88059 7.82152 1.66565 8.90554 1.667 10.0001C1.66565 11.0946 1.88059 12.1787 2.29946 13.1899C2.71834 14.2011 3.3329 15.1196 4.10783 15.8926C4.88082 16.6675 5.79931 17.2821 6.81054 17.701C7.82176 18.1198 8.90579 18.3348 10.0003 18.3334Z'
                    fill={isAllAgreed ? '#5060C5' : 'none'}
                    stroke={isAllAgreed ? '#5060C5' : '#9EA4A9'}
                    strokeWidth='2'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M6.66699 10L9.16699 12.5L14.167 7.5'
                    stroke={isAllAgreed ? '#FFFFFF' : '#9EA4A9'}
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_terms_agree'>
                    <rect width='20' height='20' fill='white' />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <label
              htmlFor='terms-all-agree'
              className='cursor-pointer text-[1.25rem] font-bold text-[#464B5]'
            >
              전체 동의하기
            </label>
          </CheckboxPrimitive.Root>

          <div className='flex flex-col gap-[0.75rem]'>
            <div className='flex w-full items-center gap-[0.5rem]'>
              <CheckboxPrimitive.Root
                id='terms-service'
                checked={agreedService}
                onCheckedChange={(checked) => setAgreedService(checked === true)}
                className='ml-[1.25rem] flex cursor-pointer items-center gap-[0.75rem] rounded border-none bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-[#5060C5] focus-visible:ring-offset-2'
              >
                <span className='flex h-[1.25rem] w-[1.25rem] shrink-0 items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                    className='h-[1.25rem] w-[1.25rem]'
                  >
                    <g clipPath='url(#clip0_terms_agree2)'>
                      <path
                        d='M10.0003 18.3334C11.0949 18.3348 12.1789 18.1198 13.1901 17.701C14.2014 17.2821 15.1198 16.6675 15.8928 15.8926C16.6678 15.1196 17.2823 14.2011 17.7012 13.1899C18.1201 12.1787 18.335 11.0946 18.3337 10.0001C18.335 8.90554 18.1201 7.82152 17.7012 6.81029C17.2823 5.79907 16.6678 4.88058 15.8928 4.10759C15.1198 3.33265 14.2014 2.7181 13.1901 2.29922C12.1789 1.88034 11.0949 1.6654 10.0003 1.66675C8.90579 1.6654 7.82176 1.88034 6.81054 2.29922C5.79931 2.7181 4.88082 3.33265 4.10783 4.10759C3.3329 4.88058 2.71834 5.79907 2.29946 6.81029C1.88059 7.82152 1.66565 8.90554 1.667 10.0001C1.66565 11.0946 1.88059 12.1787 2.29946 13.1899C2.71834 14.2011 3.3329 15.1196 4.10783 15.8926C4.88082 16.6675 5.79931 17.2821 6.81054 17.701C7.82176 18.1198 8.90579 18.3348 10.0003 18.3334Z'
                        fill={agreedService ? '#5060C5' : 'none'}
                        stroke={agreedService ? '#5060C5' : '#9EA4A9'}
                        strokeWidth='2'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M6.66699 10L9.16699 12.5L14.167 7.5'
stroke={agreedService ? '#FFFFFF' : '#9EA4A9'}
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_terms_agree2'>
                        <rect width='20' height='20' fill='white' />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <label
                  htmlFor='terms-service'
                  className='flex cursor-pointer items-center gap-[0.25rem] text-[1.25rem] font-bold text-[#000000]'
                >
                  <span>서비스 이용 약관</span>
                  <span className='text-[1.125rem] font-bold text-[#74777D]'>
                    (필수)
                  </span>
                </label>
              </CheckboxPrimitive.Root>
              <button
                type='button'
                onClick={() => setIsTermsOpen((prev) => !prev)}
                aria-label={isTermsOpen ? '약관 접기' : '약관 펼치기'}
                className='flex shrink-0 cursor-pointer items-center justify-center rounded border-none bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[#5060C5] focus-visible:ring-offset-2'
              >
                <span
                  className={`flex transition-transform duration-200 ${isTermsOpen ? 'rotate-180' : ''}`}
                >
                  <DropdownIcon className='h-6 w-6' />
                </span>
              </button>
            </div>
            <div className='overflow-hidden'>
              <AnimatePresence initial={false}>
                {isTermsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.25,
                      ease: 'easeInOut',
                    }}
                  >
                    <div className='ml-[0.25rem] flex flex-col gap-[1.25rem] px-[1.25rem] pb-[3.75rem]'>
                      <div className='flex w-full flex-col gap-[2.5rem] rounded-[1.75rem]'>
                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 1조 (목적) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            본 약관은 티미(Teamie) (이하 &quot;회사&quot;)가
                            제공하는 Folioo 서비스 (이하 &quot;서비스&quot;)의
                            이용 조건, 절차, 회원의 권리·의무 및 책임 사항을
                            규정함을 목적으로 합니다.
                          </p>
                        </div>

                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 2조 (용어의 정의) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            본 약관에서 사용하는 주요 용어의 정의는 다음과
                            같습니다. <br />
                            <span className='ml-[0.25rem] block'>
                              1. &quot;이용권&quot;이란 회원이 서비스 내의 특정
                              기능을 이용할 수 있도록 회사가 발행하는 무형의
                              재화를 말합니다. <br />
                              2. &quot;유료 이용권&quot;이란 회원이 비용을
                              지불하고 구매한 이용권을 말하며, &quot;무료
                              이용권&quot;이란 회사가 이벤트를 통해 무상으로
                              지급한 이용권을 말합{' '}
                              {'\u00A0\u00A0\u00A0\u00A0\u00A0'}니다.
                            </span>
                          </p>
                        </div>

                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 3조 (이용권의 소진 순서 및 유효기간) <br />
                          <p className='font-regular ml-[0.25rem] text-[1.125rem] leading-[150%]'>
                            1. 소진 순서
                            <br />
                            {'\u00A0\u00A0'}• 회원이 서비스를 이용하여 이용권이
                            차감될 때, 유료 및 무료 여부와 관계없이 계정에
                            부여된 일자가 가장 빠른 이용권부터 우선 차감됩니다.
                            <br />
                            2. 유효기간
                            <br />
                            {'\u00A0\u00A0'}• 모든 이용권 (유료 및 무료 포함)의
                            유효기간은 획득일로부터 6개월입니다. 유효기간이
                            경과한 이용권은 자동 소멸하며, 복구되거나 환불하지
                            <br />
                            {'\u00A0\u00A0\u00A0\u00A0\u00A0'}않습니다.
                            <br />
                            3. 예외 사항
                            <br />
                            {'\u00A0\u00A0'}• 단, Open Beta Test 등 특정 이벤트
                            기간에 &apos;매주 초기화&apos; 조건으로 지급된 무료
                            이용권은 해당 이벤트의 자체소멸 규칙을 우선하여
                            따릅니다.
                          </p>
                        </div>

                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 4조 (청약철회 및 환불 정책)
                          <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            회사는「전자상거래 등에서의 소비자보호에 관한 법률」
                            및 「콘텐츠이용자보호지침」에 따라 아래와 같은 환불
                            규정을 적용합니다.
                            <br />
                            <span className='ml-[0.25rem] block'>
                              1. 전액 환불 (청약 철회)
                              <br />
                              {'\u00A0\u00A0'}• 회원은 유료 이용권 결제일로부터
                              7일 이내에, 구매한 이용권을 단 1회도 사용하지 않은
                              상태에 한하여 100% 결제 취소 및 전액 환불을 요청할
                              수 있습니다.
                              <br />
                              2. 부분 환불
                              <br />
                              {'\u00A0\u00A0'}• 결제일로부터 7일이 경과하였거나,
                              구매한 유료 이용권을 1회 이상 사용한 이력이 있는
                              경우 아래의 산정식에 따라 부분 환불이 진행됩니다.
                              <br />
                              {'\u00A0\u00A0'}• 최종 환불 금액 = 총 결제 금액 -
                              (사용 횟수 x 1회 이용권 정상가) - 위약금 (총 결제
                              금액의 10%)
                              <br />
                              3. 부분 환불 유의사항 및 &apos;1회 정상가&apos;의
                              기준
                              <br />
                              {'\u00A0\u00A0'}• 위 산정식에서 &apos;1회 이용권
                              정상가&apos;라 함은 서비스 내 결제 화면에 명시된
                              해당 기능의 &quot;할인이 적용되지 않은 2회권
                              가격의 50%&quot;에 해당하는
                              <br />
                              {'\u00A0\u00A0\u00A0\u00A0'} 금액을 의미합니다.
                              (예: 묶음/ 할인 프로모션을 통해 5회권을 구매한 후
                              부분 환불 시에도, 이미 사용한 횟수는 할인가가 아닌
                              본 항에서 정의한
                              <br />
                              {'\u00A0\u00A0\u00A0\u00A0\u00A0'}1회 정상가를
                              기준으로 차감됩니다.)
                              <br />
                              {'\u00A0\u00A0'}• 산정식에 따른 공제 금액이 총
                              결제 금액을 초과하여 산출 결과가 0원 이하일 경우,
                              환불 가능한 금액은 0원으로 처리되며 회사는
                              회원에게 추가
                              <br />
                              {'\u00A0\u00A0\u00A0\u00A0\u00A0'}금액을 청구하지
                              않습니다.
                              <br />
                              {'\u00A0\u00A0'}• 최종 환불 금액은 회원의 환불
                              요청 접수 후 담당자의 확인 및 정산 절차를 거쳐
                              확정됩니다.
                              <br />
                              {'\u00A0\u00A0'}• 무료 이용권은 어떠한 경우에도
                              환불 대상이 아닙니다.
                              <br />
                              4. 부정이용에 따른 조치
                              <br />
                              {'\u00A0\u00A0'}• 회원이 타인의 결제 정보를
                              도용하거나, 다중 계정 생성 등 부정한 방법으로
                              이용권을 무상 취득 및 사용하는 경우, 회사는 사전
                              통보 없이 해당
                              <br />
                              {'\u00A0\u00A0\u00A0\u00A0\u00A0'}이용권을 전량
                              회수하고 서비스 이용을 영구 정지할 수 있으며 관련
                              결제건은 환불되지 않습니다.
                            </span>
                          </p>
                        </div>

                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 5조 (AI 서비스의 한계 및 면책 조항)
                          <br />
                          <p className='font-regular ml-[0.25rem] text-[1.125rem] leading-[150%]'>
                            1. 회사가 제공하는 서비스는 외부 인공지능 모델을
                            기반으로 결과물을 분석 및 생성합니다. 기술적 한계로
                            인해 생성된 결과물에는 사실과 다르거
                            <br />
                            {'\u00A0\u00A0\u00A0\u00A0'}나, 부정확하거나, 편향된
                            내용 (환각 현상 등)이 포함될 수 있습니다.
                            <br />
                            2. 회사가 제공하는 결과물은 커리어 준비를 위한
                            참고용 자료입니다. 이를 실제 포트폴리오 제출, 취업,
                            이직, 면접 등에 활용하기 전 최종적인 내용
                            <br />
                            {'\u00A0\u00A0\u00A0\u00A0'}검토 및 사실관계 확인의
                            책임은 전적으로 회원 본인에게 있습니다.
                            <br />
                            3. 회사는 회원이 서비스의 결과물을 활용하여 발생한
                            서류 심사 탈락, 취업 실패, 기타 직·간접적인 불이익
                            및 손해에 대하여 일체의 법적 책임을
                            <br />
                            {'\u00A0\u00A0\u00A0\u00A0'}지지 않습니다.
                          </p>
                        </div>

                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 6조 (서비스의 중단 및 책임 제한)
                          <br />
                          <p className='font-regular ml-[0.25rem] text-[1.125rem] leading-[150%]'>
                            1. 회사는 정기 점검, 외부 API의 연동 장애, 클라우드
                            서버 오류, 통신 장애 등 불가피한 사유가 발생한 경우
                            서비스 제공을 일시적으로 중단할 수
                            <br />
                            {'\u00A0\u00A0\u00A0\u00A0'}있습니다.
                            <br />
                            2. 제 1항에 따른 일시적인 서비스 중단은 원칙적으로
                            유료 이용권의 청약철회 및 부분 환불의 사유가 되지
                            않습니다. 단, 사전 공지 없이 회사의 명
                            <br />
                            {'\u00A0\u00A0\u00A0\u00A0'}백한 귀책사유로 인하여
                            서비스 중단이 연속하여 4시간 이상 발생한 경우,
                            회사는 장애 시간에 상응하여 이용권의 유효기간을
                            연장하는 방식으
                            <br />
                            {'\u00A0\u00A0\u00A0\u00A0'}로 보상하며 현금 환불을
                            진행하지 않습니다.
                            <br />
                            3. 회사는 무료로 제공되는 서비스 (무료 이용권
                            포함)의 이용과 관련하여 회원에게 발생한 손해 및
                            서비스 중단에 대해서는 어떠한 법적 책임도 지
                            <br />
                            {'\u00A0\u00A0\u00A0\u00A0'}지 않습니다.
                            <br />
                            4. 회사는 천재지변, 전쟁, 기간통신사업자의 서비스
                            중지, 제휴 업체의 일방적인 정책 변경 및 API 장애 등
                            회사의 통제 범위를 벗어난 불가항력적
                            <br />
                            {'\u00A0\u00A0\u00A0\u00A0'}사유로 인하여 서비스를
                            제공할 수 없는 경우에는 그 책임이 면제됩니다.
                          </p>
                        </div>

                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 7조 (약관의 효력 및 변경)
                          <br />
                          <p className='font-regular ml-[0.25rem] text-[1.125rem] leading-[150%]'>
                            1. 본 약관은 2026년 3월 9일부터 적용됩니다.
                            <br />
                            2. 법령·정책·서비스 변경에 따라 내용이 변경될 경우,
                            변경 사유 및 시행일자를 명시하여 사전 공지합니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 개인정보 처리방침 (필수) */}
            <div className='flex w-full items-center gap-[0.5rem]'>
              <CheckboxPrimitive.Root
                id='terms-privacy'
                checked={agreedPrivacy}
                onCheckedChange={(checked) => setAgreedPrivacy(checked === true)}
                className='ml-[1.25rem] flex cursor-pointer items-center gap-[0.75rem] rounded border-none bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-[#5060C5] focus-visible:ring-offset-2'
              >
                <span className='flex h-[1.25rem] w-[1.25rem] shrink-0 items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                    className='h-[1.25rem] w-[1.25rem]'
                  >
                    <g clipPath='url(#clip0_terms_privacy)'>
                      <path
                        d='M10.0003 18.3334C11.0949 18.3348 12.1789 18.1198 13.1901 17.701C14.2014 17.2821 15.1198 16.6675 15.8928 15.8926C16.6678 15.1196 17.2823 14.2011 17.7012 13.1899C18.1201 12.1787 18.335 11.0946 18.3337 10.0001C18.335 8.90554 18.1201 7.82152 17.7012 6.81029C17.2823 5.79907 16.6678 4.88058 15.8928 4.10759C15.1198 3.33265 14.2014 2.7181 13.1901 2.29922C12.1789 1.88034 11.0949 1.6654 10.0003 1.66675C8.90579 1.6654 7.82176 1.88034 6.81054 2.29922C5.79931 2.7181 4.88082 3.33265 4.10783 4.10759C3.3329 4.88058 2.71834 5.79907 2.29946 6.81029C1.88059 7.82152 1.66565 8.90554 1.667 10.0001C1.66565 11.0946 1.88059 12.1787 2.29946 13.1899C2.71834 14.2011 3.3329 15.1196 4.10783 15.8926C4.88082 16.6675 5.79931 17.2821 6.81054 17.701C7.82176 18.1198 8.90579 18.3348 10.0003 18.3334Z'
                        fill={agreedPrivacy ? '#5060C5' : 'none'}
                        stroke={agreedPrivacy ? '#5060C5' : '#9EA4A9'}
                        strokeWidth='2'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M6.66699 10L9.16699 12.5L14.167 7.5'
                        stroke={agreedPrivacy ? '#FFFFFF' : '#9EA4A9'}
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </g>
                    <defs>
                      <clipPath id='clip0_terms_privacy'>
                        <rect width='20' height='20' fill='white' />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <label
                  htmlFor='terms-privacy'
                  className='flex cursor-pointer items-center gap-[0.25rem] text-[1.25rem] font-bold text-[#000000]'
                >
                  <span>개인정보 처리방침</span>
                  <span className='text-[1.125rem] font-bold text-[#74777D]'>
                    (필수)
                  </span>
                </label>
              </CheckboxPrimitive.Root>
              <button
                type='button'
                onClick={() => setIsPrivacyOpen((prev) => !prev)}
                aria-label={isPrivacyOpen ? '약관 접기' : '약관 펼치기'}
                className='flex shrink-0 cursor-pointer items-center justify-center rounded border-none bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[#5060C5] focus-visible:ring-offset-2'
              >
                <span
                  className={`flex transition-transform duration-200 ${isPrivacyOpen ? 'rotate-180' : ''}`}
                >
                  <DropdownIcon className='h-6 w-6' />
                </span>
              </button>
            </div>
            <div className='overflow-hidden'>
              <AnimatePresence initial={false}>
                {isPrivacyOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className='ml-[0.25rem] flex flex-col gap-[1.25rem] px-[1.25rem] pb-[3.75rem]'>
                      <div className='flex w-full flex-col gap-[2.5rem]'>
                        <div className='flex flex-col text-[1.125rem] leading-[150%] text-[#464B53]'>
                          <p>
                            티미(Teamie) (이하 &quot;회사&quot;)는 회사가
                            제공하는 Folioo 서비스 (이하 &quot;서비스&quot;)를
                            이용하는 이용자 (이하 &quot;이용자&quot; 또는
                            &quot;정보주체&quot;)의 자유와 권리를 보호하기
                            위해「개인정보 보호법」및 관계 법령이 정한 바를
                            준수하여, 적법하게 개인정보를 처리하고 안전하게
                            관리하고 있습니다.
                          </p>
                          <p>
                            이에「개인정보 보호법」제30조에 따라 이용자에게
                            개인정보 처리에 관한 절차 및 기준을 투명하게
                            안내하고, 이와 관련한 고충을 신속하고 원활하게
                            처리할 수 있도록 하기 위하여 다음과 같이 개인정보
                            처리방침을 수립 및 공개합니다.
                          </p>
                        </div>
                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 1조 (개인정보의 처리 목적) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            회사는 다음의 목적을 위하여 개인정보를 처리합니다.
                            <br />
                            처리하고 있는 개인정보는 다음의 목적 이외의 용도로는
                            이용되지 않으며, 이용 목적이 변경되는 경우에는
                            별도의 동의를 받는 등 필요한 조치를 이행할
                            예정입니다.
                            <span className='ml-[0.25rem] block'>
                              1. 회원 가입 및 관리
                              <br />
                              {'\u00A0\u00A0'}• 소셜 로그인(OAuth) 연동 본인
                              확인, 가입 의사 확인, 계정 통합 처리, 다중 계정
                              생성 및 이용권 부정 수급 방지, 고객 문의 대응
                              <br />
                              2. 재화 및 서비스 제공
                              <br />
                              {'\u00A0\u00A0'}• 유료 이용권 구매 및 결제 처리,
                              이용권 지급·사용·만료·환불 처리, AI 기반 커리어
                              지원 서비스 제공
                              <br />
                              3. 서비스 개선 및 통계 분석
                              <br />
                              {'\u00A0\u00A0'}• 서비스 이용 기록 기반의 통계
                              분석, 신규 기능 개발 및 AI 서비스 품질 향상
                            </span>
                          </p>
                        </div>
                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 2조 (수집하는 개인정보의 항목) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            <span className='ml-[0.25rem] block'>
                              1. 회원가입 시 필수 수집 항목
                              <br />
                              {'\u00A0\u00A0'}• 성명, 이메일 주소, 로그인타입,
                              로그인식별자, 전화번호
                              <br />
                              2. 서비스 이용 과정에서 자동으로 생성·수집되는
                              항목
                              <br />
                              {'\u00A0\u00A0'}• IP 주소, 접속 로그, 쿠키, 서비스
                              이용 기록, 기기 정보
                              <br />
                              3. 유료 이용권 결제 시 수집 항목
                              <br />
                              {'\u00A0\u00A0'}• 결제 수단 정보 (PayAPP을 통한
                              신용카드, 계좌번호 등 일부 정보)
                              <br />
                              4. 민감정보 처리 제한
                              <br />
                              {'\u00A0\u00A0'}• 회사는 이용자의 사상·신념, 건강
                              등에 관한 민감정보를 수집하지 않습니다.
                            </span>
                          </p>
                        </div>
                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 3조 (개인정보의 처리 및 보유 기간) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            회사는 법령에 따른 개인정보 보유·이용기간 또는
                            정보주체로부터 개인정보를 수집 시에 동의 받은 기간
                            내에서 개인정보를 처리 및 보유합니다.
                            <span className='ml-[0.25rem] block'>
                              1. 원칙적 파기
                              <br />
                              {'\u00A0\u00A0'}• 회원 탈퇴 시 이름, 이메일 주소,
                              로그인 식별자 등 기본 식별 정보는 지체 없이 영구
                              파기됩니다.
                              <br />
                              2. 부정이용 방지를 위한 전화번호 보관
                              <br />
                              {'\u00A0\u00A0'}• 무료 이용권 중복 수급, 다중 계정
                              생성 등 서비스 부정 이용 방지를 위하여 회원
                              탈퇴일로부터 1년간 전화번호를 암호화하여 보관한 후
                              파기합
                              <br />
                              {'\u00A0\u00A0\u00A0\u00A0\u00A0'}니다.
                              <br />
                              3. 이용권 거래 내역 보관
                              <br />
                              {'\u00A0\u00A0'}• 「전자상거래 등에서의
                              소비자보호에 관한 법률」에 따라, 모든 이용권에
                              대한 거래 내역 (구매, 지급, 사용, 만료, 환불 등에
                              관한 기록)은 5년간
                              <br />
                              {'\u00A0\u00A0\u00A0\u00A0\u00A0'}보관됩니다.
                              <br />
                              4. AI 생성 데이터의 분리 보관
                              <br />
                              {'\u00A0\u00A0'}• 이용 메타데이터와, 서비스 내
                              AI를 사용하는 기능 사용 시 입력 및 생성된 데이터
                              결과물은 회원 탈퇴 시 계정(User ID)과의 연결이
                              영구적으로
                              <br />
                              {'\u00A0\u00A0\u00A0\u00A0\u00A0'}해제되며, 특정
                              개인을 식별할 수 없는 데이터 상태로 서비스 품질
                              향상을 위해 영구 보관됩니다.
                            </span>
                          </p>
                        </div>
                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 4조 (개인정보의 제 3자 제공 및 처리 위탁) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            <span className='ml-[0.25rem] block'>
                              1. 개인정보 처리 위탁
                              <br />
                              회사는 원활한 서비스 제공을 위하여 다음과 같이
                              개인정보 처리 업무를 외부에 위탁하고 있습니다.
                              <br />
                              {'\u00A0\u00A0'}• 서버 및 데이터 보관: Amazon Web
                              Services (AWS)
                              <br />
                              {'\u00A0\u00A0'}• 결제 처리 (PG): PayAPP (페이앱)
                              <br />
                              {'\u00A0\u00A0'}• AI 텍스트 및 이미지 처리: OpenAI
                              (※ 전송된 데이터는 AI 모델 학습용으로 사용되지
                              않습니다.)
                              <br />
                              {'\u00A0\u00A0'}• 서비스 이용 기록 기반의 통계
                              분석, 신규 기능 개발 및 AI 서비스 품질 향상
                              <br />
                              2. 개인정보의 제3자 제공
                              <br />
                              회사는 원칙적으로 이용자의 개인정보를 외부에
                              제공하지 않습니다. 단, 다음의 경우에는 예외로
                              합니다.
                              <br />
                              {'\u00A0\u00A0'}• 이용자가 사전에 동의한 경우
                              <br />
                              {'\u00A0\u00A0'}• 법령의 규정에 따른 경우 또는
                              수사 목적으로 법령에 정해진 절차와 방법에 따라
                              수사기관의 요구가 있는 경우
                            </span>
                          </p>
                        </div>
                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 5조 (정보주체의 권리, 의무 및 행사방법) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            정보주체는 언제든지 본인의 개인정보 열람, 정정,
                            삭제(회원탈퇴)를 요구할 수 있습니다. 탈퇴 시 제3조에
                            명시된 보관 정보를 제외한 개인 식별
                            <br />
                            정보는 복구 불가능한 방법으로 파기됩니다.
                          </p>
                        </div>
                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 6조 (개인정보 보호책임자 및 담당자 연락처) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            회사는 개인정보 처리에 관한 업무를 총괄하여 책임지는
                            개인정보 보호책임자를 지정하고 있습니다.
                            <span className='ml-[0.25rem] block'>
                              {'\u00A0\u00A0'}• 개인정보 보호책임자: 김수빈
                              <br />
                              {'\u00A0\u00A0'}• 소속/ 직위: 티미(Teamie)/ 대표
                            </span>
                          </p>
                        </div>
                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 7조 (개인정보처리방침의 효력 및 변경) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            <span className='ml-[0.25rem] block'>
                              1. 본 방침은 2026년 3월 9일부터 적용됩니다.
                              <br />
                              2. 법령·정책·서비스 변경에 따라 내용이 변경될
                              경우, 변경 사유 및 시행일자를 명시하여 사전
                              공지합니다.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 마케팅 정보 수신 (선택) */}
            <div className='flex w-full items-center gap-[0.5rem]'>
              <CheckboxPrimitive.Root
                id='terms-marketing'
                checked={agreedMarketing}
                onCheckedChange={(checked) =>
                  setAgreedMarketing(checked === true)
                }
                className='ml-[1.25rem] flex cursor-pointer items-center gap-[0.75rem] rounded border-none bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-[#5060C5] focus-visible:ring-offset-2'
              >
                <span className='flex h-[1.25rem] w-[1.25rem] shrink-0 items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                    className='h-[1.25rem] w-[1.25rem]'
                  >
                    <g clipPath='url(#clip0_terms_marketing)'>
                      <path
                        d='M10.0003 18.3334C11.0949 18.3348 12.1789 18.1198 13.1901 17.701C14.2014 17.2821 15.1198 16.6675 15.8928 15.8926C16.6678 15.1196 17.2823 14.2011 17.7012 13.1899C18.1201 12.1787 18.335 11.0946 18.3337 10.0001C18.335 8.90554 18.1201 7.82152 17.7012 6.81029C17.2823 5.79907 16.6678 4.88058 15.8928 4.10759C15.1198 3.33265 14.2014 2.7181 13.1901 2.29922C12.1789 1.88034 11.0949 1.6654 10.0003 1.66675C8.90579 1.6654 7.82176 1.88034 6.81054 2.29922C5.79931 2.7181 4.88082 3.33265 4.10783 4.10759C3.3329 4.88058 2.71834 5.79907 2.29946 6.81029C1.88059 7.82152 1.66565 8.90554 1.667 10.0001C1.66565 11.0946 1.88059 12.1787 2.29946 13.1899C2.71834 14.2011 3.3329 15.1196 4.10783 15.8926C4.88082 16.6675 5.79931 17.2821 6.81054 17.701C7.82176 18.1198 8.90579 18.3348 10.0003 18.3334Z'
                        fill={agreedMarketing ? '#5060C5' : 'none'}
                        stroke={agreedMarketing ? '#5060C5' : '#9EA4A9'}
                        strokeWidth='2'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M6.66699 10L9.16699 12.5L14.167 7.5'
                        stroke={agreedMarketing ? '#FFFFFF' : '#9EA4A9'}
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </g>
                    <defs>
                      <clipPath id='clip0_terms_marketing'>
                        <rect width='20' height='20' fill='white' />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <label
                  htmlFor='terms-marketing'
                  className='flex cursor-pointer items-center gap-[0.25rem] text-[1.25rem] font-bold text-[#000000]'
                >
                  <span>마케팅 정보 수신</span>
                  <span className='text-[1.125rem] font-bold text-[#74777D]'>
                    (선택)
                  </span>
                </label>
              </CheckboxPrimitive.Root>
              <button
                type='button'
                onClick={() => setIsMarketingOpen((prev) => !prev)}
                aria-label={isMarketingOpen ? '약관 접기' : '약관 펼치기'}
                className='flex shrink-0 cursor-pointer items-center justify-center rounded border-none bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[#5060C5] focus-visible:ring-offset-2'
              >
                <span
                  className={`flex transition-transform duration-200 ${isMarketingOpen ? 'rotate-180' : ''}`}
                >
                  <DropdownIcon className='h-6 w-6' />
                </span>
              </button>
            </div>
            <div className='overflow-hidden'>
              <AnimatePresence initial={false}>
                {isMarketingOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className='ml-[0.25rem] flex flex-col gap-[1.25rem] px-[1.25rem]'>
                      <div className='flex w-full flex-col gap-[2.5rem]'>
                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 1조 (목적) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            이 약관은 티미(Teamie) (이하 &quot;회사&quot;)는
                            회사가 제공하는 Folioo 서비스 (이하
                            &quot;서비스&quot;) 이용자에게 마케팅 정보(서비스
                            업데이트, 이벤트·프로모션, 설문조사, 신규 기능 안내
                            등)를 전송하기 위해 필요한 수신 동의 사항을 규정함을
                            목적으로 합니다.
                            <br />
                          </p>
                        </div>
                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 2조 (정의) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            <span className='ml-[0.25rem] block'>
                              1. &quot;마케팅 정보&quot;란 회사가 제공하는
                              서비스 관련 소식, 이벤트·프로모션, 설문조사, 신규
                              기능 안내 등을 의미합니다.
                              <br />
                              2. &quot;수신 동의&quot;란 이용자가 회사로부터
                              마케팅 정보를 수신하는 것에 대해 명시적으로
                              동의하는 행위를 말합니다.
                            </span>
                          </p>
                        </div>
                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 3조 (수집 및 이용 항목) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            본 약관에서 사용하는 주요 용어의 정의는 다음과
                            같습니다. <br />
                            <span className='ml-[0.25rem] block'>
                              1. 수집 항목
                              <br />
                              {'\u00A0\u00A0'}• 성명, 이메일 주소, 전화번호
                              <br />
                              2. 이용 목적
                              <br />
                              {'\u00A0\u00A0'}• 마케팅 정보의 발송과 통계·분석을
                              통한 서비스 개선
                            </span>
                          </p>
                        </div>
                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 4조 (수신 방법) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            회사는 본 약관에 동의한 이용자에게 아래 채널을 통해
                            마케팅 정보를 발신할 수 있습니다.
                            <br />
                            <span className='ml-[0.25rem] block'>
                              1. 이메일
                              <br />
                              2. SMS (문자)
                              <br />
                              3. 카카오톡 등 메신저 서비스
                            </span>
                          </p>
                        </div>
                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 5조 (보유 및 이용 기간) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            <span className='ml-[0.25rem] block'>
                              1. 수신 동의 철회 전까지 회사는 동의 정보를
                              보유·이용합니다.
                              <br />
                              2. 동의 철회 시 회사는 지체 없이 해당 정보의
                              &apos;마케팅 목적 이용&apos;을 중단합니다. 단,
                              서비스 가입 및 이용을 위해 필수 수집된 식별 정보는
                              회사
                              <br />
                              {'\u00A0\u00A0\u00A0\u00A0'}「개인정보처리방침」에
                              명시된 기간 동안 안전하게 보관됩니다.
                            </span>
                          </p>
                        </div>
                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 6조 (동의 거부 및 철회 방법) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            본 약관에서 사용하는 주요 용어의 정의는 다음과
                            같습니다. <br />
                            <span className='ml-[0.25rem] block'>
                              1. 서비스 내의 [프로필 &gt; &apos;마케팅 정보 수신
                              동의&apos; 토글]을 통해 수신 동의를 철회하실 수
                              있습니다.
                            </span>
                          </p>
                        </div>
                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 7조 (동의 거부에 따른 불이익) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            <span className='ml-[0.25rem] block'>
                              1. 본 동의는 선택 사항이므로 동의를 거부하실 수
                              있습니다. 동의를 거부하시더라도 서비스의 가입 및
                              이용에는 아무런 불이익이 없습니다.
                              <br />
                              {'\u00A0\u00A0\u00A0\u00A0'}단, 동의 거부 시
                              마케팅 정보를 통한 유용한 혜택 제공이 제한될 수
                              있습니다.
                            </span>
                          </p>
                        </div>
                        <div className='text-[1.125rem] font-bold text-[#464B53]'>
                          제 8조 (약관의 효력 및 변경) <br />
                          <p className='font-regular text-[1.125rem] leading-[150%]'>
                            <span className='ml-[0.25rem] block'>
                              1. 본 약관은 2026년 3월 9일부터 적용됩니다.
                              <br />
                              2. 법령·정책·서비스 변경에 따라 내용이 변경될
                              경우, 변경 사유 및 시행일자를 명시하여 사전
                              공지합니다.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
