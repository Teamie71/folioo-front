'use client';

import { useAuthStore } from '@/store/useAuthStore';
import {
  useUserControllerGetProfile,
  useUserControllerUpdateMarketingConsent,
  useUserControllerUpdateProfile,
  getUserControllerGetProfileQueryKey,
} from '@/api/endpoints/user/user';
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon';
import { ModifyIcon } from '@/components/icons/ModifyIcon';
import { ProfileEditButton } from '@/components/ProfileEditButton';
import { ToggleOnOff } from '@/components/ToggleOnOff';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfileClientMobile() {
  const queryClient = useQueryClient();
  const { data: profileRes, refetch } = useUserControllerGetProfile();
  const profile = profileRes?.result;

  const { mutate: updateProfile } = useUserControllerUpdateProfile({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getUserControllerGetProfileQueryKey(),
        });
        refetch();
      },
    },
  });

  const { mutate: updateMarketingConsent } =
    useUserControllerUpdateMarketingConsent({
      mutation: {
        onSuccess: () => refetch(),
      },
    });

  const handleNameSave = (newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    updateProfile({ data: { name: trimmed } });
  };

  const handleMarketingConsentChange = (next: boolean) => {
    updateMarketingConsent({ data: { isMarketingAgreed: next } });
  };

  const socialType = profile?.socialAccounts?.[0]?.socialType;
  const socialEmail = profile?.socialAccounts?.[0]
    ?.socialEmail as unknown as string;

  const settings = [
    { label: '크레딧 거래 내역', href: '/invoice' },
    { label: '서비스 이용약관', href: '/tos' },
    { label: '개인정보 처리방침', href: '/privacy' },
    { label: '마케팅 정보 수신', href: '/marketing' },
  ];

  return (
    <div className='mt-[2.75rem] min-h-screen min-w-[20.5rem] bg-white px-[1rem]'>
      {/* Profile Card */}
      <div className='mb-6 rounded-[1.25rem] bg-white px-[1rem]'>
        <div className='mb-3 flex items-center justify-between'>
          <ProfileEditButton
            value={profile?.name ?? ''}
            onSave={handleNameSave}
            className='!gap-2'
            textClassName='typo-h5'
          />
        </div>
        <div className='flex items-center gap-2'>
          <div className='flex h-5 w-5 items-center justify-center overflow-hidden rounded-full'>
            {socialType === 'GOOGLE' && (
              <Image
                src='/GoogleEmailLogo.svg'
                alt='Google'
                width={20}
                height={20}
              />
            )}
            {socialType === 'KAKAO' && (
              <Image
                src='/KakaoEmailLogo.svg'
                alt='Kakao'
                width={20}
                height={20}
              />
            )}
            {socialType === 'NAVER' && (
              <Image
                src='/NaverEmailLogo.svg'
                alt='Naver'
                width={20}
                height={20}
              />
            )}
            {!socialType && <div className='bg-gray4 h-full w-full' />}
          </div>
          <span className='typo-c1 text-gray6'>{socialEmail || ''}</span>
        </div>
      </div>

      {/* Settings Card */}
      <div className='flex flex-col rounded-[1.25rem] bg-white'>
        {/* Credit History */}
        <Link
          href='/invoice'
          className='flex items-center justify-between px-[1rem] py-[1rem]'
        >
          <span className='typo-b2 text-gray9'>크레딧 거래 내역</span>
          <div className='scale-x-[-1]'>
            <ChevronLeftIcon className='text-gray9 h-5 w-5' />
          </div>
        </Link>
        <div className='border-gray4 mx-4 border-t' />

        {/* Regular Settings */}
        <div className='flex flex-col'>
          <Link
            href='/tos'
            className='flex items-center justify-between px-[1rem] py-[1rem]'
          >
            <span className='typo-b2 text-gray9'>서비스 이용약관</span>
            <div className='scale-x-[-1]'>
              <ChevronLeftIcon className='text-gray9 h-5 w-5' />
            </div>
          </Link>
          <Link
            href='/privacy'
            className='flex items-center justify-between px-[1rem] py-[1rem]'
          >
            <span className='typo-b2 text-gray9'>개인정보 처리방침</span>
            <div className='scale-x-[-1]'>
              <ChevronLeftIcon className='text-gray9 h-5 w-5' />
            </div>
          </Link>
          <Link
            href='/marketing'
            className='flex items-center justify-between px-[1rem] py-[1rem]'
          >
            <span className='typo-b2 text-gray9'>마케팅 정보 수신</span>
            <div className='scale-x-[-1]'>
              <ChevronLeftIcon className='text-gray9 h-5 w-5' />
            </div>
          </Link>
        </div>

        {/* Marketing Consent Toggle */}
        <div className='flex items-center justify-between px-[1rem] py-[1rem]'>
          <span className='typo-b2 text-gray9'>마케팅 정보 수신 동의</span>
          <ToggleOnOff
            checked={profile?.isMarketingAgreed ?? false}
            onCheckedChange={handleMarketingConsentChange}
          />
        </div>

        <div className='border-gray4 mx-4 border-t' />

        {/* Withdrawal */}
        <Link
          href='/withdraw'
          className='flex items-center justify-between px-[1rem] py-[1rem]'
        >
          <span className='typo-b2 text-error'>회원 탈퇴</span>
          <div className='scale-x-[-1]'>
            <ChevronLeftIcon className='text-gray9 h-5 w-5' />
          </div>
        </Link>
      </div>
    </div>
  );
}
