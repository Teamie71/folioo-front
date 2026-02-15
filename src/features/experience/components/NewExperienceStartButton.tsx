'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CommonButton } from '@/components/CommonButton';
import { useExperienceStore } from '@/store/useExperienceStore';
import { ExperienceCardMaxModal } from './ExperienceCardMaxModal';

const MAX_EXPERIENCE_CARDS = 15;

export function NewExperienceStartButton() {
  const { experienceCards } = useExperienceStore();
  const [modalOpen, setModalOpen] = useState(false);
  const isMaxCards = experienceCards.length >= MAX_EXPERIENCE_CARDS;

  if (isMaxCards) {
    return (
      <>
        <CommonButton
          variantType='StartChat'
          onClick={() => setModalOpen(true)}
        >
          새로운 경험 정리 시작하기
        </CommonButton>
        <ExperienceCardMaxModal open={modalOpen} onOpenChange={setModalOpen} />
      </>
    );
  }

  return (
    <Link href='/experience/settings' className='no-underline'>
      <CommonButton variantType='StartChat'>
        새로운 경험 정리 시작하기
      </CommonButton>
    </Link>
  );
}
