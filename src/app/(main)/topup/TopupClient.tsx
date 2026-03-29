'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CommonButton } from '@/components/CommonButton';
import { openFeedbackForm } from '@/constants/feedback';
import { CreditExpireAlert } from '@/components/CreditExpireAlert';
import { PaymentModal } from '@/components/PaymentModal';
import Image from 'next/image';
import { ChallengeModal } from '@/components/ChallengeModal';
import { OBTRedirectModal } from '@/components/OBT/OBTRedirectModal';
import { BigTicketIcon } from '@/components/icons/BigTicketIcon';
import { BigCalendarIcon } from '@/components/icons/BigCalendarIcon';
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

// 이용권 타입 → API 타입 매핑
const VOUCHER_TYPE_TO_API: Record<VoucherType, TicketProductResDTOType> = {
  experience: 'EXPERIENCE',
  portfolio: 'PORTFOLIO_CORRECTION',
};

function TopupPageContent() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const { data: ticketBalance } = useUserControllerGetTicketBalance({
    query: { enabled: !!accessToken },
  });
  // 이용권 상품 목록 조회
  const { data: ticketProductsData } = useTicketControllerGetTicketProducts({
    query: { enabled: !!accessToken },
  });
  const { mutateAsync: createPayment } = usePaymentControllerCreatePayment();
  const { mutateAsync: cancelPayment } = usePaymentControllerCancelPayment();

  const experienceCount = ticketBalance?.result?.experience?.count ?? 0;
  const portfolioCount = ticketBalance?.result?.portfolioCorrection?.count ?? 0;

  // 이용권 상품 목록
  const ticketProducts = ticketProductsData?.result ?? [];

  const [selectedVoucher, setSelectedVoucher] =
    useState<SelectedVoucher | null>(null);
  const [obtPurchaseRedirectOpen, setObtPurchaseRedirectOpen] = useState(false);
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // 결제 복귀 시 URL의 paymentId로 결제 상태 조회
  const paymentIdParam = searchParams.get('paymentId');
  const paymentId = paymentIdParam ? Number(paymentIdParam) : NaN;
  const isValidPaymentId = Number.isInteger(paymentId) && paymentId > 0;
  const { data: paymentData } = usePaymentControllerGetPayment(paymentId, {
    query: { enabled: !!accessToken && isValidPaymentId },
  });
  const paymentStatus = paymentData?.result?.status;

  // 결제 완료 시: 잔여 이용권·다음 보상 안내 갱신 후 URL에서 paymentId 제거
  useEffect(() => {
    if (!isValidPaymentId || paymentStatus !== PaymentResDTOStatus.PAID) return;
    queryClient.invalidateQueries({
      queryKey: getUserControllerGetTicketBalanceQueryKey(),
    });
    // 다음 보상 안내 갱신
    queryClient.invalidateQueries({
      queryKey: getUserControllerGetNextTicketGrantNoticeQueryKey(),
    });
    const url = new URL(window.location.href);
    url.searchParams.delete('paymentId');
    window.history.replaceState(null, '', url.pathname + url.search);
  }, [isValidPaymentId, paymentStatus, queryClient]);

  // 결제창에서 취소한 경우(REQUESTED/WAITING): 취소 API 호출 후 URL에서 paymentId 제거
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

  // 이용권 상품 ID 조회
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

  // 피드백 모달에서 이동한 경우 브라우저 뒤로가기 차단
  useEffect(() => {
    if (searchParams.get('noBack') !== '1') return;
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [searchParams]);

  const benefitCards = [
    {
      id: 'review',
      icon: <BigTicketIcon />,
      title: 'Folioo 사용 후기를 남기면, 무료 이용권 2종 추가 지급!',
      description:
        '이번 주의 첫 피드백을 남겨주시면, 감사의 마음을 담아 무료 이용권을 드려요.',
      cta: '피드백 남기기',
    },
    /* OBT 기간 주석 처리
    {
      id: 'review',
      icon: <BigTicketIcon />,
      title: 'Folioo 사용 후기를 남기면, 원하는 이용권이 하나 더!',
      description:
        '첫 피드백을 남겨주시면, 감사의 마음을 담아 원하시는 무료 이용권을 드려요.',
      cta: '피드백 남기기',
    },
    {
      id: 'cta',
      icon: <BigCalendarIcon />,
      title: '제목제목제목',
      description: '설명설명설명',
      cta: 'CTA',
    }, */
  ];

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
    <>
      <div className='flex flex-col gap-[4.5rem] pb-[6.25rem]'>
        {/* 크레딧 충전 헤더 */}
        <div className='relative mx-auto flex h-[15.625rem] w-full min-w-[66rem] bg-[#F6F5FF]'>
          <div className='mx-auto flex min-w-[66rem] items-center justify-center'>
            <div className='flex w-full items-center justify-between'>
              {/* 크레딧 충전 타이틀 */}
              <div>
                <div className='mt-8 flex flex-col gap-[1.25rem]'>
                  <div className='flex items-center gap-[1rem]'>
                    <Image
                      src='/Ticket.svg'
                      alt=''
                      width={32}
                      height={32}
                      className='h-[2rem] w-[2rem]'
                    />
                    <span className='text-[1.5rem] font-bold'>이용권 구매</span>
                  </div>
                  <span className='text-[1.125rem] leading-[150%] text-[#464B53]'>
                    합격을 위한 가장 효율적인 선택, AI 컨설턴트와 함께하세요.
                  </span>
                </div>
                {/* 이용권 만료 예정 안내 */}
                <div className='mt-[1.75rem]'>
                  <CreditExpireAlert message='이용권 만료 예정 안내' />
                </div>
              </div>

              {/* 현재 보유 크레딧 (로그인 시에만 표시) */}
              {accessToken && (
                <div className='relative flex flex-col items-end gap-[0.5rem]'>
                  <span className='mb-[0.75rem] text-[1.25rem] font-bold text-[#1A1A1A]'>
                    나의 잔여 이용권
                  </span>
                  <div className='flex items-center gap-[1.25rem]'>
                    <span className='text-[1.125rem] font-normal text-[#1A1A1A]'>
                      경험 정리
                    </span>
                    <div>
                      <span className='text-[1.25rem] font-bold text-[#1A1A1A]'>
                        {experienceCount}
                      </span>
                      <span className='text-[1.25rem] font-normal text-[#1A1A1A]'>
                        {' '}
                        회
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-[1.25rem]'>
                    <span className='text-[1.125rem] font-normal text-[#1A1A1A]'>
                      포트폴리오 첨삭
                    </span>
                    <div>
                      <span className='text-[1.25rem] font-bold text-[#1A1A1A]'>
                        {portfolioCount}
                      </span>
                      <span className='text-[1.25rem] font-normal text-[#1A1A1A]'>
                        {' '}
                        회
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 혜택/안내 카드 섹션 */}
        <div className='mx-auto flex w-[66rem] flex-col gap-[1.75rem]'>
          {benefitCards.map((card) => (
            <div
              key={card.id}
              className='flex items-center justify-between gap-[1.5rem] rounded-[1.25rem] border border-[#E9EAEC] bg-white px-[2rem] py-[1.75rem] shadow-[0_4px_8px_rgba(0,0,0,0.08)]'
            >
              <div className='flex items-center gap-[1.75rem]'>
                <div className='flex h-[4rem] w-[4rem] shrink-0 items-center justify-center'>
                  {card.icon}
                </div>
                <div className='flex flex-col gap-[0.5rem]'>
                  <p className='text-[1.125rem] font-semibold'>{card.title}</p>
                  <p className='text-[1rem] text-[#74777D]'>
                    {card.description}
                  </p>
                </div>
              </div>

              <CommonButton
                variantType='Outline'
                px='2.25rem'
                py='0.5rem'
                className='text-[1rem] font-semibold'
                onClick={() => {
                  if (card.id === 'phone') {
                    router.push('/verify');
                    return;
                  }
                  if (card.id === 'review') {
                    openFeedbackForm();
                    return;
                  }
                  if (card.id === 'cta') {
                    setChallengeModalOpen(true);
                    return;
                  }
                  console.log(`${card.id} CTA 클릭`);
                }}
              >
                {card.cta}
              </CommonButton>
            </div>
          ))}
        </div>

        {/* 경험 정리 이용권 */}
        <section className='mx-auto mt-[1.75rem] flex w-[66rem] flex-col gap-[1.5rem]'>
          <div className='flex flex-col gap-[0.75rem] pb-[1.75rem]'>
            <h2 className='text-[1.25rem] font-bold text-[#1A1A1A]'>
              경험 정리 이용권
            </h2>
            <p className='text-[1rem] leading-[1.5] text-[#464B53]'>
              모든 서류에 사용 가능한 취업 준비의 필수 재료,
              <br />
              AI 컨설턴트와의 대화를 통해 체계적으로 완성하세요.
            </p>
          </div>
          <div className='grid grid-cols-3 gap-[1.25rem]'>
            {EXPERIENCE_VOUCHERS.map((option) => (
              <VoucherCard
                key={`exp-${option.times}`}
                option={option}
                onPurchase={() => handlePurchaseClick('experience', option)}
              />
            ))}
          </div>
        </section>

        {/* 포트폴리오 첨삭 이용권 */}
        <section className='mx-auto mt-[3rem] flex w-[66rem] flex-col gap-[1.5rem]'>
          <div className='flex flex-col gap-[0.75rem] pb-[1.75rem]'>
            <h2 className='text-[1.25rem] font-bold text-[#1A1A1A]'>
              포트폴리오 첨삭 이용권
            </h2>
            <p className='text-[1rem] leading-[1.5] text-[#464B53]'>
              공고 맞춤형 포트폴리오를 빠르게 제작할 수 있도록,
              <br />
              AI 컨설턴트에게 첨삭을 의뢰하세요.
            </p>
          </div>
          <div className='grid grid-cols-3 gap-[1.25rem]'>
            {PORTFOLIO_VOUCHERS.map((option) => (
              <VoucherCard
                key={`port-${option.times}`}
                option={option}
                onPurchase={() => handlePurchaseClick('portfolio', option)}
              />
            ))}
          </div>
        </section>
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
    </>
  );
}

export default function TopupClient() {
  return (
    <Suspense fallback={null}>
      <TopupPageContent />
    </Suspense>
  );
}

function VoucherCard({
  option,
  onPurchase,
}: {
  option: VoucherOption;
  onPurchase: () => void;
}) {
  return (
    <div className='relative flex flex-col justify-between rounded-[1rem] bg-white px-[2.25rem] py-[2rem] shadow-[1px_1px_4px_0px_#00000040_inset]'>
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
        className='mt-[2.5rem] w-full rounded-[3.75rem] bg-[#5060C5] text-[1rem] font-bold text-white hover:bg-[#4352B3]'
        onClick={onPurchase}
      >
        구매하기
      </CommonButton>
    </div>
  );
}
