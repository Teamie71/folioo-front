'use client';

import { PaymentIcon } from '@/components/icons/PaymentIcon';
import { RefundReasonDropdown } from '@/features/invoice/refund/components/RefundReasonDropdown';
import { RefundCompleteModal } from '@/features/invoice/refund/components/RefundCompleteModal';
import { RefundConfirmationModal } from '@/features/invoice/refund/components/RefundConfirmationModal';
import { useState } from 'react';

interface InvoiceRefundClientMobileProps {
  selectedReason: string | null;
  setSelectedReason: (reason: string | null) => void;
  isCompleteModalOpen: boolean;
  setIsCompleteModalOpen: (open: boolean) => void;
  canSubmit: boolean;
}

export default function InvoiceRefundClientMobile({
  selectedReason,
  setSelectedReason,
  isCompleteModalOpen,
  setIsCompleteModalOpen,
  canSubmit,
}: InvoiceRefundClientMobileProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleConfirmClick = () => {
    setIsConfirmModalOpen(false);
    setIsCompleteModalOpen(true);
  };
  return (
    <div className='mt-[1.5rem] flex flex-col gap-[1.5rem] px-[1rem]'>
      {/* 결제 요약 카드 */}
      <div className='flex flex-col gap-[0.75rem] rounded-[1.25rem] bg-[#FDFDFD] p-[1rem]'>
        <div className='flex flex-col gap-[0.5rem]'>
          <div className='flex items-center gap-[0.75rem]'>
            <PaymentIcon />
            <span className='typo-b1-sb'>결제 요약</span>
          </div>
          <span className='typo-c1 text-[#74777D]'>
            결제 정보를 확인하고 환불을 진행해 주세요.
          </span>
        </div>

        <div className='bg-gray4 h-[1px]' />

        <div className='flex flex-col gap-[1.5rem] py-[1rem]'>
          {/* 주문번호 / TID */}
          <div className='flex flex-col gap-[0.5rem]'>
            <span className='text-[0.875rem] text-[#74777D]'>
              주문번호 / 승인번호(TID)
            </span>
            <div className='flex flex-col'>
              <span className='text-[1rem] font-bold text-[#1A1A1A]'>
                OOO-00000000-0000
              </span>
              <span className='text-[0.875rem] text-[#74777D]'>
                TID-000000000
              </span>
            </div>
          </div>

          {/* 결제일시 */}
          <div className='flex flex-col gap-[0.5rem]'>
            <span className='text-[0.875rem] text-[#74777D]'>결제일시</span>
            <span className='text-[1rem] font-bold text-[#1A1A1A]'>
              YY.MM.DD 00:00
            </span>
          </div>

          {/* 결제수단 */}
          <div className='flex flex-col gap-[0.5rem]'>
            <span className='text-[0.875rem] text-[#74777D]'>결제수단</span>
            <span className='text-[1rem] font-bold text-[#1A1A1A]'>
              신용카드
            </span>
          </div>
        </div>

        <div className='bg-gray4 h-[1.125px]' />

        <div className='flex items-center justify-between'>
          <span className='mt-[1rem] text-[1.125rem] font-bold text-[#1A1A1A]'>
            총 결제 금액
          </span>
          <span className='text-[1.125rem] font-bold text-[#1A1A1A]'>
            00,000원
          </span>
        </div>
      </div>

      {/* 환불 예정 금액 박스 */}
      <div className='flex items-center justify-between rounded-[0.75rem] bg-[#F6F5FF] px-[1.25rem] py-[1.5rem]'>
        <span className='text-[1.125rem] font-bold text-[#1A1A1A]'>
          환불 예정 금액
        </span>
        <span className='text-[1.125rem] font-bold text-[#5060C5]'>
          00,000원
        </span>
      </div>

      {/* 안내 문구 */}
      <p className='text-[0.75rem] leading-[150%] text-[#898989]'>
        결제 후 7일이 지났거나 사용 이력이 있는 경우, 부분 환불이 진행됩니다.
        환불 금액은 사용하신 횟수 (정상가 기준 차감)와 위약금 (총 결제액의
        10%)을 공제한 후 산정되며, 최종 환불 금액은 담당자 확인 후 확정됩니다.
        자세한 내용은 서비스 이용약관을 참고해주세요.
      </p>

      {/* 이유 선택 및 신청 버튼 */}
      <div className='mt-2 flex flex-col gap-[0.75rem] pb-[2.5rem]'>
        <RefundReasonDropdown
          value={selectedReason}
          onChange={setSelectedReason}
        />

        <button
          type='button'
          disabled={!canSubmit}
          onClick={() => setIsConfirmModalOpen(true)}
          className={`flex h-[3.5rem] w-full items-center justify-center rounded-[0.75rem] text-[1.125rem] font-bold text-white transition-colors ${
            canSubmit
              ? 'bg-[#5060C5] hover:bg-[#404D9E]'
              : 'cursor-not-allowed bg-[#CDD0D5]'
          }`}
        >
          환불 신청 하기
        </button>
      </div>

      <RefundConfirmationModal
        open={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        onConfirm={handleConfirmClick}
      />

      <RefundCompleteModal
        open={isCompleteModalOpen}
        onOpenChange={setIsCompleteModalOpen}
      />
    </div>
  );
}
