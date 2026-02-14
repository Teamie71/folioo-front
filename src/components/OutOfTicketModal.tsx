'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { TicketIcon } from './icons/TicketIcon';
import { CommonButton } from './CommonButton';
import { PaymentModal } from './PaymentModal';

export type OutOfTicketTicketType = 'experience' | 'correction';

const TICKET_OPTIONS: Record<
  OutOfTicketTicketType,
  { label: string; price: number; description: string }
> = {
  experience: {
    label: '경험 정리',
    price: 990,
    description: '1회권',
  },
  correction: {
    label: '포트폴리오 첨삭',
    price: 550,
    description: '1회권',
  },
};

interface OutOfTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 표시할 이용권 종류. 경험 정리(990원) / 포트폴리오 첨삭(550원) 중 선택 */
  ticketTypes: OutOfTicketTicketType[];
  onPurchase?: (type: OutOfTicketTicketType) => void;
  onViewPackages?: () => void;
}

export function OutOfTicketModal({
  open,
  onOpenChange,
  ticketTypes,
  onPurchase,
  onViewPackages,
}: OutOfTicketModalProps) {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentProductName, setPaymentProductName] = useState('');
  const [paymentTicketType, setPaymentTicketType] =
    useState<OutOfTicketTicketType | null>(null);

  const handlePurchaseClick = (type: OutOfTicketTicketType) => {
    const option = TICKET_OPTIONS[type];
    setPaymentProductName(`${option.label} ${option.description}`);
    setPaymentTicketType(type);
    setPaymentModalOpen(true);
  };

  const handlePaymentConfirm = () => {
    if (paymentTicketType) onPurchase?.(paymentTicketType);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[45.125rem] items-center gap-[1.75rem] px-[5rem] py-[3.75rem] text-center'>
        <DialogHeader className='flex flex-col items-center justify-center space-y-0'>
          <DialogTitle className='text-center text-[1.25rem] leading-[130%] font-bold text-[#1A1A1A]'>
            앗, 이용권이 부족해요.
            <br />
            구매 후 바로 이어서 진행해 보세요!
          </DialogTitle>
        </DialogHeader>

        <div className='flex w-full flex-col gap-[1rem]'>
          {ticketTypes.map((type) => {
            const option = TICKET_OPTIONS[type];
            return (
              <div
                key={type}
                className='rounded-[1.25rem] bg-gradient-to-b from-[#5060C5]/60 to-[#93B3F4]/80 p-[0.5rem]'
              >
                <div className='flex w-full items-center justify-between gap-[1rem] rounded-[1rem] bg-white px-[1.25rem] py-[1rem] shadow-[inset_1px_1px_4px_0_rgba(0,0,0,0.25)]'>
                  <div className='flex items-center gap-[1rem]'>
                    <TicketIcon />
                    <div className='flex flex-col items-start text-left'>
                      <span className='text-[1rem] leading-[150%] font-semibold text-[#1A1A1A]'>
                        {option.label}
                      </span>
                      <span className='text-[1.25rem] font-bold text-[#5060C5]'>
                        {option.description}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between gap-[4.25rem]'>
                    <span className='text-[1.75rem] font-bold text-[#1A1A1A]'>
                      {option.price.toLocaleString()} 원
                    </span>
                    <CommonButton
                      variantType='Execute'
                      px='2rem'
                      py='0.5rem'
                      onClick={() => handlePurchaseClick(type)}
                    >
                      구매하기
                    </CommonButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <CommonButton variantType='Outline' px='2rem' py='0.5rem'>
          할인된 패키지 보러가기 →
        </CommonButton>
      </DialogContent>

      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        productName={paymentProductName}
        onConfirm={handlePaymentConfirm}
      />
    </Dialog>
  );
}
