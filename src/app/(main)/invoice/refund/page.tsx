import { BackButton } from '@/components/BackButton';
import { PaymentIcon } from '@/components/icons/PaymentIcon';

export default function InvoiceRefundPage() {
  return (
    <div className='mx-auto flex w-[66rem] min-w-[66rem] flex-col gap-[3.75rem] pt-[3.75rem]'>
      {/* 헤더 */}
      <div className='flex items-center gap-[1.25rem]'>
        <BackButton />

        <span className='text-[1.5rem] font-bold'>환불 신청</span>
      </div>

      {/* 결제 요약 */}
      <div className='flex w-full flex-col'>
        <div className='flex flex-col gap-[2.5rem] rounded-[1.75rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[3rem] py-[2.25rem]'>
          {/* 결제 요약 헤더 */}
          <div className='flex flex-col gap-[0.5rem]'>
            <div className='flex items-center gap-[0.75rem]'>
              <PaymentIcon />
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

      {/* 환급 계좌 정보 */}
      <div className='flex flex-col gap-[2.5rem] rounded-[1.75rem] border border-[#CDD0D5] bg-[#FDFDFD] px-[3rem] py-[2.25rem]'>
        {/* 환급 계좌 정보 헤더 */}
        <div className='flex flex-col gap-[0.5rem]'>
          <span className='text-[1.25rem] font-bold'>환급 계좌 정보</span>
          <span className='text-[1rem] text-[#74777D]'>
            가상계좌 결제 건은 결제 취소 시 즉시 환불이 되지 않아서, 입금 받으실
            본인 명의의 계좌 정보 입력이 필요해요.
          </span>
        </div>

        {/* 은행명, 예금주 */}
        <div className='flex w-full justify-between'>
          {/* 은행명 */}
          <div className='flex flex-col gap-[0.75rem]'>
            <span className='text-[1.125rem] font-semibold text-[#1A1A1A]'>
              은행명
            </span>
            <button className='w-[28.75rem] cursor-pointer rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem] text-start text-[#74777D]'>
              선택
            </button>
          </div>

          {/* 예금주 */}
          <div className='flex flex-col gap-[0.75rem]'>
            <span className='text-[1.125rem] font-semibold text-[#1A1A1A]'>
              예금주
            </span>
            <input
              className='w-[28.75rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem] text-start text-[#74777D]'
              placeholder='실명 입력'
            />
          </div>
        </div>

        {/* 계좌번호 */}
        <div className='flex flex-col gap-[0.75rem]'>
          <span className='text-[1.125rem] font-semibold text-[#1A1A1A]'>
            계좌번호
          </span>
          <input
            className='w-full rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem] text-start text-[#74777D]'
            placeholder='- 없이 숫자만 입력해주세요.'
          />
        </div>
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
