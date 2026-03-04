import Image from 'next/image';

export default function MobileBlockedPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-white px-[2rem] py-[2rem]">
      <div className="flex w-full max-w-[28rem] flex-col items-center text-center">
        <Image
          src="/BlurredLogo.svg"
          alt=""
          width={150}
          height={150}
          className="h-[9.375rem] w-[9.375rem]"
        />

        <h1 className="mt-[1.25rem] text-[1.6rem] font-bold leading-snug text-[#1A1A1A] sm:text-[1.8rem]">
          준비 중인 기능입니다.
        </h1>

        <p className="mt-[1.25rem] text-[1.125rem] leading-[1.5] text-[#1A1A1A] sm:text-[1rem]">
          모바일은 3/23일부터 이용 가능합니다.
          <br />
          PC와 태블릿에서 Folioo를 이용해보세요.
        </p>
      </div>
    </div>
  );
}
