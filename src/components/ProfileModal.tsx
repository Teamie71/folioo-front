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
import type { UserSocialAccountResDTO } from '@/api/models/userSocialAccountResDTO';
import type { UserSocialAccountResDTOSocialType } from '@/api/models/userSocialAccountResDTOSocialType';
import { ProfileEditButton } from '@/components/ProfileEditButton';
import Link from 'next/link';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { GoogleEmailLogo } from './icons/GoogleEmailLogo';
import { KakaoEmailLogo } from './icons/KakaoEmailLogo';
import { NaverEmailLogo } from './icons/NaverEmailLogo';
import { ToggleOnOff } from './ToggleOnOff';
import Image from 'next/image';

/* Orval socialEmail 등 표시용 */
function toDisplayString(v: unknown): string {
  if (v == null) return '-';
  if (typeof v === 'string') return v || '-';
  return '-';
}

function SocialEmailLogo({
  type,
}: {
  type?: UserSocialAccountResDTOSocialType;
}) {
  switch (type) {
    case 'KAKAO':
      return (
        <Image src='/KakaoEmailLogo.svg' alt='Kakao' width={20} height={20} />
      );
    case 'NAVER':
      return (
        <Image src='/NaverEmailLogo.svg' alt='Naver' width={20} height={20} />
      );
    case 'GOOGLE':
      return (
        <Image src='/GoogleEmailLogo.svg' alt='Google' width={20} height={20} />
      );
    default:
      return (
        <div className='h-[1.25rem] w-[1.25rem] flex-shrink-0 rounded-full bg-[#D9D9D9]' />
      );
  }
}

/* 카카오, 네이버, 구글 순으로 로그인한 소셜 계정마다 로고+이메일 표시 */
const SOCIAL_ORDER: UserSocialAccountResDTOSocialType[] = [
  'KAKAO',
  'NAVER',
  'GOOGLE',
];
function SocialAccountRows({
  socialAccounts,
}: {
  socialAccounts: UserSocialAccountResDTO[];
}) {
  const byType = new Map(socialAccounts.map((a) => [a.socialType, a]));
  const ordered = SOCIAL_ORDER.filter((t) => byType.has(t)).map(
    (t) => byType.get(t)!,
  );
  if (ordered.length === 0) return null;
  return (
    <div className='flex flex-col gap-[0.25rem]'>
      {ordered.map((account) => (
        <div
          key={account.socialType}
          className='flex items-center gap-[0.25rem]'
        >
          <SocialEmailLogo type={account.socialType} />
          <span className='text-[1rem] leading-[150%] text-[#74777D]'>
            {toDisplayString(account.socialEmail)}
          </span>
        </div>
      ))}
    </div>
  );
}

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
      <DialogContent className='flex h-auto w-auto flex-col gap-[1.5rem] p-[2.5rem]'>
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
                />
              </div>

              <SocialAccountRows
                socialAccounts={profile?.socialAccounts ?? []}
              />
            </div>

            <div className='mt-[1.5rem] mb-[1.5rem] w-full border border-[#CDD0D5]' />

            <div className='flex items-center justify-between text-[1.125rem] leading-[150%] text-[#1A1A1A]'>
              <p>휴대폰</p>
              <p>{toDisplayString(profile?.phoneNum)}</p>
            </div>
          </div>

          <div className='flex flex-col gap-[1.5rem] rounded-[1.25rem] bg-[#FDFDFD] px-[2.25rem] py-[1.5rem]'>
            <div className='flex items-center justify-between'>
              <p className='text-[1.125rem] leading-[150%] text-[#1A1A1A]'>
                이용권 거래 내역
              </p>
              <Link
                href='/invoice'
                className='scale-x-[-1] cursor-pointer'
                aria-label='이용권 거래 내역'
                onClick={() => onOpenChange(false)}
              >
                <ChevronLeftIcon />
              </Link>
            </div>

            <div className='w-full border border-[#CDD0D5]' />

            <div className='flex flex-col gap-[2rem]'>
              <div className='flex items-center justify-between'>
                <p className='text-[1.125rem] leading-[150%] text-[#1A1A1A]'>
                  서비스 이용 약관
                </p>
                <Link
                  href='/tos'
                  className='scale-x-[-1] cursor-pointer'
                  aria-label='서비스 이용 약관'
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
              <button className='scale-x-[-1] cursor-pointer'>
                <ChevronLeftIcon />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
