'use client';

import { useEffect } from 'react';
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
import { useLogStore, type TemplateType } from '@/store/useLogStore';

export type { TemplateType };

interface InsightTemplateSelectorProps {
  onCategoryChange?: (category: TemplateType) => void;
  contentError?: string;
}

// 인사이트 템플릿 선택 및 폼 표시 컴포넌트
export function InsightTemplateSelector({
  onCategoryChange,
  contentError,
}: InsightTemplateSelectorProps = {}) {
  const {
    isTemplateEnabled,
    selectedTemplate,
    noTemplateContent,
    interpersonData,
    problemSolveData,
    learningData,
    referenceData,
    setIsTemplateEnabled,
    setSelectedTemplate,
    setNoTemplateContent,
    setInterpersonData,
    setProblemSolveData,
    setLearningData,
    setReferenceData,
    getFormattedContent,
    getCurrentTemplateFields,
    setFormField,
  } = useLogStore();

  const getTemplateItemCount = (t: TemplateType): number => {
    if (t === 'none' || t === '기타') return 0;
    if (t === '학습') return 3;
    return 4;
  };

  /* 라벨을 제거하고 내용만 반환 */
  const stripTemplateLabels = (text: string): string => {
    if (!text.trim()) return text;
    return text
      .split('\n')
      .map((line) => {
        const sep = ' - ';
        const idx = line.indexOf(sep);
        if (idx !== -1) return line.slice(idx + sep.length).trim();
        return line.trim();
      })
      .join('\n');
  };

  /* 이전 템플릿 → 새 템플릿으로 필드 배열 마이그레이션 (4→3 시 하단 2개를 하단 1개로) */
  const migrateFields = (
    prev: TemplateType,
    next: TemplateType,
    fields: string[],
  ): string[] => {
    const prevN = getTemplateItemCount(prev);
    const nextN = getTemplateItemCount(next);
    if (prevN === 0 || nextN === 0) return fields;
    // 4항목 → 3항목: 항목 내용이 3개뿐이면(4번째 비어 있음) 1·2·3번 그대로 유지. 4번째에 내용 있으면 하단 2개 합쳐서 맨 아래에
    if (prevN === 4 && nextN === 3) {
      const fourth = fields[3]?.trim() ?? '';
      if (!fourth) {
        return [fields[0] ?? '', fields[1] ?? '', fields[2] ?? ''];
      }
      const third = fields[2]?.trim() ?? '';
      const bottomOne = [third, fourth].filter(Boolean).join('');
      return [fields[0] ?? '', fields[1] ?? '', bottomOne];
    }
    // 3항목 → 4항목: 1,2,3 → 1,2,3, ''
    if (prevN === 3 && nextN === 4) {
      return [fields[0] || '', fields[1] || '', fields[2] || '', ''];
    }
    // 4→4, 3→3: 그대로 (길이 맞추기)
    if (nextN === 4)
      return [
        fields[0] ?? '',
        fields[1] ?? '',
        fields[2] ?? '',
        fields[3] ?? '',
      ];
    return [fields[0] ?? '', fields[1] ?? '', fields[2] ?? ''];
  };

  /** 새 템플릿 타입에 맞게 스토어 데이터 설정 */
  const applyTemplateData = (template: TemplateType, fields: string[]) => {
    switch (template) {
      case '대인관계':
        setInterpersonData({
          situation: fields[0] ?? '',
          response: fields[1] ?? '',
          result: fields[2] ?? '',
          lesson: fields[3] ?? '',
        });
        break;
      case '문제해결':
        setProblemSolveData({
          problem: fields[0] ?? '',
          attempt: fields[1] ?? '',
          result: fields[2] ?? '',
          lesson: fields[3] ?? '',
        });
        break;
      case '학습':
        setLearningData({
          path: fields[0] ?? '',
          learned: fields[1] ?? '',
          plan: fields[2] ?? '',
        });
        break;
      case '레퍼런스':
        setReferenceData({
          source: fields[0] ?? '',
          content: fields[1] ?? '',
          thought: fields[2] ?? '',
          plan: fields[3] ?? '',
        });
        break;
      case '기타':
      case 'none':
        setNoTemplateContent(getFormattedContent() || fields[0] || '');
        break;
    }
  };

  // 템플릿 버튼 목록
  const templateOptions = [
    { label: '대인관계', icon: <InterpersonIcon /> },
    { label: '문제해결', icon: <ProblemSolveIcon /> },
    { label: '학습', icon: <LearningIcon /> },
    { label: '레퍼런스', icon: <ReferenceIcon /> },
    { label: '기타', icon: <EtcIcon /> },
  ];

  // 체크박스 변경 핸들러 (해제 시에도 선택된 태그 유지)
  const handleCheckboxChange = (checked: boolean) => {
    if (!checked) {
      // 전체 입력값을 텍스트 영역에 유지
      setNoTemplateContent(getFormattedContent());
      setIsTemplateEnabled(false);
    } else {
      setIsTemplateEnabled(true);
    }
  };

  // 템플릿(카테고리 태그) 선택 변경 핸들러 — 단일 선택, 재클릭 시 선택 해제 불가
  const handleTemplateChange = (value: string) => {
    if (!value) return;
    const newTemplate = value as TemplateType;
    const prevTemplate = selectedTemplate;

    // 기타로 전환 시: 현재 템플릿 전체 내용을 noTemplateContent에 반영
    if (newTemplate === '기타') {
      setNoTemplateContent(getFormattedContent());
      setSelectedTemplate('기타');
      onCategoryChange?.('기타');
      return;
    }

    const fields = getCurrentTemplateFields();
    // 텍스트 영역 또는 기타 → 구조 템플릿: 태그 명을 빼고 내용만 첫 번째 항목에 표시
    const prevIsText = prevTemplate === 'none' || prevTemplate === '기타';
    const contentForFirst = prevIsText
      ? stripTemplateLabels(fields[0] ?? '')
      : null;
    let newFields = prevIsText
      ? getTemplateItemCount(newTemplate) === 4
        ? [contentForFirst ?? '', '', '', '']
        : [contentForFirst ?? '', '', '']
      : migrateFields(prevTemplate, newTemplate, fields);

    // 4→3 전환 시 항상 이전(4개) 템플릿 내용만 반영. 3개 템플릿 기존 값에 이어붙이지 않아 중복 방지
    applyTemplateData(newTemplate, newFields);
    setSelectedTemplate(newTemplate);
    onCategoryChange?.(newTemplate);
  };

  // 템플릿 내용 포맷팅 및 상위 컴포넌트로 전달
  useEffect(() => {
    const formattedContent = getFormattedContent();
    setFormField('content', formattedContent);
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
