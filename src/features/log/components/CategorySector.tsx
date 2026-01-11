'use client';

import { useState } from 'react';
import EtcIcon from '@/components/icons/EtcIcon';
import InterpersonIcon from '@/components/icons/InterpersonIcon';
import LearningIcon from '@/components/icons/LearningIcon';
import ProblemSolveIcon from '@/components/icons/ProblemSolveIcon';
import ReferenceIcon from '@/components/icons/ReferenceIcon';
import { SingleButtonGroup } from '@/components/SingleButtonGroup';
import {
  NoTemplateForm,
  InterpersonTemplateForm,
  ProblemSolveTemplateForm,
  LearningTemplateForm,
  ReferenceTemplateForm,
} from './CategoryTemplates';
import { Checkbox } from '@/components/ui/checkbox';

type TemplateType =
  | 'none'
  | '대인관계'
  | '문제해결'
  | '학습'
  | '레퍼런스'
  | '기타';

// 인사이트 템플릿 선택 및 폼 표시 컴포넌트
export function InsightTemplateSelector() {
  const [isTemplateEnabled, setIsTemplateEnabled] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType>('none');

  // 템플릿 버튼 목록
  const templateOptions = [
    { label: '대인관계', icon: <InterpersonIcon /> },
    { label: '문제해결', icon: <ProblemSolveIcon /> },
    { label: '학습', icon: <LearningIcon /> },
    { label: '레퍼런스', icon: <ReferenceIcon /> },
    { label: '기타', icon: <EtcIcon /> },
  ];

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (checked: boolean) => {
    setIsTemplateEnabled(checked);
  };

  // 템플릿 선택 변경 핸들러
  const handleTemplateChange = (value: string) => {
    if (value) {
      setSelectedTemplate(value as TemplateType);
    }
  };

  // 선택된 템플릿에 따른 폼 렌더링
  const renderTemplateForm = () => {
    // 체크박스가 체크되고 템플릿이 선택되었을 때만 해당 템플릿 표시
    if (!isTemplateEnabled || selectedTemplate === 'none') {
      return <NoTemplateForm />;
    }

    switch (selectedTemplate) {
      case '대인관계':
        return <InterpersonTemplateForm />;
      case '문제해결':
        return <ProblemSolveTemplateForm />;
      case '학습':
        return <LearningTemplateForm />;
      case '레퍼런스':
        return <ReferenceTemplateForm />;
      case '기타':
        return <NoTemplateForm />;
      default:
        return <NoTemplateForm />;
    }
  };

  return (
    <div className='flex flex-col gap-[3.75rem]'>
      <div className='flex flex-col gap-[1rem]'>
        <div className='flex flex-col gap-[0.5rem]'>
          <div className='flex items-center gap-[0.75rem]'>
            <Checkbox
              checked={isTemplateEnabled}
              onCheckedChange={handleCheckboxChange}
            />
            <span>템플릿 사용</span>
          </div>
          <span className='text-[0.875rem] text-[#74777D]'>
            카테고리 맞춤 템플릿을 사용하여 인사이트를 체계적으로 기록하세요.
          </span>
        </div>

        <div className='flex flex-col gap-[0.5rem]'>
          {/* 템플릿 선택 버튼 */}
          <SingleButtonGroup
            options={templateOptions}
            onValueChange={handleTemplateChange}
          />
        </div>
      </div>

      {/* 선택된 템플릿 폼 */}
      {renderTemplateForm()}
    </div>
  );
}
