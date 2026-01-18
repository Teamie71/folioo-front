'use client';

import { CommonButton } from '@/components/CommonButton';

export default function TopupPage() {
  const currentCredits = 50; // TODO: 실제 사용자 크레딧 데이터로 교체
  const userName = '000'; // TODO: 실제 사용자 이름으로 교체

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

  const handlePurchase = (packageId: number) => {
    // TODO: 구매 로직 구현
    console.log(`구매: 패키지 ${packageId}`);
  };

  return (
    <div className='flex flex-col gap-[4.5rem]'>
      {/* 크레딧 충전 헤더 */}
      <div className='mx-auto flex h-[15.625rem] w-full min-w-[66rem] bg-[#F6F5FF]'>
        <div className='mx-auto flex min-w-[66rem] items-center justify-between px-[2rem]'>
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
          <div className='flex flex-col items-end gap-[0.5rem]'>
            <span className='text-[20px] font-bold text-[#1A1A1A]'>
              현재 보유 크레딧
            </span>
            <div className='flex items-center gap-[0.25rem]'>
              <span className='text-[28px] font-bold text-[#1A1A1A]'>
                {currentCredits}
              </span>
              <span className='text-[18px] font-normal text-[#1A1A1A]'>
                크레딧
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 크레딧 패키지 섹션 */}
      <div className='mx-auto flex w-[66rem] flex-col gap-[3rem]'>
        <div className='mx-auto flex w-full flex-col gap-[1.5rem] rounded-[1rem] border border-[#E9EAEC] bg-[#FDFDFD] px-[2rem] py-[2rem] shadow-[0_4px_8px_0_rgba(0,0,0,0.2)]'>
          {/* 패키지 섹션 타이틀 */}
          <div className='flex flex-col items-center gap-[0.75rem]'>
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
                      onClick={() => handlePurchase(pkg.id)}
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
  );
}
