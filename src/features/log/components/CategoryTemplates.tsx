'use client';

import InputArea from '@/components/InputArea';
import TextField from '@/components/TextField';

const MAX_CONTENT_LENGTH = 250;
const COUNT_WARN_THRESHOLD = 240;

/* 템플릿별 고정 라벨 문자열(스토어 포맷과 동일). 선택 시 항상 글자수에 포함됨 */
const TEMPLATE_LABELS = {
  interperson: ['상황/ 대상 - ', '대응 - ', '결과 - ', '배운 점/ 계획 - '],
  problemSolve: ['문제 상황 - ', '해결 시도 - ', '결과 - ', '배운 점/ 계획 - '],
  learning: ['학습 경로 - ', '배운 내용 - ', '적용 계획 - '],
  reference: ['출처 - ', '내용 - ', '나의 생각 - ', '적용 계획 - '],
} as const;

/* 고정 라벨 + 줄바꿈 길이 (템플릿 선택 시 무조건 글자수에 포함) */
function getTemplateLabelLength(type: keyof typeof TEMPLATE_LABELS): number {
  const labels = TEMPLATE_LABELS[type];
  return labels.join('\n').length;
}

/* 라벨 길이 + 입력 내용 길이. 라벨은 항상 포함 */
function getFormattedLength(
  type: keyof typeof TEMPLATE_LABELS,
  data: Record<string, string>,
): number {
  const toLine = (v: string) => (v || '').replace(/\n/g, '');
  const labelLength = getTemplateLabelLength(type);
  let contentLength = 0;
  switch (type) {
    case 'interperson':
      contentLength =
        toLine(data.situation).length +
        toLine(data.response).length +
        toLine(data.result).length +
        toLine(data.lesson).length;
      break;
    case 'problemSolve':
      contentLength =
        toLine(data.problem).length +
        toLine(data.attempt).length +
        toLine(data.result).length +
        toLine(data.lesson).length;
      break;
    case 'learning':
      contentLength =
        toLine(data.path).length +
        toLine(data.learned).length +
        toLine(data.plan).length;
      break;
    case 'reference':
      contentLength =
        toLine(data.source).length +
        toLine(data.content).length +
        toLine(data.thought).length +
        toLine(data.plan).length;
      break;
  }
  return labelLength + contentLength;
}

// 템플릿 미사용 폼
interface NoTemplateFormProps {
  content: string;
  setContent: (value: string) => void;
  contentError?: string;
}

export function NoTemplateForm({
  content,
  setContent,
  contentError,
}: NoTemplateFormProps) {
  return (
    <div className='flex flex-col gap-[0.5rem]'>
      <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
        <span>내용</span>
        <span className='text-[#DC0000]'>*</span>
      </div>

      {contentError && (
        <p className='font-regular text-[0.875rem] text-[#DC0000]'>
          {contentError}
        </p>
      )}

      <div className='flex flex-col'>
        <TextField
          variant='wide'
          height='13.75rem'
          placeholder='오늘은 어떤 인사이트를 얻으셨나요?'
          value={content}
          maxLength={MAX_CONTENT_LENGTH}
          onChange={(e) =>
            setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))
          }
        />
        <span
          className={`mt-[0.5rem] text-right ${content.length >= COUNT_WARN_THRESHOLD ? 'text-[#DC0000]' : ''}`}
        >
          {content.length}/{MAX_CONTENT_LENGTH}
        </span>
      </div>
    </div>
  );
}

// 대인관계 템플릿 폼
interface InterpersonTemplateFormProps {
  data: {
    situation: string;
    response: string;
    result: string;
    lesson: string;
  };
  setData: (data: {
    situation: string;
    response: string;
    result: string;
    lesson: string;
  }) => void;
  contentError?: string;
}

export function InterpersonTemplateForm({
  data,
  setData,
  contentError,
}: InterpersonTemplateFormProps) {
  const totalLength = getFormattedLength('interperson', data);
  const maxSituation =
    MAX_CONTENT_LENGTH -
    getFormattedLength('interperson', { ...data, situation: '' });
  const maxResponse =
    MAX_CONTENT_LENGTH -
    getFormattedLength('interperson', { ...data, response: '' });
  const maxResult =
    MAX_CONTENT_LENGTH -
    getFormattedLength('interperson', { ...data, result: '' });
  const maxLesson =
    MAX_CONTENT_LENGTH -
    getFormattedLength('interperson', { ...data, lesson: '' });

  return (
    <div className='flex flex-col gap-[1.25rem]'>
      <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
        <span>내용</span>
        <span className='text-[#DC0000]'>*</span>
      </div>

      {contentError && (
        <p className='font-regular text-[0.875rem] text-[#DC0000]'>
          {contentError}
        </p>
      )}

      <div className='flex flex-col gap-[0.5rem]'>
        <div className='flex flex-col gap-[1.25rem]'>
          {/* 상황/대상 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>상황/ 대상</span>
            <input
              className='line-height-[150%] w-[51.25rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
              placeholder='누구와, 어떤 상황이 발생했나요?'
              value={data.situation}
              onChange={(e) =>
                setData({
                  ...data,
                  situation: e.target.value.slice(0, maxSituation),
                })
              }
            />
          </div>

          {/* 대응 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>대응</span>
            <input
              className='line-height-[150%] w-[51.25rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
              placeholder='나는 어떻게 대응했나요?'
              value={data.response}
              onChange={(e) =>
                setData({
                  ...data,
                  response: e.target.value.slice(0, maxResponse),
                })
              }
            />
          </div>

          {/* 결과 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>결과</span>
            <input
              className='line-height-[150%] w-[51.25rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
              placeholder='어떤 결과가 나타났나요?'
              value={data.result}
              onChange={(e) =>
                setData({
                  ...data,
                  result: e.target.value.slice(0, maxResult),
                })
              }
            />
          </div>

          {/* 배운 점/계획 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>배운 점/ 계획</span>
            <input
              className='line-height-[150%] w-[51.25rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
              placeholder='무엇을 배웠고, 앞으로는 비슷한 상황에서 어떻게 대응할건가요?'
              value={data.lesson}
              onChange={(e) =>
                setData({
                  ...data,
                  lesson: e.target.value.slice(0, maxLesson),
                })
              }
            />
          </div>
        </div>

        <span
          className={`text-right ${totalLength >= COUNT_WARN_THRESHOLD ? 'text-[#DC0000]' : ''}`}
        >
          {totalLength}/{MAX_CONTENT_LENGTH}
        </span>
      </div>
    </div>
  );
}

// 문제해결 템플릿 폼
interface ProblemSolveTemplateFormProps {
  data: {
    problem: string;
    attempt: string;
    result: string;
    lesson: string;
  };
  setData: (data: {
    problem: string;
    attempt: string;
    result: string;
    lesson: string;
  }) => void;
  contentError?: string;
}

export function ProblemSolveTemplateForm({
  data,
  setData,
  contentError,
}: ProblemSolveTemplateFormProps) {
  const totalLength = getFormattedLength('problemSolve', data);
  const maxProblem =
    MAX_CONTENT_LENGTH -
    getFormattedLength('problemSolve', { ...data, problem: '' });
  const maxAttempt =
    MAX_CONTENT_LENGTH -
    getFormattedLength('problemSolve', { ...data, attempt: '' });
  const maxResultPs =
    MAX_CONTENT_LENGTH -
    getFormattedLength('problemSolve', { ...data, result: '' });
  const maxLessonPs =
    MAX_CONTENT_LENGTH -
    getFormattedLength('problemSolve', { ...data, lesson: '' });

  return (
    <div className='flex flex-col gap-[1.25rem]'>
      <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
        <span>내용</span>
        <span className='text-[#DC0000]'>*</span>
      </div>

      {contentError && (
        <p className='font-regular text-[0.875rem] text-[#DC0000]'>
          {contentError}
        </p>
      )}

      <div className='flex flex-col gap-[0.5rem]'>
        <div className='flex flex-col gap-[1.25rem]'>
          {/* 문제 상황 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>문제 상황</span>
            <InputArea
              width='51.25rem'
              placeholder='어떤 상황에서, 어떤 문제가 발생했나요?'
              value={data.problem}
              onChange={(e) =>
                setData({
                  ...data,
                  problem: e.target.value.slice(0, maxProblem),
                })
              }
            />
          </div>

          {/* 해결 시도 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>해결 시도</span>
            <InputArea
              width='51.25rem'
              placeholder='문제를 해결하기 위해 어떤 시도를 해보았나요?'
              value={data.attempt}
              onChange={(e) =>
                setData({
                  ...data,
                  attempt: e.target.value.slice(0, maxAttempt),
                })
              }
            />
          </div>

          {/* 결과 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>결과</span>
            <InputArea
              width='51.25rem'
              placeholder='어떤 결과가 나타났나요?'
              value={data.result}
              onChange={(e) =>
                setData({
                  ...data,
                  result: e.target.value.slice(0, maxResultPs),
                })
              }
            />
          </div>

          {/* 배운 점/계획 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>배운 점/ 계획</span>
            <InputArea
              width='51.25rem'
              placeholder='무엇을 배웠고, 앞으로는 비슷한 상황에서 어떻게 대응할건가요?'
              value={data.lesson}
              onChange={(e) =>
                setData({
                  ...data,
                  lesson: e.target.value.slice(0, maxLessonPs),
                })
              }
            />
          </div>
        </div>

        <span
          className={`text-right ${totalLength >= COUNT_WARN_THRESHOLD ? 'text-[#DC0000]' : ''}`}
        >
          {totalLength}/{MAX_CONTENT_LENGTH}
        </span>
      </div>
    </div>
  );
}

// 학습 템플릿 폼
interface LearningTemplateFormProps {
  data: {
    path: string;
    learned: string;
    plan: string;
  };
  setData: (data: { path: string; learned: string; plan: string }) => void;
  contentError?: string;
}

export function LearningTemplateForm({
  data,
  setData,
  contentError,
}: LearningTemplateFormProps) {
  const totalLength = getFormattedLength('learning', data);
  const maxPath =
    MAX_CONTENT_LENGTH - getFormattedLength('learning', { ...data, path: '' });
  const maxLearned =
    MAX_CONTENT_LENGTH -
    getFormattedLength('learning', { ...data, learned: '' });
  const maxPlan =
    MAX_CONTENT_LENGTH - getFormattedLength('learning', { ...data, plan: '' });

  return (
    <div className='flex flex-col gap-[1.25rem]'>
      <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
        <span>내용</span>
        <span className='text-[#DC0000]'>*</span>
      </div>

      {contentError && (
        <p className='font-regular text-[0.875rem] text-[#DC0000]'>
          {contentError}
        </p>
      )}

      <div className='flex flex-col gap-[0.5rem]'>
        <div className='flex flex-col gap-[1.25rem]'>
          {/* 학습 경로 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>학습 경로</span>
            <InputArea
              width='51.25rem'
              placeholder='어떤 매체를 통해, 무엇을 계기로 학습을 진행했나요?'
              value={data.path}
              onChange={(e) =>
                setData({
                  ...data,
                  path: e.target.value.slice(0, maxPath),
                })
              }
            />
          </div>

          {/* 배운 내용 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>배운 내용</span>
            <InputArea
              width='51.25rem'
              placeholder='어떤 지식 또는 스킬을 배웠나요?'
              value={data.learned}
              onChange={(e) =>
                setData({
                  ...data,
                  learned: e.target.value.slice(0, maxLearned),
                })
              }
            />
          </div>

          {/* 적용 계획 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>적용 계획</span>
            <InputArea
              width='51.25rem'
              placeholder='앞으로 어디에, 어떻게 적용해 볼 건가요?'
              value={data.plan}
              onChange={(e) =>
                setData({
                  ...data,
                  plan: e.target.value.slice(0, maxPlan),
                })
              }
            />
          </div>
        </div>

        <span
          className={`text-right ${totalLength >= COUNT_WARN_THRESHOLD ? 'text-[#DC0000]' : ''}`}
        >
          {totalLength}/{MAX_CONTENT_LENGTH}
        </span>
      </div>
    </div>
  );
}

// 레퍼런스 템플릿 폼
interface ReferenceTemplateFormProps {
  data: {
    source: string;
    content: string;
    thought: string;
    plan: string;
  };
  setData: (data: {
    source: string;
    content: string;
    thought: string;
    plan: string;
  }) => void;
  contentError?: string;
}

export function ReferenceTemplateForm({
  data,
  setData,
  contentError,
}: ReferenceTemplateFormProps) {
  const totalLength = getFormattedLength('reference', data);
  const maxSource =
    MAX_CONTENT_LENGTH -
    getFormattedLength('reference', { ...data, source: '' });
  const maxContentRef =
    MAX_CONTENT_LENGTH -
    getFormattedLength('reference', { ...data, content: '' });
  const maxThought =
    MAX_CONTENT_LENGTH -
    getFormattedLength('reference', { ...data, thought: '' });
  const maxPlanRef =
    MAX_CONTENT_LENGTH - getFormattedLength('reference', { ...data, plan: '' });

  return (
    <div className='flex flex-col gap-[1.25rem]'>
      <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
        <span>내용</span>
        <span className='text-[#DC0000]'>*</span>
      </div>

      {contentError && (
        <p className='font-regular text-[0.875rem] text-[#DC0000]'>
          {contentError}
        </p>
      )}

      <div className='flex flex-col gap-[0.5rem]'>
        <div className='flex flex-col gap-[1.25rem]'>
          {/* 출처 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>출처</span>
            <InputArea
              width='51.25rem'
              placeholder='어디서 얻은 레퍼런스인가요?'
              value={data.source}
              onChange={(e) =>
                setData({
                  ...data,
                  source: e.target.value.slice(0, maxSource),
                })
              }
            />
          </div>

          {/* 내용 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>내용</span>
            <InputArea
              width='51.25rem'
              placeholder='어떤 점이 인상 깊었나요?'
              value={data.content}
              onChange={(e) =>
                setData({
                  ...data,
                  content: e.target.value.slice(0, maxContentRef),
                })
              }
            />
          </div>

          {/* 나의 생각 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>나의 생각</span>
            <InputArea
              width='51.25rem'
              placeholder='이 레퍼런스를 보고 어떤 생각이 들었나요?'
              value={data.thought}
              onChange={(e) =>
                setData({
                  ...data,
                  thought: e.target.value.slice(0, maxThought),
                })
              }
            />
          </div>

          {/* 적용 계획 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>적용 계획</span>
            <InputArea
              width='51.25rem'
              placeholder='앞으로 어디에, 어떻게 적용해 볼 건가요?'
              value={data.plan}
              onChange={(e) =>
                setData({
                  ...data,
                  plan: e.target.value.slice(0, maxPlanRef),
                })
              }
            />
          </div>
        </div>

        <span
          className={`text-right ${totalLength >= COUNT_WARN_THRESHOLD ? 'text-[#DC0000]' : ''}`}
        >
          {totalLength}/{MAX_CONTENT_LENGTH}
        </span>
      </div>
    </div>
  );
}
