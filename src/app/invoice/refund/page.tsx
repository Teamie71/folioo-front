export default function InvoiceRefundPage() {
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

        <span className='text-[1.5rem] font-bold'>환불 신청</span>
      </div>

      {/* 결제 요약 */}
      <div className='flex w-full flex-col'>
        <div className='flex flex-col gap-[2.5rem] rounded-[1.75rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[3rem] py-[2.25rem]'>
          {/* 결제 요약 헤더 */}
          <div className='flex flex-col gap-[0.5rem]'>
            <div className='flex items-center gap-[0.75rem]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
              >
                <path
                  d='M0 6C0 5.20435 0.316071 4.44129 0.87868 3.87868C1.44129 3.31607 2.20435 3 3 3H21C21.7956 3 22.5587 3.31607 23.1213 3.87868C23.6839 4.44129 24 5.20435 24 6V7.5H0V6ZM0 10.5V18C0 18.7956 0.316071 19.5587 0.87868 20.1213C1.44129 20.6839 2.20435 21 3 21H21C21.7956 21 22.5587 20.6839 23.1213 20.1213C23.6839 19.5587 24 18.7956 24 18V10.5H0ZM4.5 13.5H6C6.39782 13.5 6.77936 13.658 7.06066 13.9393C7.34196 14.2206 7.5 14.6022 7.5 15V16.5C7.5 16.8978 7.34196 17.2794 7.06066 17.5607C6.77936 17.842 6.39782 18 6 18H4.5C4.10218 18 3.72064 17.842 3.43934 17.5607C3.15804 17.2794 3 16.8978 3 16.5V15C3 14.6022 3.15804 14.2206 3.43934 13.9393C3.72064 13.658 4.10218 13.5 4.5 13.5Z'
                  fill='black'
                />
              </svg>
              <span className='text-[1.25rem] font-bold'>결제 요약</span>
            </div>

            <span className='text-[1rem] text-[#74777D]'>
              결제 정보를 확인하고 환불을 진행해 주세요.
            </span>
          </div>

          {/* 결제 요약 내용 */}
          <div className='flex flex-col gap-[2.5rem]'>
            {/* 주문번호 / 승인번호(TID) */}
            <div className='flex flex-col gap-[0.75rem]'>
              <span className='text-[1.125rem] text-[#74777D]'>
                주문번호 / 승인번호(TID)
              </span>
              <div className='flex flex-col gap-[0.25rem]'>
                <span className='text-[1.125rem] font-semibold'>
                  OOO-00000000-0000
                </span>
                <span className='text-[1rem] text-[#74777D]'>
                  TID-000000000
                </span>
              </div>
            </div>

            {/* 결제 일시, 수단 */}
            <div className='flex gap-[13.75rem]'>
              {/* 결제 일시 */}
              <div className='flex flex-col gap-[0.75rem] text-[1.125rem]'>
                <span className='text-[#74777D]'>결제일시</span>
                <span className='font-semibold text-[#1A1A1A]'>
                  YY.MM.DD 00:00
                </span>
              </div>

              {/* 결제 수단 */}
              <div className='flex flex-col gap-[0.75rem] text-[1.125rem]'>
                <span className='text-[#74777D]'>결제수단</span>
                <span className='font-semibold text-[#1A1A1A]'>신용카드</span>
              </div>
            </div>

            {/* 금액 */}
            <div className='flex flex-col gap-[1rem]'>
              <div className='flex justify-between text-[1.5rem] font-bold'>
                <span>총 결제 금액</span>
                <span>00,000원</span>
              </div>
              <div className='flex justify-between text-[1.125rem]'>
                <span>사용 완료한 금액</span>
                <span>-00,000원</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 환불 예정 금액 */}
      <div className='flex justify-between rounded-[1.25rem] bg-[#F6F5FF] px-[3rem] py-[2.75rem] text-[2rem] font-bold'>
        <span>환불 예정 금액</span>
        <span className='text-[#5060C5]'>00,000원</span>
      </div>

      {/* 환불 신청 이유, 신청 */}
      <div className='flex w-full justify-between'>
        <div className='rounded-[0.75rem] border border-[#74777D] py-[1rem] pr-[1.125rem] pl-[1.25rem]'>
          <button className='flex w-full cursor-pointer gap-[19.5rem] border-none bg-transparent'>
            <span className='text-[1.125rem] text-[#74777D]'>
              환불 신청 이유 선택
            </span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M6 9L12 15L18 9'
                stroke='#74777D'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>

        <div className='cursor-pointer rounded-[0.75rem] bg-[#5060C5] px-[12.875rem] py-[1.125rem] text-[1.125rem] font-bold text-[#ffffff]'>
          환불 신청 하기
        </div>
      </div>
    </div>
  );
}
