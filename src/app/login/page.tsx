export default function Login() {
  return (
    <div className='mx-auto flex min-h-screen w-full flex-col items-center justify-center gap-[5.5rem]'>
      <div className='flex flex-col items-center justify-center gap-[2rem]'>
        {/* 로고 */}
        <button className='flex h-[6.25rem] w-[12rem] cursor-pointer items-center justify-center bg-[#D9D9D9]'>
          로고
        </button>

        {/* 로그인 구분선 */}
        <div className='flex items-center'>
          <p className='w-[11.125rem] border border-[#9EA4A9]' />
          <div className='px-[1rem] py-[0.625rem] text-center text-[1rem] text-[#74777D]'>
            로그인
          </div>
          <p className='w-[11.125rem] border border-[#9EA4A9]' />
        </div>

        {/* 로그인 버튼 */}
        <div className='flex flex-col gap-[1.25rem]'>
          <button className='flex cursor-pointer items-center justify-center gap-[0.75rem] rounded-[0.5rem] bg-[#FFCD00] px-[5.625rem] py-[0.75rem] text-[1rem] font-bold text-[#1A1A1A]'>
            <div className='h-[1.75rem] w-[1.75rem] bg-[#D9D9D9]'>로고</div>
            <span>카카오톡으로 로그인</span>
          </button>

          <button className='flex cursor-pointer items-center justify-center gap-[0.75rem] rounded-[0.5rem] bg-[#E9EAEC] px-[5.625rem] py-[0.75rem] text-[1rem] font-bold text-[#1A1A1A]'>
            <div className='h-[1.75rem] w-[1.75rem] bg-[#D9D9D9]'>로고</div>
            <span>구글로 로그인</span>
          </button>

          <button className='flex cursor-pointer items-center justify-center gap-[0.75rem] rounded-[0.5rem] bg-[#03C75A] px-[5.625rem] py-[0.75rem] text-[1rem] font-bold text-[#1A1A1A]'>
            <div className='h-[1.75rem] w-[1.75rem] bg-[#D9D9D9]'>로고</div>
            <span className='text-[#FDFDFD]'>네이버로 로그인</span>
          </button>
        </div>
      </div>

      {/* 약관, 개인정보 처리방침, 마케팅 수신 */}
      <div className='flex items-center gap-[6.25rem]'>
        <button className='cursor-pointer text-[1rem] text-[#000000]'>
          서비스 이용 약관
        </button>
        <button className='cursor-pointer text-[1rem] text-[#000000]'>
          개인정보 처리방침
        </button>
        <button className='cursor-pointer text-[1rem] text-[#000000]'>
          마케팅 정보 수신
        </button>
      </div>
    </div>
  );
}
