'use client';

import {
  CorrectionListGrid,
  type CorrectionListItem,
} from '@/features/correction/components/CorrectionListGrid';
import { CorrectionListHeader } from '@/features/correction/components/CorrectionListHeader';
import { CorrectionListSearch } from '@/features/correction/components/CorrectionListSearch';

// TODO: 첨삭 카드 없을 때, 검색 결과 없을 때 문구
// TODO: href에 실제 첨삭 ID 연결, API 데이터로 교체
const MOCK_CORRECTION_LIST: CorrectionListItem[] = [
  { title: '삼성SDI 포트폴리오', tag: '영업 마케팅', date: '2000-00-00', href: '/correction' },
  { title: '새로운 포트폴리오 첨삭', tag: '디자인', date: '2000-00-00', href: '/correction' },
  { title: '2023 삼성SDI 포트폴리오', tag: '품질', date: '2000-00-00', href: '/correction' },
];

export default function CorrectionPage() {
  return (
    <div className='flex flex-col gap-[4.5rem] pb-[6.25rem]'>
      <CorrectionListHeader />
      <div className='mx-auto flex w-[66rem] flex-col gap-[3rem]'>
        <CorrectionListSearch />
        <CorrectionListGrid items={MOCK_CORRECTION_LIST} />
      </div>
    </div>
  );
}
