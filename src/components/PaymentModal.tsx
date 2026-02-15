'use client';

import { useEffect, useState } from 'react';
import { CommonModal } from '@/components/CommonModal';
import { CommonButton } from '@/components/CommonButton';
import { Checkbox } from '@/components/ui/CheckBox';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  onConfirm?: () => void;
}

export function PaymentModal({
  open,
  onOpenChange,
  productName,
  onConfirm,
}: PaymentModalProps) {
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (!open) setAgreed(false);
  }, [open]);

  const handleConfirm = () => {
    if (!agreed) return;
    onConfirm?.();
    onOpenChange(false);
  };

  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      title={`${productName}을 결제할까요?`}
      description='이용권은 결제 후 6개월 동안 유효하게 사용 가능해요.'
      cancelBtnText='취소'
      primaryBtnText='결제'
      onCancelClick={() => onOpenChange(false)}
      onPrimaryClick={handleConfirm}
      footer={
        <>
          <CommonButton
            variantType='Cancel'
            px='2.5rem'
            py='0.5rem'
            onClick={() => onOpenChange(false)}
          >
            취소
          </CommonButton>
          <CommonButton
            variantType='Execute'
            px='2.5rem'
            py='0.5rem'
            className='disabled:cursor-not-allowed disabled:opacity-50'
            onClick={handleConfirm}
            disabled={!agreed}
          >
            결제
          </CommonButton>
        </>
      }
    >
      <div className='flex flex-col items-center gap-[0.5rem] text-left'>
        <label className='flex cursor-pointer items-center gap-[0.5rem]'>
          <Checkbox
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
          />
          <span className='text-[0.875rem] leading-[150%] text-[#74777D]'>
            (필수) 상품 정보 및 결제/환불 규정에 동의합니다.
          </span>
        </label>
        <ul className='ml-[2rem] list-disc text-[0.75rem] leading-[150%] text-[#74777D]'>
          <li>7일 이내, 미사용 시: 전액 환불</li>
          <li>사용 후 또는 7일 경과 시: 위약금(10%) 및 정상가 차감 후 환급</li>
        </ul>
      </div>
    </CommonModal>
  );
}
