'use client';

import { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/CheckBox';

export type TemplateType =
  | 'none'
  | '대인관계'
  | '문제해결'
  | '학습'
  | '레퍼런스'
  | '기타';

interface InsightTemplateSelectorProps {
  onCategoryChange?: (category: TemplateType) => void;
  onContentChange?: (content: string) => void;
  contentError?: string;
}

// 인사이트 템플릿 선택 및 폼 표시 컴포넌트
export function InsightTemplateSelector({
  onCategoryChange,
  onContentChange,
  contentError,
}: InsightTemplateSelectorProps = {}) {
  const [isTemplateEnabled, setIsTemplateEnabled] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType>('none');

  // 각 템플릿의 입력값 저장
  const [noTemplateContent, setNoTemplateContent] = useState('');
  const [interpersonData, setInterpersonData] = useState({
    situation: '',
    response: '',
    result: '',
    lesson: '',
  });
  const [problemSolveData, setProblemSolveData] = useState({
    problem: '',
    attempt: '',
    result: '',
    lesson: '',
  });
  const [learningData, setLearningData] = useState({
    path: '',
    learned: '',
    plan: '',
  });
  const [referenceData, setReferenceData] = useState({
    source: '',
    content: '',
    thought: '',
    plan: '',
  });

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
    // 체크 해제 시 카테고리 선택도 해제
    if (!checked) {
      setSelectedTemplate('none');
      onCategoryChange?.('none');
    }
  };

  // 템플릿 선택 변경 핸들러
  const handleTemplateChange = (value: string) => {
    if (value) {
      const newTemplate = value as TemplateType;
      setSelectedTemplate(newTemplate);
      onCategoryChange?.(newTemplate);
    }
  };

  // 템플릿 내용 포맷팅 및 상위 컴포넌트로 전달
  useEffect(() => {
    let formattedContent = '';

    if (!isTemplateEnabled || selectedTemplate === 'none') {
      formattedContent = noTemplateContent;
    } else {
      switch (selectedTemplate) {
        case '대인관계':
          formattedContent = [
            interpersonData.situation && `상황 - ${interpersonData.situation}`,
            interpersonData.response &&
              `나의 반응 - ${interpersonData.response}`,
            interpersonData.result && `결과 - ${interpersonData.result}`,
            interpersonData.lesson && `배운 점 - ${interpersonData.lesson}`,
          ]
            .filter(Boolean)
            .join('\n');
          break;
        case '문제해결':
          formattedContent = [
            problemSolveData.problem && `문제 - ${problemSolveData.problem}`,
            problemSolveData.attempt && `시도 - ${problemSolveData.attempt}`,
            problemSolveData.result && `결과 - ${problemSolveData.result}`,
            problemSolveData.lesson && `배운 점 - ${problemSolveData.lesson}`,
          ]
            .filter(Boolean)
            .join('\n');
          break;
        case '학습':
          formattedContent = [
            learningData.path && `학습 경로 - ${learningData.path}`,
            learningData.learned && `배운 내용 - ${learningData.learned}`,
            learningData.plan && `적용 계획 - ${learningData.plan}`,
          ]
            .filter(Boolean)
            .join('\n');
          break;
        case '레퍼런스':
          formattedContent = [
            referenceData.source && `출처 - ${referenceData.source}`,
            referenceData.content && `내용 - ${referenceData.content}`,
            referenceData.thought && `생각 - ${referenceData.thought}`,
            referenceData.plan && `적용 계획 - ${referenceData.plan}`,
          ]
            .filter(Boolean)
            .join('\n');
          break;
        case '기타':
          formattedContent = noTemplateContent;
          break;
      }
    }

    onContentChange?.(formattedContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isTemplateEnabled,
    selectedTemplate,
    noTemplateContent,
    interpersonData,
    problemSolveData,
    learningData,
    referenceData,
  ]);

  // 선택된 템플릿에 따른 폼 렌더링
  const renderTemplateForm = () => {
    // 체크박스가 체크되고 템플릿이 선택되었을 때만 해당 템플릿 표시
    if (!isTemplateEnabled || selectedTemplate === 'none') {
      return (
        <NoTemplateForm
          content={noTemplateContent}
          setContent={setNoTemplateContent}
          contentError={contentError}
        />
      );
    }

    switch (selectedTemplate) {
      case '대인관계':
        return (
          <InterpersonTemplateForm
            data={interpersonData}
            setData={setInterpersonData}
            contentError={contentError}
          />
        );
      case '문제해결':
        return (
          <ProblemSolveTemplateForm
            data={problemSolveData}
            setData={setProblemSolveData}
            contentError={contentError}
          />
        );
      case '학습':
        return (
          <LearningTemplateForm
            data={learningData}
            setData={setLearningData}
            contentError={contentError}
          />
        );
      case '레퍼런스':
        return (
          <ReferenceTemplateForm
            data={referenceData}
            setData={setReferenceData}
            contentError={contentError}
          />
        );
      case '기타':
        return (
          <NoTemplateForm
            content={noTemplateContent}
            setContent={setNoTemplateContent}
            contentError={contentError}
          />
        );
      default:
        return (
          <NoTemplateForm
            content={noTemplateContent}
            setContent={setNoTemplateContent}
            contentError={contentError}
          />
        );
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
            value={selectedTemplate !== 'none' ? selectedTemplate : undefined}
            onValueChange={handleTemplateChange}
          />
        </div>
      </div>

      {/* 선택된 템플릿 폼 */}
      {renderTemplateForm()}
    </div>
  );
}
