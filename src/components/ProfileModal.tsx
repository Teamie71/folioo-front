'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/Dialog';
import {
  useUserControllerGetProfile,
  useUserControllerUpdateProfile,
  useUserControllerUpdateMarketingConsent,
  getUserControllerGetProfileQueryKey,
} from '@/api/endpoints/user/user';
import type { UserProfileResDTO } from '@/api/models/userProfileResDTO';
import { ProfileEditButton } from '@/components/ProfileEditButton';
import Link from 'next/link';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ToggleOnOff } from './ToggleOnOff';
import { ProfileSocialAccounts } from '@/components/ProfileSocialAccounts';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  // 프로필 조회
  const { data: profileRes } = useUserControllerGetProfile({
    query: { enabled: open },
  });
  // 프로필 상태
  const [profile, setProfile] = useState<UserProfileResDTO | null>(null);

  useEffect(() => {
    if (open && profileRes?.result) setProfile(profileRes.result);
    else if (!open) setProfile(null);
  }, [open, profileRes?.result]);

  // 프로필 업데이트
  const queryClient = useQueryClient();

  const { mutate: updateProfile } = useUserControllerUpdateProfile({
    mutation: {
      onSuccess: (_, variables) => {
        setProfile((prev) =>
          prev ? { ...prev, name: variables.data.name } : null,
        );
        queryClient.invalidateQueries({
          queryKey: getUserControllerGetProfileQueryKey(),
        });
      },
    },
  });

  // 이름 저장
  const handleNameSave = (newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    updateProfile({ data: { name: trimmed } });
  };

  // 마케팅 정보 수신 동의 변경
  const { mutate: updateMarketingConsent } =
    useUserControllerUpdateMarketingConsent({
      mutation: {
        onSuccess: (_, variables) => {
          setProfile((prev) =>
            prev
              ? { ...prev, isMarketingAgreed: variables.data.isMarketingAgreed }
              : null,
          );
          queryClient.invalidateQueries({
            queryKey: getUserControllerGetProfileQueryKey(),
          });
        },
      },
    });

  const handleMarketingConsentChange = (next: boolean) => {
    updateMarketingConsent({ data: { isMarketingAgreed: next } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex h-auto w-auto flex-col gap-[1.5rem] rounded-[1.75rem] bg-white p-[2.5rem] [&>button]:top-[1rem] [&>button]:right-[1rem] [&>button>svg]:h-[1.75rem] [&>button>svg]:w-[1.75rem]'>
        <DialogTitle className='text-[1.25rem] leading-[130%] font-bold text-[#1A1A1A]'>
          프로필
        </DialogTitle>

        <DialogDescription className='sr-only'>프로필 정보</DialogDescription>

        <div className='flex w-[33rem] flex-col gap-[1.5rem]'>
          <div className='rounded-[1.25rem] bg-[#FDFDFD] px-[1.75rem] py-[1.5rem]'>
            <div className='flex flex-col gap-[1rem]'>
              <div className='flex items-center justify-between'>
                <ProfileEditButton
                  value={profile?.name ?? ''}
                  onSave={handleNameSave}
                  textClassName='!text-[1.125rem] !leading-[130%]'
                />
              </div>

              <ProfileSocialAccounts
                socialAccounts={profile?.socialAccounts ?? []}
              />
            </div>
          </div>

          <div className='flex flex-col gap-[1.5rem] rounded-[1.25rem] bg-[#FDFDFD] px-[1.75rem] py-[1.5rem]'>
            <div className='flex flex-col gap-[2rem]'>
              <div className='flex items-center justify-between'>
                <p className='text-[1.125rem] leading-[150%] text-[#1A1A1A]'>
                  서비스 이용약관
                </p>
                <Link
                  href='/tos'
                  className='scale-x-[-1] cursor-pointer'
                  aria-label='서비스 이용약관'
                >
                  <ChevronLeftIcon />
                </Link>
              </div>

              <div className='flex items-center justify-between'>
                <p className='text-[1.125rem] leading-[150%] text-[#1A1A1A]'>
                  개인정보 처리방침
                </p>
                <Link
                  href='/privacy'
                  className='scale-x-[-1] cursor-pointer'
                  aria-label='개인정보 처리방침'
                >
                  <ChevronLeftIcon />
                </Link>
              </div>

              <div className='flex items-center justify-between'>
                <p className='text-[1.125rem] leading-[150%] text-[#1A1A1A]'>
                  마케팅 정보 수신
                </p>
                <Link
                  href='/marketing'
                  className='scale-x-[-1] cursor-pointer'
                  aria-label='마케팅 정보 수신'
                >
                  <ChevronLeftIcon />
                </Link>
              </div>

              <div className='flex items-center justify-between'>
                <p className='text-[1.125rem] leading-[150%] text-[#1A1A1A]'>
                  마케팅 정보 수신 동의
                </p>
                <ToggleOnOff
                  checked={profile?.isMarketingAgreed ?? false}
                  onCheckedChange={handleMarketingConsentChange}
                />
              </div>
            </div>

            <div className='w-full border border-[#CDD0D5]' />

            <div className='flex items-center justify-between'>
              <p className='text-[1.125rem] leading-[150%] text-[#DC0000]'>
                회원 탈퇴
              </p>
              <Link
                href='/withdraw'
                className='scale-x-[-1] cursor-pointer'
                aria-label='회원 탈퇴'
                onClick={() => onOpenChange(false)}
              >
                <ChevronLeftIcon />
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
