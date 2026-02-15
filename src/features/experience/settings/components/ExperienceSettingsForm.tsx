'use client';

import { SingleButtonGroup } from '@/components/SingleButtonGroup';
import InputArea from '@/components/InputArea';
import { useExperienceStore } from '@/store/useExperienceStore';

const JOB_OPTIONS = [
  { label: '미정' },
  { label: '기획' },
  { label: '광고/마케팅' },
  { label: '디자인' },
  { label: 'IT 개발' },
  { label: '영상/미디어' },
  { label: '데이터' },
];

interface ExperienceSettingsFormProps {
  errors: Partial<Record<'experienceName' | 'desiredJob', string>>;
}

export function ExperienceSettingsForm({
  errors,
}: ExperienceSettingsFormProps) {
  const { formData, setFormField } = useExperienceStore();

  return (
    <div className='flex flex-col gap-[3.75rem]'>
      {/* 경험명 입력 */}
      <div className='flex flex-col gap-[1rem]'>
        <div className='flex flex-col gap-[0.25rem]'>
          <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
            <span>경험명</span>
            <span className='text-[#DC0000]'>*</span>
          </div>
          {errors.experienceName && (
            <p className='text-[0.875rem] text-[#DC0000]'>
              {errors.experienceName}
            </p>
          )}
        </div>
        <InputArea
          placeholder='경험명을 입력해주세요.'
          value={formData.experienceName}
          onChange={(e) => setFormField('experienceName', e.target.value)}
        />
      </div>

      {/* 희망 직군 선택 */}
      <div className='flex flex-col gap-[1rem]'>
        <div className='flex flex-col gap-[0.25rem] text-[1.125rem]'>
          <div className='flex items-center gap-[0.25rem] font-bold'>
            <span>희망 직군</span>
            <span className='text-[#DC0000]'>*</span>
          </div>
          <span className='font-regular text-[0.825rem] text-[#74777D]'>
            희망 직군에 맞추어 경험을 체계적으로 정리하세요.
          </span>
          {errors.desiredJob && (
            <p className='text-[0.875rem] text-[#DC0000]'>
              {errors.desiredJob}
            </p>
          )}
        </div>
        {/* 직무 목록 */}
        <SingleButtonGroup
          options={JOB_OPTIONS}
          value={formData.desiredJob}
          onValueChange={(value) => setFormField('desiredJob', value)}
        />
      </div>
    </div>
  );
}
