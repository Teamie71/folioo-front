'use client';

import { useAuthStore } from '@/store/useAuthStore';
import {
  useUserControllerGetProfile,
  useUserControllerUpdateMarketingConsent,
  useUserControllerUpdateProfile,
  getUserControllerGetProfileQueryKey,
} from '@/api/endpoints/user/user';
import { MobileProfileButtonIcon } from '@/components/icons/mobile/MobileProfileButtonIcon';
import { ProfileEditButton } from '@/components/ProfileEditButton';
import { ToggleOnOff } from '@/components/ToggleOnOff';
import { useQueryClient } from '@tanstack/react-query';
import { ProfileSocialAccounts } from '@/components/ProfileSocialAccounts';
import Link from 'next/link';

export default function ProfileClientMobile() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const sessionRestoreAttempted = useAuthStore(
    (s) => s.sessionRestoreAttempted,
  );
  const isLoggedIn = sessionRestoreAttempted && accessToken != null;
  const { data: profileRes } = useUserControllerGetProfile({
    query: { enabled: isLoggedIn },
  });
  const profile = isLoggedIn ? profileRes?.result : undefined;

  const { mutate: updateProfile } = useUserControllerUpdateProfile({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getUserControllerGetProfileQueryKey(),
        });
      },
    },
  });

  const { mutate: updateMarketingConsent } =
    useUserControllerUpdateMarketingConsent({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getUserControllerGetProfileQueryKey(),
          });
        },
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

  return (
    <div className='min-h-[calc(100dvh-56px)] min-w-0 bg-white px-4 pt-6 pb-10'>
      {/* Profile Card */}
      <div className='bg-gray1 mb-5 rounded-xl px-4 py-5 has-[input]:mt-[3px] has-[input]:pt-[9px] has-[input]:pb-[23px]'>
        <div className='mb-2 flex items-center justify-between'>
          <ProfileEditButton
            value={profile?.name ?? ''}
            onSave={handleNameSave}
            variant='mobile'
            textClassName='typo-h5 break-all'
          />
        </div>
        <ProfileSocialAccounts
          socialAccounts={profile?.socialAccounts ?? []}
          textClassName='typo-c1'
          rowClassName='gap-2'
        />
      </div>

      {/* Settings Card */}
      <div className='bg-gray1 flex flex-col rounded-xl'>
        {/* Regular Settings */}
        <div className='flex flex-col'>
          <Link
            href='/tos'
            className='flex h-16 items-center justify-between px-4'
          >
            <span className='typo-b2 text-gray9'>서비스 이용약관</span>
            <MobileProfileButtonIcon />
          </Link>
          <Link
            href='/privacy'
            className='flex h-16 items-center justify-between px-4'
          >
            <span className='typo-b2 text-gray9'>개인정보 처리방침</span>
            <MobileProfileButtonIcon />
          </Link>
          <Link
            href='/marketing'
            className='flex h-16 items-center justify-between px-4'
          >
            <span className='typo-b2 text-gray9'>마케팅 정보 수신</span>
            <MobileProfileButtonIcon />
          </Link>
        </div>

        {/* Marketing Consent Toggle */}
        <div className='flex h-[68px] items-center justify-between px-4'>
          <span className='typo-b2 text-gray9'>마케팅 정보 수신 동의</span>
          <ToggleOnOff
            variant='mobile'
            aria-label='마케팅 정보 수신 동의'
            checked={profile?.isMarketingAgreed ?? false}
            onCheckedChange={handleMarketingConsentChange}
          />
        </div>

        <div className='mx-4 h-px bg-[url(/mobile/profile-divider.svg)] bg-repeat-x' />

        {/* Withdrawal */}
        <Link
          href='/withdraw'
          className='flex h-[63px] items-center justify-between px-4'
        >
          <span className='typo-b2 text-error'>회원 탈퇴</span>
          <MobileProfileButtonIcon />
        </Link>
      </div>
    </div>
  );
}
