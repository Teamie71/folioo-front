export default function TOSPage() {
  return (
    <div className='mx-auto flex w-[66rem] min-w-[66rem] flex-col gap-[3.75rem]'>
      {/* 로고 */}
      <div className='mt-[3.75rem] flex h-[3.125rem] w-[6.25rem] items-center justify-center bg-[#D9D9D9]'>
        로고
      </div>

      {/* 서비스 이용 약관 */}
      <div className='flex flex-col gap-[3.125rem]'>
        {/* 헤더 */}
        <div className='flex flex-col gap-[1.25rem]'>
          <div className='flex items-center gap-[1.25rem]'>
            <button className='cursor-pointer border-none bg-transparent'>
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

            <span className='text-[1.5rem] font-bold'>서비스 이용 약관</span>
          </div>

          <p className='w-full border border-[#CDD0D5]' />
        </div>

        {/* 내용 */}
        <div className='flex flex-col gap-[1.25rem] px-[0.5rem]'>
          <p className='ml-[1.25rem] text-[1.25rem] font-bold'>
            제 1장 내용내용내용
          </p>

          <div className='flex w-full flex-col gap-[3.75rem] rounded-[1.75rem] border border-[#CDD0D5] px-[2.5rem] py-[2.25rem]'>
            {/* 1조 */}
            <div className='flex flex-col gap-[1.25rem]'>
              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 1조 (내용내용)
              </div>
              <div className='line-height-[150%] flex flex-col gap-[1.25rem] px-[0.25rem] text-[1rem] text-[#464B53]'>
                <div className='flex flex-col gap-[0.75rem]'>
                  <p>1. 내용내용내용내용</p>
                  <div className='flex flex-col gap-[0.75rem] px-[2.5rem]'></div>
                </div>

                <div className='flex flex-col gap-[0.75rem]'>
                  <p>2. 내용내용내용내용</p>
                  <div className='flex flex-col gap-[0.75rem] px-[2.5rem]'>
                    <p>1. 내용내용내용내용</p>
                    <p>2. 내용내용내용내용</p>
                    <p>3. 내용내용내용내용</p>
                    <p>4. 내용내용내용내용</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2조 */}
            <div className='flex flex-col gap-[1.25rem]'>
              <div className='text-[1.125rem] font-bold text-[#1A1A1A]'>
                제 2조 (내용내용)
              </div>
              <div className='line-height-[150%] flex flex-col gap-[1.25rem] px-[0.25rem] text-[1rem] text-[#464B53]'>
                <div className='flex flex-col gap-[0.75rem]'>
                  <p>1. 내용내용내용내용</p>
                  <div className='flex flex-col gap-[0.75rem] px-[2.5rem]'></div>
                </div>

                <div className='flex flex-col gap-[0.75rem]'>
                  <p>2. 내용내용내용내용</p>
                  <div className='flex flex-col gap-[0.75rem] px-[2.5rem]'>
                    <p>1. 내용내용내용내용</p>
                    <p>2. 내용내용내용내용</p>
                    <p>3. 내용내용내용내용</p>
                    <p>4. 내용내용내용내용</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
