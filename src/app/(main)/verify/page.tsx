'use client';

import { useState } from 'react';
import { CommonButton } from '@/components/CommonButton';
import InputArea from '@/components/InputArea';

export default function VerifyPage() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSendVerification = () => {
    // TODO: 인증 번호 발송 API 연동
    console.log('인증 번호 발송:', phoneNumber);
  };

  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center bg-white px-[1.5rem] py-[3rem]'>
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
            className='text-center'
          />
          <CommonButton
            variantType='Execute'
            px='1.75rem'
            py='0.5rem'
            className='rounded-[6.25rem]'
            onClick={handleSendVerification}
          >
            인증 번호 발송
          </CommonButton>
        </div>
      </div>
    </div>
  );
}
