'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/Dialog';
import { InlineEdit } from './InlineEdit';
import { ModifyIcon } from './icons/ModifyIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ToggleLarge } from './ToggleLarge';
import { ToggleOnOff } from './ToggleOnOff';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex h-auto w-auto flex-col gap-[1.5rem] p-[2.5rem]'>
        <DialogTitle className='text-[1.25rem] leading-[130%] font-bold text-[#1A1A1A]'>
          프로필
        </DialogTitle>

        <DialogDescription className='flex w-[33rem] flex-col gap-[1.5rem]'>
          <div className='rounded-[1.25rem] bg-[#FDFDFD] px-[1.75rem] py-[1.5rem]'>
            <div className='flex flex-col gap-[1rem]'>
              <div className='gap-[ flex items-center justify-between'>
                <p className='text-[1.125rem] leading-[130%] font-bold text-[#1A1A1A]'>
                  이름이름이름
                </p>
                <ModifyIcon />
              </div>

              <div className='flex flex-col gap-[0.25rem]'>
                {/* 계정1 */}
                <div className='flex items-center gap-[0.75rem]'>
                  <div className='h-[1.25rem] w-[1.25rem] rounded-full bg-[#D9D9D9]' />
                  <div className='text-[1rem] leading-[150%] text-[#74777D]'>
                    teamie0701@gmail.com
                  </div>
                </div>

                {/* 계정2 */}
                <div className='flex items-center gap-[0.75rem]'>
                  <div className='h-[1.25rem] w-[1.25rem] rounded-full bg-[#D9D9D9]' />
                  <div className='text-[1rem] leading-[150%] text-[#74777D]'>
                    teamie0701@gmail.com
                  </div>
                </div>

                {/* 계정3 */}
                <div className='flex items-center gap-[0.75rem]'>
                  <div className='h-[1.25rem] w-[1.25rem] rounded-full bg-[#D9D9D9]' />
                  <p className='text-[1rem] leading-[150%] text-[#74777D]'>
                    teamie0701@gmail.com
                  </p>
                </div>
              </div>
            </div>

            <div className='mt-[1.5rem] mb-[1.5rem] w-full border border-[#CDD0D5]' />

            <div className='flex items-center justify-between text-[1.125rem] leading-[150%] text-[#1A1A1A]'>
              <p>휴대폰</p>
              <p>010-1234-5678</p>
            </div>
          </div>

          <div className='flex flex-col gap-[1.5rem] rounded-[1.25rem] bg-[#FDFDFD] px-[2.25rem] py-[1.5rem]'>
            <div className='flex items-center justify-between'>
              <p className='text-[1.125rem] leading-[150%] text-[#1A1A1A]'>
                이용권 거래 내역
              </p>
              <button className='scale-x-[-1] cursor-pointer'>
                <ChevronLeftIcon />
              </button>
            </div>

            <div className='w-full border border-[#CDD0D5]' />

            <div className='flex flex-col gap-[2rem]'>
              <div className='flex items-center justify-between'>
                <p className='text-[1.125rem] leading-[150%] text-[#1A1A1A]'>
                  개인정보 처리방침
                </p>
                <button className='scale-x-[-1] cursor-pointer'>
                  <ChevronLeftIcon />
                </button>
              </div>

              <div className='flex items-center justify-between'>
                <p className='text-[1.125rem] leading-[150%] text-[#1A1A1A]'>
                  마케팅 정보 수신
                </p>
                <button className='scale-x-[-1] cursor-pointer'>
                  <ChevronLeftIcon />
                </button>
              </div>

              <div className='flex items-center justify-between'>
                <p className='text-[1.125rem] leading-[150%] text-[#1A1A1A]'>
                  마케팅 정보 수신 동의
                </p>
                <ToggleOnOff />
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
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
