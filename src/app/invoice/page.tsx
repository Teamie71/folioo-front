export default function InvoicePage() {
  return (
    <div className='mx-auto flex w-[66rem] min-w-[66rem] flex-col gap-[3.75rem] pt-[3.75rem]'>
      {/* 헤더 */}
      <div className='flex items-center gap-[1.25rem]'>
        <button>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='28'
            height='28'
            viewBox='0 0 28 28'
            fill='none'
          >
            <path
              d='M18 23L9 14L18 5.00001'
              stroke='black'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>

        <span className='text-[1.5rem] font-bold'>크레딧 거래 내역</span>
      </div>

      {/* 드롭다운 + 표 */}
      <div className='flex flex-col gap-[1.75rem]'>
        {/* 드롭다운 */}
        <div className='flex w-[5.75rem] flex-col items-center gap-[0.375rem]'>
          <button className='flex cursor-pointer items-center gap-[0.5rem] border-none bg-transparent pl-[0.25rem]'>
            <span className='text-[1rem] text-[#464B53]'>전체 기간</span>
            <div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
              >
                <path
                  d='M5 7.5L10 12.5L15 7.5'
                  stroke='#464B53'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
          </button>

          <div className='w-full rounded-[0.5rem] border border-[#74777D]' />
        </div>

        {/* 표 */}
        <div className='flex flex-col'>
          {/* 분류 */}
          <div className='flex w-full rounded-[0.25rem] bg-[#5060C5] py-[0.75rem] text-[1.125rem] font-semibold text-[#FFFFFF]'>
            <div className='px-[3rem]'>분류</div>
            <div className='px-[3.25rem]'>일시</div>
            <div className='px-[6rem]'>상품명</div>
            <div className='px-[1.25rem]'>크레딧</div>
            <div className='px-[3.375rem]'>결제금액</div>
            <div className='px-[1.875rem]'>잔여 크레딧</div>
            <div className='px-[2.375rem]'>환불 상태</div>
          </div>

          {/* 내역 */}
          {/* TODO: 표 간격 다시 설정 필요 */}
          <div className='flex flex-col text-[1.125rem]'>
            <div className='flex flex-col'>
              <div className='flex py-[1.25rem]'>
                <div className='px-[3rem] font-semibold'>충전</div>
                <div className='px-[1.5rem]'>2000.00.00</div>
                <div className='px-[3rem]'>700 크레딧 패키지</div>
                <div className='px-[1.5rem]'>+700</div>
                <div className='px-[3rem]'>₩ 9,100</div>
                <div className='px-[3.875rem]'>700</div>
                <div className='px-[1.575rem]'>
                  <button className='cursor-pointer rounded-[0.25rem] border-[0.09375rem] border-[#5060C5] bg-[#F6F5FF] px-[0.75rem] py-[0.25rem] text-[0.875rem] text-[#5060C5]'>
                    환불 신청
                  </button>
                </div>
              </div>
              <div className='w-full border border-[#CDD0D5]' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
