'use client';

import { useState } from 'react';
import { CommonButton } from '@/components/CommonButton';
import { CreditExpireAlert } from '@/components/CreditExpireAlert';
import { CommonModal } from '@/components/CommonModal';

export default function TopupPage() {
  const currentCredits = 50; // TODO: 실제 사용자 크레딧 데이터로 교체
  const userName = '000'; // TODO: 실제 사용자 이름으로 교체
  const [selectedPackage, setSelectedPackage] = useState<{
    credits: number;
    price: number;
  } | null>(null);

  const benefitCards = [
    {
      id: 'phone',
      title: '휴대폰 번호 인증하고, 무료 크레딧을 획득하세요!',
      description: '무료 크레딧을 받고, Folioo와 커리어 기록을 시작하세요.',
      cta: '100 크레딧 받기',
    },
    {
      id: 'cta',
      title: '제목제목제목',
      description: '설명설명설명',
      cta: 'CTACTACTAC',
    },
  ];

  const packages = [
    {
      id: 1,
      credits: 100,
      price: 1900,
      discount: null,
      recommended: false,
    },
    {
      id: 2,
      credits: 200,
      price: 3500,
      discount: 8,
      recommended: true,
    },
    {
      id: 3,
      credits: 300,
      price: 6200,
      discount: 16,
      recommended: false,
    },
    {
      id: 4,
      credits: 400,
      price: 9100,
      discount: 32,
      recommended: false,
    },
  ];

  const handlePurchaseClick = (pkg: { credits: number; price: number }) => {
    setSelectedPackage(pkg);
  };

  const handleConfirmPurchase = () => {
    if (!selectedPackage) return;
    // TODO: 구매 로직 구현
    console.log(
      `구매 진행: ${selectedPackage.credits} 크레딧, ${selectedPackage.price}원`,
    );
    setSelectedPackage(null);
  };

  return (
    <>
      <div className='flex flex-col gap-[4.5rem] pb-[6.25rem]'>
      {/* 크레딧 충전 헤더 */}
      <div className='relative mx-auto flex h-[15.625rem] w-full min-w-[66rem] bg-[#F6F5FF]'>
        <div className='mx-auto flex min-w-[66rem] items-center justify-center'>
          <div className='flex items-center justify-between w-full'>
            {/* 크레딧 충전 타이틀 */}
            <div>
              <div className='flex flex-col gap-[1.25rem]'>
                <div className='flex items-center gap-[1.125rem]'>
                  <div className='h-[1.75rem] w-[1.75rem] bg-[#E0E0E0]'></div>
                  <span className='text-[1.5rem] font-bold'>크레딧 충전</span>
                </div>
                <span className='text-[1.125rem] leading-[150%] text-[#464B53]'>
                  크레딧을 충전하고, 다양한 AI 기능을 이용하세요.
                </span>
              </div>
            </div>

            {/* 현재 보유 크레딧 */}
            <div className='relative flex flex-col items-end gap-[0.5rem]'>
              <span className='text-[20px] font-bold text-[#1A1A1A]'>
                현재 보유 크레딧
              </span>
              <div className='flex items-center gap-[0.75rem]'>
                <span className='text-[28px] font-bold text-[#1A1A1A]'>
                  {currentCredits}
                </span>
                <span className='text-[18px] font-normal text-[#1A1A1A]'>
                  크레딧
                </span>
              </div>

              {/* 크레딧 만료 예정 안내 - absolute 배치 */}
              <div className='absolute top-16 mt-[1.75rem] right-0'>
                <CreditExpireAlert message='크레딧 만료 예정 안내' />
              </div>
            </div>
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
              <div className='h-[4rem] w-[4rem] bg-[#E0E0E0]' />
              <div className='flex flex-col gap-[0.5rem]'>
                <p className='text-[1.125rem] font-semibold'>
                  {card.title}
                </p>
                <p className='text-[1rem] text-[#74777D]'>{card.description}</p>
              </div>
            </div>

            <CommonButton
              variantType='Outline'
              px='2.25rem'
              py='0.5rem'
              className='text-[1rem] font-semibold'
              onClick={() => {
                // TODO: 각 CTA에 맞는 동작 연결
                console.log(`${card.id} CTA 클릭`);
              }}
            >
              {card.cta}
            </CommonButton>
          </div>
        ))}
      </div>

      {/* 크레딧 패키지 섹션 */}
      <div className='mx-auto flex w-[66rem] flex-col gap-[3rem]'>
        <div className='mx-auto flex w-full flex-col gap-[1.5rem] rounded-[1rem] border border-[#E9EAEC] bg-[#FDFDFD] px-[2rem] py-[2rem] shadow-[0_4px_8px_0_rgba(0,0,0,0.2)]'>
          {/* 패키지 섹션 타이틀 */}
          <div className='flex flex-col items-center gap-[0.5rem]'>
            <h2 className='text-[2rem] font-bold text-[#1A1A1A]'>크레딧 패키지</h2>
            <p className='text-[1.125rem] text-[#74777D]'>
              {userName}님께 가장 적합한 패키지를 선택해보세요!
            </p>
          </div>

          {/* 구분선 */}
          <div className='h-[1.5px] w-full bg-[#5060C5]'></div>

          {/* 패키지 카드들 */}
          <div className='mt-[3.25rem] grid grid-cols-4 gap-[1.25rem]'>
            {packages.map((pkg) => {
              const CardContent = (
                <>
                  {/* 회색 박스 */}
                  <div className='h-[7.5rem] w-[7.5rem] bg-[#E0E0E0]'></div>

                  {/* 크레딧 숫자 */}
                  <span className='mt-[1.25rem] text-[28px] font-bold text-[#1A1A1A]'>
                    {pkg.credits}
                  </span>

                  {/* 크레딧 텍스트 */}
                  <span className='text-[14px] font-normal text-[#1A1A1A]'>
                    크레딧
                  </span>

                  {/* 할인 정보 */}
                  {pkg.discount && (
                    <span className='mt-[1.25rem] rounded-[0.5rem] bg-[#FFF2F2] px-[0.625rem] py-[0.375rem] text-[14px] font-normal text-[#DC0000]'>
                      약 {pkg.discount}% 할인
                    </span>
                  )}

                  {/* 가격 */}
                  <span
                    className={`${pkg.discount ? 'mt-[0.625rem]' : 'mt-[4rem]'} text-[32px] font-bold text-[#5060C5]`}
                  >
                    {pkg.price.toLocaleString()}원
                  </span>

                  {/* 구매하기 버튼 */}
                  <div className='mt-[2.5rem]'>
                    <CommonButton
                      variantType={pkg.recommended ? 'Primary' : 'Outline'}
                      px='2.25rem'
                      py='0.5rem'
                      onClick={() => handlePurchaseClick(pkg)}
                    >
                      구매하기
                    </CommonButton>
                  </div>
                </>
              );

              if (pkg.recommended) {
                return (
                  <div key={pkg.id} className='relative'>
                    {/* 뒤 카드 */}
                    <div className='absolute top-[-2.3rem] left-1/2 -translate-x-1/2 z-0 w-[239px] h-[500px] rounded-[1.5rem] bg-gradient-to-b from-[#93B3F4] to-[#5060C5]'>
                      <span className='absolute top-[0.5rem] left-1/2 -translate-x-1/2 text-[1rem] font-bold text-white'>추천!</span>
                    </div>

                    {/* 앞 카드 */}
                    <div className='relative z-10 flex flex-col items-center rounded-[1.5rem] border border-[#74777D] bg-white px-[1.5rem] py-[2rem]'>
                      {CardContent}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={pkg.id}
                  className='relative flex flex-col items-center rounded-[1rem] border border-[#74777D] bg-white px-[1.5rem] py-[2rem]'
                >
                  {CardContent}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>

      {/* 구매 확인 모달 (CommonModal 기본 버튼 사용) */}
      <CommonModal
        open={!!selectedPackage}
        onOpenChange={(open) => {
          if (!open) setSelectedPackage(null);
        }}
        title={
          selectedPackage
            ? `${selectedPackage.credits.toLocaleString()} 크레딧을 결제할까요?`
            : ''
        }
        description='크레딧은 결제 후 6개월 동안 유효하게 사용 가능해요.'
        cancelBtnText='취소'
        primaryBtnText='결제'
        onCancelClick={() => setSelectedPackage(null)}
        onPrimaryClick={handleConfirmPurchase}
        primaryBtnVariant='default'
        className='w-[28.1875rem] max-w-[28.1875rem] items-center gap-[1.5rem] px-[2rem] py-[3.75rem]'
      />
    </>
  );
}
