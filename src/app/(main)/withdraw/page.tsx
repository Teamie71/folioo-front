'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { BackButton } from '@/components/BackButton';
import { CommonButton } from '@/components/CommonButton';
import { Checkbox } from '@/components/ui/CheckBox';
import { Dropdown } from '@/components/Dropdown';
import TextField from '@/components/TextField';
import { CommonModal } from '@/components/CommonModal';

export default function WithdrawPage() {
  const router = useRouter();
  const [isAgreed, setIsAgreed] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState<string>('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  // TODO: 실제 사용자 이름으로 교체 필요
  const userName = '○○○';

  const withdrawReasons = [
    { id: '1', label: '이미 취업에 성공했어요.' },
    { id: '2', label: '크레딧 금액이 너무 비싸요.' },
    { id: '3', label: '생성된 결과물이 마음에 들지 않아요.' },
    { id: '4', label: '기타' },
  ];

  const handleWithdraw = () => {
    if (!isAgreed || !withdrawReason) return;
    setIsConfirmModalOpen(true);
  };

  const handleConfirmWithdraw = () => {
    setIsConfirmModalOpen(false);
    // TODO: 탈퇴 API 호출
    // 회원 탈퇴 로직 구현
    console.log('회원 탈퇴 처리');
    setIsCompleteModalOpen(true);
  };

  return (
    <div className='mx-auto w-full max-w-[66rem] py-[2rem]'>
      <div className='flex flex-col'>
        {/* 헤더 */}
        <div className='flex items-center gap-[1.25rem]'>
          <BackButton />
          <h1 className='text-[1.5rem] font-bold text-[#000000]'>회원 탈퇴</h1>
        </div>

        {/* 메인 질문부터 시작하는 섹션 */}
        <div>
          {/* 메인 질문 */}
          <div className='mt-[4.5rem] pl-[1.75rem]'>
            <h2 className='text-[1.5rem] font-bold text-[#000000]'>
              {userName}님, 정말 탈퇴하시겠어요?
            </h2>
          </div>

          {/* 경고 박스 */}
          <div className='mt-[1.25rem] flex flex-col gap-[1.75rem] rounded-[1.5rem] border border-[#CDD0D5] bg-[#FDFDFD] p-[1.75rem]'>
          {/* 경고 1 */}
          <div className='flex items-start gap-[0.75rem]'>
            <div className='flex h-[1.75rem] w-[1.75rem] shrink-0 items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='28'
                height='28'
                viewBox='0 0 28 28'
                fill='none'
                className='h-[1.75rem] w-[1.75rem]'
              >
                <path
                  d='M13.9997 2.33325C7.55618 2.33325 2.33301 7.55642 2.33301 13.9999C2.33301 20.4434 7.55618 25.6666 13.9997 25.6666C20.4432 25.6666 25.6663 20.4434 25.6663 13.9999C25.6663 7.55642 20.4432 2.33325 13.9997 2.33325ZM15.1663 19.8333H12.833V17.4999H15.1663V19.8333ZM15.1663 15.1666H12.833L12.2497 8.16659H15.7497L15.1663 15.1666Z'
                  fill='#DC0000'
                />
              </svg>
            </div>
            <p className='text-[1.125rem] font-semibold leading-[150%] text-[#000000]'>
              지금 탈퇴하시면 생성한 커리어 기록과 남은 크레딧이 모두
              소멸돼요.
            </p>
          </div>

          {/* 경고 2 */}
          <div className='flex items-start gap-[0.75rem]'>
            <div className='flex h-[1.75rem] w-[1.75rem] shrink-0 items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='28'
                height='28'
                viewBox='0 0 28 28'
                fill='none'
                className='h-[1.75rem] w-[1.75rem]'
              >
                <path
                  d='M13.9997 2.33325C7.55618 2.33325 2.33301 7.55642 2.33301 13.9999C2.33301 20.4434 7.55618 25.6666 13.9997 25.6666C20.4432 25.6666 25.6663 20.4434 25.6663 13.9999C25.6663 7.55642 20.4432 2.33325 13.9997 2.33325ZM15.1663 19.8333H12.833V17.4999H15.1663V19.8333ZM15.1663 15.1666H12.833L12.2497 8.16659H15.7497L15.1663 15.1666Z'
                  fill='#DC0000'
                />
              </svg>
            </div>
            <p className='text-[1.125rem] font-semibold leading-[150%] text-[#000000]'>
              소멸된 모든 기록은 재가입 시에도 복구되지 않아요.
            </p>
          </div>

          {/* 경고 3 */}
          <div className='flex items-start gap-[0.75rem]'>
            <div className='flex h-[1.75rem] w-[1.75rem] shrink-0 items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='28'
                height='28'
                viewBox='0 0 28 28'
                fill='none'
                className='h-[1.75rem] w-[1.75rem]'
              >
                <path
                  d='M13.9997 2.33325C7.55618 2.33325 2.33301 7.55642 2.33301 13.9999C2.33301 20.4434 7.55618 25.6666 13.9997 25.6666C20.4432 25.6666 25.6663 20.4434 25.6663 13.9999C25.6663 7.55642 20.4432 2.33325 13.9997 2.33325ZM15.1663 19.8333H12.833V17.4999H15.1663V19.8333ZM15.1663 15.1666H12.833L12.2497 8.16659H15.7497L15.1663 15.1666Z'
                  fill='#DC0000'
                />
              </svg>
            </div>
            <p className='text-[1.125rem] font-semibold leading-[150%] text-[#000000]'>
              인증된 휴대폰번호는 재가입 시 사용해도 가입 선물이 제공되지 않아요.
            </p>
          </div>
          </div>

          {/* 개인정보처리방침 링크 */}
          <div className='mt-[1.25rem] h-[1.5rem] text-[1rem] text-[#74777D] pl-[1.75rem] leading-[1.5rem]'>
          개인정보 관련 자세한 규정은{' '}
          <a
            href='#'
            className='underline'
            onClick={(e) => {
              e.preventDefault();
              // TODO: 개인정보처리방침 페이지 경로로 이동
            }}
          >
            개인정보처리방침
          </a>
          을 확인해주세요.
          </div>

          {/* 체크박스 */}
          <div className='mt-[0.5rem] flex h-[1.5rem] items-center gap-[0.75rem] pl-[1.75rem]'>
          <CheckboxPrimitive.Root
            id='withdraw-agreement'
            checked={isAgreed}
            onCheckedChange={(checked) => setIsAgreed(checked === true)}
            className='flex h-[1.25rem] w-[1.25rem] shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[#5060C5] focus-visible:ring-offset-2'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              className='h-[1.25rem] w-[1.25rem]'
            >
              <g clipPath='url(#clip0_3242_4761)'>
                <path
                  d='M10.0003 18.3334C11.0949 18.3348 12.1789 18.1198 13.1901 17.701C14.2014 17.2821 15.1198 16.6675 15.8928 15.8926C16.6678 15.1196 17.2823 14.2011 17.7012 13.1899C18.1201 12.1787 18.335 11.0946 18.3337 10.0001C18.335 8.90554 18.1201 7.82152 17.7012 6.81029C17.2823 5.79907 16.6678 4.88058 15.8928 4.10759C15.1198 3.33265 14.2014 2.7181 13.1901 2.29922C12.1789 1.88034 11.0949 1.6654 10.0003 1.66675C8.90579 1.6654 7.82176 1.88034 6.81054 2.29922C5.79931 2.7181 4.88082 3.33265 4.10783 4.10759C3.3329 4.88058 2.71834 5.79907 2.29946 6.81029C1.88059 7.82152 1.66565 8.90554 1.667 10.0001C1.66565 11.0946 1.88059 12.1787 2.29946 13.1899C2.71834 14.2011 3.3329 15.1196 4.10783 15.8926C4.88082 16.6675 5.79931 17.2821 6.81054 17.701C7.82176 18.1198 8.90579 18.3348 10.0003 18.3334Z'
                  fill={isAgreed ? '#5060C5' : 'none'}
                  stroke={isAgreed ? '#5060C5' : '#9EA4A9'}
                  strokeWidth='2'
                  strokeLinejoin='round'
                />
                <path
                  d='M6.66699 10L9.16699 12.5L14.167 7.5'
                  stroke={isAgreed ? '#FFFFFF' : '#9EA4A9'}
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </g>
              <defs>
                <clipPath id='clip0_3242_4761'>
                  <rect width='20' height='20' fill='white' />
                </clipPath>
              </defs>
            </svg>
          </CheckboxPrimitive.Root>
          <label
            htmlFor='withdraw-agreement'
            className={`cursor-pointer text-[1rem] ${
              isAgreed ? 'text-[#5060C5]' : 'text-[#74777D]'
            }`}
          >
            회원 탈퇴 유의사항을 확인하였으며, 이에 동의합니다.
          </label>
        </div>
        <div className='mt-[4.5rem] pl-[1.75rem]'>
            <h2 className='text-[1.5rem] font-bold text-[#000000]'>
              {userName}님께서 탈퇴하시려는 이유를 알려주세요.
            </h2>
        </div>
        <div className='mt-[0.75rem] h-[1.5rem] text-[1rem] text-[#74777D] pl-[1.75rem] leading-[1.5rem]'>
          전해주신 의견을 참고하여 더 나은 Folioo를 만들게요.
        </div>
        {/* 탈퇴 이유 선택 드롭다운 */}
        <div className='mt-[1.25rem] pl-[1.75rem]'>
          <Dropdown
            items={withdrawReasons}
            placeholder='탈퇴 이유 선택'
            value={withdrawReason}
            onChange={setWithdrawReason}
            inputClassName='w-[23.5rem]'
            menuClassName='w-[23.5rem]'
          />
        </div>

        {/* 선택된 이유에 따른 조건부 UI */}
        {withdrawReason === '1' && (
          <div className='mt-[2rem] pl-[1.75rem]'>
            <p className='text-[1rem] leading-[150%] text-[#000000]'>
              Folioo는 신입과 주니어가 각각 특화된 결과물을 얻을 수 있도록
              기능을 개선하고 있어요.
              <br />
              계정을 유지하고, 추후 이직 준비 시에 다시 찾아주시면 어떨까요?
              <br />
              기록이 유지되면 더 좋은 결과물을 기대하실 수 있을 거예요!
            </p>
          </div>
        )}

        {withdrawReason === '2' && (
          <div className='mt-[2.5rem] pl-[1.75rem]'>
            <p className='text-[1rem] leading-[150%] text-[#000000]'>
              Folioo에서는 이벤트를 통해서도 크레딧 충전이 가능해요.
              <br />
              크레딧 충전 페이지와 공식 인스타그램 계정 (@Folioo_AI)에 업데이트
              되는 이벤트를 확인하고, 
              <br />
              참여하여 무료 크레딧을 받아보세요!
            </p>
            <div className='mt-[2rem] flex flex-col gap-[0.75rem]'>
              <a
                href='#'
                className='text-[1rem] text-[#1A1A1A] underline underline-offset-[3px]'
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: 크레딧 충전 페이지로 이동
                }}
              >
                크레딧 충전 페이지 확인하기
              </a>
              <a
                href='#'
                className='text-[1rem] text-[#1A1A1A] underline underline-offset-[3px]'
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: 인스타그램 링크로 이동
                }}
              >
                공식 인스타그램 계정 확인하기
              </a>
            </div>
          </div>
        )}

        {withdrawReason === '3' && (
          <div className='mt-[2rem] pl-[1.75rem]'>
            <p className='text-[1rem] leading-[150%] text-[#000000]'>
              Folioo의 기능이 만족스럽지 않으셨다니 진심으로 죄송해요. 
              <br />
              기능을 개선할 수 있도록 피드백을 남겨주시면, 더 좋은 결과물을 얻으실 수
              있도록 노력할게요. 
              <br />
              계정을 유지하고, 추후 기능 업데이트 시에 다시
              찾아주시면 어떨까요?
            </p>
            <a
              href='#'
              className='mt-[2rem] inline-block text-[1rem] text-[#1A1A1A] underline underline-offset-[3px]'
              onClick={(e) => {
                e.preventDefault();
                // TODO: 피드백 페이지로 이동
              }}
            >
              피드백 남기러 가기 →
            </a>
          </div>
        )}

        {withdrawReason === '4' && (
          <div className='mt-[1.5rem] pl-[1.75rem]'>
            <TextField
              placeholder='이유를 알려주세요.'
              height='8rem'
            />
          </div>
        )}

        {/* 탈퇴 버튼 */}
          <div className='mt-[2.5rem] pl-[1.75rem]'>
            <CommonButton
              variantType='Primary'
              px='2.25rem'
              py='0.875rem'
              onClick={handleWithdraw}
              disabled={!isAgreed || !withdrawReason}
            >
              탈퇴하기
            </CommonButton>
          </div>
        </div>
      </div>

      {/* 탈퇴 확인 모달 */}
      <CommonModal
        open={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        title='정말 탈퇴하시겠습니까?'
        cancelBtnText='취소'
        secondaryBtnText='탈퇴'
        onCancelClick={() => setIsConfirmModalOpen(false)}
        onSecondaryClick={handleConfirmWithdraw}
      />

      {/* 탈퇴 완료 모달 */}
      <CommonModal
        open={isCompleteModalOpen}
        onOpenChange={setIsCompleteModalOpen}
        title='탈퇴가 완료되었습니다.'
        description='Folioo가 당신의 커리어를 응원해요!'
      />
    </div>
  );
}
