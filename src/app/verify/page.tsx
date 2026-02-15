'use client';

import { useState, useEffect } from 'react';
import { CommonButton } from '@/components/CommonButton';
import InputArea from '@/components/InputArea';
import { EventModal } from '@/components/EventModal';
import { useRouter } from 'next/navigation';

const TIMER_INITIAL = 299; // 04:59
const OTP_LENGTH = 6;

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`;
}

export default function VerifyPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(TIMER_INITIAL);
  const [isError, setIsError] = useState(false);

  // 1단계: 휴대폰 번호 입력
  if (!codeSent) {
    return (
      <div className='flex min-h-screen flex-col items-center mt-[15rem] bg-white px-[1.5rem] py-[3rem]'>
        <div className='flex flex-col gap-[2.5rem]'>
          <div className='flex flex-col gap-[1.25rem] text-center'>
            <h1 className='text-[1.5rem] font-bold text-[#1A1A1A]'>
              휴대폰 번호 인증
            </h1>
            <p className='text-[1.125rem] text-[#464B53]'>
              3초만에 회원가입 완료하고, 무료 이용권 2종을 받으세요!
            </p>
          </div>

          <div className='flex flex-col items-center gap-[2.5rem]'>
            <InputArea
              type='tel'
              placeholder='휴대폰 번호를 입력해주세요.'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              variant='default'
              className='w-full max-w-[28rem] text-center'
            />
            <CommonButton
              variantType='Execute'
              px='1.75rem'
              py='0.5rem'
              className='rounded-[6.25rem]'
              onClick={() => {
                // TODO: 인증 번호 발송 API 연동
                setCodeSent(true);
                setTimer(TIMER_INITIAL);
                setOtp(Array(OTP_LENGTH).fill(''));
                setIsError(false);
              }}
            >
              인증 번호 발송
            </CommonButton>
          </div>
        </div>
      </div>
    );
  }

  // 2단계: 인증번호 입력 (제공해주신 UI 반영)
  return (
    <VerifyOtpStep
      otp={otp}
      setOtp={setOtp}
      timer={timer}
      setTimer={setTimer}
      isError={isError}
      setIsError={setIsError}
      formatTime={formatTime}
    />
  );
}

function VerifyOtpStep({
  otp,
  setOtp,
  timer,
  setTimer,
  isError,
  setIsError,
  formatTime,
}: {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  isError: boolean;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
  formatTime: (seconds: number) => string;
}) {
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const router = useRouter();
  // 타이머 로직
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, [setTimer]);

  const handleChange = (value: string, index: number) => {
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleResend = () => {
    // TODO: 재발송 API 연동
    setTimer(TIMER_INITIAL);
    setOtp(Array(OTP_LENGTH).fill(''));
    setIsError(false);
  };

  const handleVerify = () => {
    const fullCode = otp.join('');
    if (fullCode.length !== OTP_LENGTH) return;
    // TODO: 인증번호 일치 여부 API로 확인
    if (fullCode === '000000') {
      setIsError(false);
      setEventModalOpen(true);
    } else {
      setIsError(true);
    }
  };

  return (
    <>
    <div className='flex min-h-screen flex-col items-center mt-[15rem] bg-white font-sans'>
      <div className='flex flex-col items-center w-full max-w-[400px] gap-[1.25rem]'>
        <h2 className='text-[24px] font-bold text-[#1A1A1A]'>
          휴대폰 번호 인증
        </h2>

        <p className='text-center text-[1.125rem] font-normal text-[#1A1A1A]'>
          문자로 전송된 인증번호를 확인 후, 입력해주세요.
        </p>

        <div className='text-[1.125rem] font-bold text-[#DC0000]'>
          {formatTime(timer)}
        </div>
        <div className='flex flex-col gap-[0.75rem]'>
          <div className='flex gap-[1rem]'>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type='text'
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className='h-[3rem] w-[3rem] rounded-[6px] border border-[#74777D] text-center text-[20px] outline-none focus:border-[#5060C5]'
              />
            ))}
          </div>

          <div className='flex flex-row items-center justify-between gap-[7.5rem]'>
            {isError ? (
              <span className='text-[14px] font-normal text-[#DC0000]'>
                인증번호가 일치하지 않아요.
              </span>
            ) : (
              <span />
            )}
            <button
              type='button'
              className='text-[14px] font-normal text-[#1A1A1A] underline underline-offset-2 cursor-pointer'
              onClick={handleResend}
            >
              인증번호 재발송
            </button>
          </div>
        </div>

        <CommonButton
          variantType='Execute'
          px='1.75rem'
          py='0.5rem'
          className='mt-[1.25rem] rounded-[7.5rem] text-[1rem]'
          onClick={handleVerify}
        >
          인증하기
        </CommonButton>
      </div>
    </div>
    <EventModal
      open={eventModalOpen}
      onOpenChange={setEventModalOpen}
      eventTitle='환영합니다!'
      eventSubTitle='가입 선물을 드려요.'
      reward='경험 정리 1회권 + 포트폴리오 첨삭 1회권'
      buttonText='경험 정리하기'
      onButtonClick={() => {
        router.push('/experience');
      }}
    />
    </>
  );
}
