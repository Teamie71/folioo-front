'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CommonButton } from '@/components/CommonButton';
import { openFeedbackForm } from '@/constants/feedback';
import { CreditExpireAlert } from '@/components/CreditExpireAlert';
import { ChallengeModal } from '@/components/ChallengeModal';
import { PaymentModal } from '@/components/PaymentModal';
import { OBTRedirectModal } from '@/components/OBT/OBTRedirectModal';
import { BigTicketIcon } from '@/components/icons/BigTicketIcon';
import { useUserControllerGetTicketBalance } from '@/api/endpoints/user/user';
import {
  usePaymentControllerCreatePayment,
  usePaymentControllerGetPayment,
  usePaymentControllerCancelPayment,
} from '@/api/endpoints/payment/payment';
import { useTicketControllerGetTicketProducts } from '@/api/endpoints/ticket/ticket';
import type { TicketProductResDTOType } from '@/api/models';
import { PaymentResDTOStatus } from '@/api/models/paymentResDTOStatus';
import { useAuthStore } from '@/store/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';
import {
  getUserControllerGetTicketBalanceQueryKey,
  getUserControllerGetNextTicketGrantNoticeQueryKey,
} from '@/api/endpoints/user/user';
import { cn } from '@/utils/utils';

type VoucherType = 'experience' | 'portfolio';

type VoucherOption = {
  times: number;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
};

const EXPERIENCE_VOUCHERS: VoucherOption[] = [
  { times: 1, price: 1000 },
  { times: 3, price: 2800, originalPrice: 3000, discountPercent: 7 },
  { times: 5, price: 4400, originalPrice: 5000, discountPercent: 12 },
];

const PORTFOLIO_VOUCHERS: VoucherOption[] = [
  { times: 1, price: 1000 },
  { times: 3, price: 2800, originalPrice: 3000, discountPercent: 7 },
  { times: 5, price: 4400, originalPrice: 5000, discountPercent: 12 },
];

type SelectedVoucher = { type: VoucherType; option: VoucherOption };

const VOUCHER_TYPE_TO_API: Record<VoucherType, TicketProductResDTOType> = {
  experience: 'EXPERIENCE',
  portfolio: 'PORTFOLIO_CORRECTION',
};

function TopupClientMobileContent() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const { data: ticketBalance } = useUserControllerGetTicketBalance({
    query: { enabled: !!accessToken },
  });
  const { data: ticketProductsData } = useTicketControllerGetTicketProducts({
    query: { enabled: !!accessToken },
  });
  const { mutateAsync: createPayment } = usePaymentControllerCreatePayment();
  const { mutateAsync: cancelPayment } = usePaymentControllerCancelPayment();

  const experienceCount = ticketBalance?.result?.experience?.count ?? 0;
  const portfolioCount = ticketBalance?.result?.portfolioCorrection?.count ?? 0;

  const ticketProducts = ticketProductsData?.result ?? [];

  const [selectedVoucher, setSelectedVoucher] =
    useState<SelectedVoucher | null>(null);
  const [obtPurchaseRedirectOpen, setObtPurchaseRedirectOpen] = useState(false);
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<VoucherType>('experience');

  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const paymentIdParam = searchParams.get('paymentId');
  const paymentId = paymentIdParam ? Number(paymentIdParam) : NaN;
  const isValidPaymentId = Number.isInteger(paymentId) && paymentId > 0;
  const { data: paymentData } = usePaymentControllerGetPayment(paymentId, {
    query: { enabled: !!accessToken && isValidPaymentId },
  });
  const paymentStatus = paymentData?.result?.status;

  useEffect(() => {
    if (!isValidPaymentId || paymentStatus !== PaymentResDTOStatus.PAID) return;
    queryClient.invalidateQueries({
      queryKey: getUserControllerGetTicketBalanceQueryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: getUserControllerGetNextTicketGrantNoticeQueryKey(),
    });
    const url = new URL(window.location.href);
    url.searchParams.delete('paymentId');
    window.history.replaceState(null, '', url.pathname + url.search);
  }, [isValidPaymentId, paymentStatus, queryClient]);

  const cancelRequestedRef = useRef(false);
  useEffect(() => {
    if (!isValidPaymentId || !paymentStatus) return;
    if (
      paymentStatus === PaymentResDTOStatus.PAID ||
      paymentStatus === PaymentResDTOStatus.CANCELLED ||
      paymentStatus === PaymentResDTOStatus.REFUNDED ||
      paymentStatus === PaymentResDTOStatus.PARTIAL_REFUNDED
    )
      return;
    if (cancelRequestedRef.current) return;
    cancelRequestedRef.current = true;

    let cancelled = false;
    cancelPayment({ paymentId })
      .then(() => {
        if (cancelled) return;
        const url = new URL(window.location.href);
        url.searchParams.delete('paymentId');
        window.history.replaceState(null, '', url.pathname + url.search);
      })
      .catch(() => {
        if (cancelled) return;
        const url = new URL(window.location.href);
        url.searchParams.delete('paymentId');
        window.history.replaceState(null, '', url.pathname + url.search);
      })
      .finally(() => {
        cancelRequestedRef.current = false;
      });
    return () => {
      cancelled = true;
    };
  }, [isValidPaymentId, paymentId, paymentStatus, cancelPayment]);

  const getTicketProductId = (
    type: VoucherType,
    times: number,
  ): number | null => {
    const apiType = VOUCHER_TYPE_TO_API[type];
    const product = ticketProducts.find(
      (p) => p.type === apiType && p.quantity === times,
    );
    return product?.id ?? null;
  };

  useEffect(() => {
    if (searchParams.get('noBack') !== '1') return;
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [searchParams]);

  const handlePurchaseClick = (type: VoucherType, option: VoucherOption) => {
    setSelectedVoucher({ type, option });
  };

  const handleConfirmPurchase = async () => {
    if (!selectedVoucher) return;
    const ticketProductId = getTicketProductId(
      selectedVoucher.type,
      selectedVoucher.option.times,
    );
    if (ticketProductId == null) {
      alert('해당 이용권 상품을 찾을 수 없어요. 잠시 후 다시 시도해주세요.');
      return;
    }
    const newWindow = window.open('about:blank', '_blank');

    const pollTimer = setInterval(() => {
      try {
        if (newWindow?.closed) {
          clearInterval(pollTimer);
          window.location.reload();
        }
      } catch (e) {
        console.error(e);
      }
    }, 1000);

    try {
      const res = await createPayment({ data: { ticketProductId } });
      const payUrl = res?.result?.payUrl;
      if (payUrl && newWindow) {
        newWindow.location.href = payUrl;
        return;
      }
      newWindow?.close();
      clearInterval(pollTimer);
      alert('결제창 URL을 받지 못했어요. 잠시 후 다시 시도해주세요.');
      setSelectedVoucher(null);
    } catch {
      newWindow?.close();
      clearInterval(pollTimer);
      alert('결제 요청에 실패했어요. 잠시 후 다시 시도해주세요.');
      setSelectedVoucher(null);
    }
  };

  return (
    <div className='flex w-full flex-col overflow-x-hidden bg-[#FFFFFF] pb-[5rem]'>
      <div className='flex flex-col bg-white'>
        {/* 잔여 이용권 섹션 */}
        <div className='flex flex-col bg-[#F6F5FF] px-[1rem] py-[1.25rem]'>
          <div className='flex flex-col gap-[1rem]'>
            <span className='text-[1rem] font-semibold text-[#1A1A1A]'>
              나의 잔여 이용권
            </span>
            <div className='flex flex-col items-end gap-[0.5rem]'>
              <div className='flex items-center gap-[1.25rem]'>
                <span className='text-[1rem] text-[#464B53]'>경험 정리</span>
                <div className='flex items-center justify-end gap-[0.25rem]'>
                  <span className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                    {experienceCount}
                  </span>
                  <span className='text-[1.125rem] text-[#1A1A1A]'>회</span>
                </div>
              </div>
              <div className='flex items-center gap-[1.25rem]'>
                <span className='text-[1rem] text-[#464B53]'>
                  포트폴리오 첨삭
                </span>
                <div className='flex items-center justify-end gap-[0.25rem]'>
                  <span className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                    {portfolioCount}
                  </span>
                  <span className='text-[1.125rem] text-[#1A1A1A]'>회</span>
                </div>
              </div>
            </div>
          </div>

          <CreditExpireAlert
            message='이용권 만료 예정 안내'
            hideWhenEmpty
            wrapperClassName='mt-[1rem] w-full'
            className='!w-full !justify-center'
          />
        </div>

        {/* 탭 */}
        <div className='flex w-full border-b border-[#E9EAEC]'>
          <button
            className={cn(
              'flex-1 py-[1rem] text-center text-[1rem] transition-colors',
              activeTab === 'experience'
                ? 'border-b-[0.125rem] border-[#5060C5] font-bold text-[#5060C5]'
                : 'text-[#9EA4A9]',
            )}
            onClick={() => setActiveTab('experience')}
          >
            경험 정리
          </button>
          <button
            className={cn(
              'flex-1 py-[1rem] text-center text-[1rem] transition-colors',
              activeTab === 'portfolio'
                ? 'border-b-[0.125rem] border-[#5060C5] font-bold text-[#5060C5]'
                : 'text-[#9EA4A9]',
            )}
            onClick={() => setActiveTab('portfolio')}
          >
            포트폴리오 첨삭
          </button>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className='flex flex-col px-[1rem] py-[2rem] pb-[6.25rem]'>
        {activeTab === 'experience' && (
          <div className='flex flex-col gap-[2rem]'>
            {/* 이벤트 카드 */}
            <div className='flex flex-col items-center gap-[1rem] rounded-[1rem] border border-[#E9EAEC] bg-white p-[1.5rem] shadow-[0px_4px_8px_0px_#0000001A]'>
              <div className='flex w-full items-center justify-center gap-[0.75rem]'>
                <div className='flex h-[3rem] w-[3rem] shrink-0 items-center justify-center'>
                  <BigTicketIcon />
                </div>
                <p className='text-[1rem] leading-[1.4] font-semibold text-[#1A1A1A]'>
                  Folioo 사용 후기를 남기면,
                  <br />
                  무료 이용권 2종 추가 지급!
                </p>
              </div>
              <p className='w-full text-center text-[0.75rem] leading-[1.4] text-[#74777D]'>
                이번 주의 첫 피드백을 남겨주시면,
                <br />
                감사의 마음을 담아 무료 이용권을 드려요.
              </p>
              <CommonButton
                variantType='Outline'
                className='mt-[0.5rem] rounded-[3.75rem] px-[2.25rem] py-[0.5rem] text-[1rem] font-bold'
                onClick={() => openFeedbackForm()}
              >
                피드백 남기기
              </CommonButton>
            </div>

            {/* 상품 목록 */}
            <div className='flex flex-col gap-[1.25rem]'>
              <div className='flex flex-col gap-[0.5rem]'>
                <h2 className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                  경험 정리 이용권
                </h2>
                <p className='text-[0.875rem] leading-[1.4] text-[#464B53]'>
                  모든 서류에 사용 가능한 취업 준비의 필수 재료,
                  <br />
                  AI 컨설턴트와의 대화를 통해 체계적으로 완성하세요.
                </p>
              </div>
              <div className='flex flex-col gap-[1.25rem]'>
                {EXPERIENCE_VOUCHERS.map((option) => (
                  <MobileVoucherCard
                    key={`exp-${option.times}`}
                    option={option}
                    onPurchase={() => handlePurchaseClick('experience', option)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className='flex flex-col gap-[2rem]'>
            {/* 상품 목록 */}
            <div className='flex flex-col gap-[1rem]'>
              <div className='flex flex-col gap-[0.5rem]'>
                <h2 className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                  포트폴리오 첨삭 이용권
                </h2>
                <p className='text-[0.875rem] leading-[1.4] text-[#464B53]'>
                  공고 맞춤형 포트폴리오를 빠르게 제작할 수 있도록,
                  <br />
                  AI 컨설턴트에게 첨삭을 의뢰하세요.
                </p>
              </div>
              <div className='flex flex-col gap-[1rem]'>
                {PORTFOLIO_VOUCHERS.map((option) => (
                  <MobileVoucherCard
                    key={`port-${option.times}`}
                    option={option}
                    onPurchase={() => handlePurchaseClick('portfolio', option)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <PaymentModal
        open={!!selectedVoucher}
        onOpenChange={(open) => !open && setSelectedVoucher(null)}
        productName={
          selectedVoucher
            ? `${selectedVoucher.type === 'experience' ? '경험 정리' : '포트폴리오 첨삭'} ${selectedVoucher.option.times}회권`
            : ''
        }
        onConfirm={handleConfirmPurchase}
      />

      <OBTRedirectModal
        open={obtPurchaseRedirectOpen}
        onOpenChange={setObtPurchaseRedirectOpen}
      />

      <ChallengeModal
        open={challengeModalOpen}
        onOpenChange={setChallengeModalOpen}
        currentCount={10}
        hasWrittenToday={true}
        onLogClick={() => {
          router.push('/log');
        }}
      />
    </div>
  );
}

export default function TopupClientMobile() {
  return (
    <Suspense fallback={null}>
      <TopupClientMobileContent />
    </Suspense>
  );
}

function MobileVoucherCard({
  option,
  onPurchase,
}: {
  option: VoucherOption;
  onPurchase: () => void;
}) {
  return (
    <div className='relative flex flex-col justify-between rounded-[1rem] border border-[#E9EAEC] bg-white px-[2rem] py-[2rem] shadow-[1px_1px_4px_0px_#00000040_inset]'>
      {/* 할인 뱃지: 배경은 연한 핑크, 글자는 빨간색 */}
      {option.discountPercent != null && (
        <div className='absolute top-[2rem] right-[2rem] rounded-[0.5rem] bg-[#FFF2F2] px-[0.75rem] py-[0.4rem] text-[0.8125rem] font-bold text-[#DC0000]'>
          약 {option.discountPercent}% 할인
        </div>
      )}

      <div className='flex flex-col gap-[1rem]'>
        {/* 회차 타이틀 */}
        <span className='text-[1.25rem] font-bold text-[#5060C5]'>
          {option.times}회권
        </span>

        {/* 가격 섹션 - originalPrice 없을 때도 자리 유지 */}
        <div className='flex flex-col'>
          {option.originalPrice != null ? (
            <span className='text-[1rem] text-[#464B53] line-through'>
              {option.originalPrice.toLocaleString()} 원
            </span>
          ) : (
            <span className='text-[1rem] text-transparent' aria-hidden>
              &nbsp;
            </span>
          )}
          <div className='flex items-baseline justify-between'>
            <span className='text-[1.75rem] font-bold text-[#1A1A1A]'>
              {option.price.toLocaleString()} 원
            </span>
            <span className='text-[0.875rem] text-[#464B53]'>(VAT 포함)</span>
          </div>
        </div>
      </div>

      {/* 구매 버튼 */}
      <CommonButton
        variantType='Execute'
        className='mt-[2.5rem] w-full rounded-[3.75rem] bg-[#5060C5] py-[0.75rem] text-[1rem] font-bold text-white hover:bg-[#4352B3]'
        onClick={onPurchase}
      >
        구매하기
      </CommonButton>
    </div>
  );
}
