'use client';

import { useState } from 'react';
import InputArea from '@/components/InputArea';
import TextField from '@/components/TextField';

// 템플릿 미사용 폼
export function NoTemplateForm() {
  const [content, setContent] = useState('');

  return (
    <div className='flex flex-col gap-[0.5rem]'>
      <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
        <span>내용</span>
        <span className='text-[#DC0000]'>*</span>
      </div>

      <div className='flex flex-col'>
        <TextField
          variant='wide'
          height='13.75rem'
          placeholder='오늘은 어떤 인사이트를 얻으셨나요?'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <span className='mt-[0.5rem] text-right'>{content.length}/250</span>
      </div>
    </div>
  );
}

// 대인관계 템플릿 폼
export function InterpersonTemplateForm() {
  const [situation, setSituation] = useState('');
  const [response, setResponse] = useState('');
  const [result, setResult] = useState('');
  const [lesson, setLesson] = useState('');

  const totalLength =
    situation.length + response.length + result.length + lesson.length;

  return (
    <div className='flex flex-col gap-[1.25rem]'>
      <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
        <span>내용</span>
        <span className='text-[#DC0000]'>*</span>
      </div>

      <div className='flex flex-col gap-[0.5rem]'>
        <div className='flex flex-col gap-[1.25rem]'>
          {/* 상황/대상 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>상황/대상</span>
            <input
              className='line-height-[150%] w-[51.25rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
              placeholder='누구와, 어떤 상황이 발생했나요?'
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
            />
          </div>

          {/* 대응 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>대응</span>
            <input
              className='line-height-[150%] w-[51.25rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
              placeholder='나는 어떻게 대응했나요?'
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
          </div>

          {/* 결과 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>결과</span>
            <input
              className='line-height-[150%] w-[51.25rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
              placeholder='어떤 결과가 나타났나요?'
              value={result}
              onChange={(e) => setResult(e.target.value)}
            />
          </div>

          {/* 배운 점/계획 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>배운 점/계획</span>
            <input
              className='line-height-[150%] w-[51.25rem] rounded-[0.5rem] border border-[#74777D] px-[1.25rem] py-[0.75rem]'
              placeholder='무엇을 배웠고, 앞으로는 비슷한 상황에서 어떻게 대응할건가요?'
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
            />
          </div>
        </div>

        <span className='text-right'>{totalLength}/250</span>
      </div>
    </div>
  );
}

// 문제해결 템플릿 폼
export function ProblemSolveTemplateForm() {
  const [problem, setProblem] = useState('');
  const [attempt, setAttempt] = useState('');
  const [result, setResult] = useState('');
  const [lesson, setLesson] = useState('');

  const totalLength =
    problem.length + attempt.length + result.length + lesson.length;

  return (
    <div className='flex flex-col gap-[1.25rem]'>
      <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
        <span>내용</span>
        <span className='text-[#DC0000]'>*</span>
      </div>

      <div className='flex flex-col gap-[0.5rem]'>
        <div className='flex flex-col gap-[1.25rem]'>
          {/* 문제 상황 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>문제 상황</span>
            <InputArea
              width='51.25rem'
              placeholder='어떤 상황에서, 어떤 문제가 발생했나요?'
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            />
          </div>

          {/* 해결 시도 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>해결 시도</span>
            <InputArea
              width='51.25rem'
              placeholder='문제를 해결하기 위해 어떤 시도를 해보았나요?'
              value={attempt}
              onChange={(e) => setAttempt(e.target.value)}
            />
          </div>

          {/* 결과 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>결과</span>
            <InputArea
              width='51.25rem'
              placeholder='어떤 결과가 나타났나요?'
              value={result}
              onChange={(e) => setResult(e.target.value)}
            />
          </div>

          {/* 배운 점/계획 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>배운 점/계획</span>
            <InputArea
              width='51.25rem'
              placeholder='무엇을 배웠고, 앞으로는 비슷한 상황에서 어떻게 대응할건가요?'
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
            />
          </div>
        </div>

        <span className='text-right'>{totalLength}/250</span>
      </div>
    </div>
  );
}

// 학습 템플릿 폼
export function LearningTemplateForm() {
  const [path, setPath] = useState('');
  const [learned, setLearned] = useState('');
  const [plan, setPlan] = useState('');

  const totalLength = path.length + learned.length + plan.length;

  return (
    <div className='flex flex-col gap-[1.25rem]'>
      <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
        <span>내용</span>
        <span className='text-[#DC0000]'>*</span>
      </div>

      <div className='flex flex-col gap-[0.5rem]'>
        <div className='flex flex-col gap-[1.25rem]'>
          {/* 학습 경로 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>학습 경로</span>
            <InputArea
              width='51.25rem'
              placeholder='어떤 매체를 통해, 무엇을 계기로 학습을 진행했나요?'
              value={path}
              onChange={(e) => setPath(e.target.value)}
            />
          </div>

          {/* 배운 내용 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>배운 내용</span>
            <InputArea
              width='51.25rem'
              placeholder='어떤 지식 또는 스킬을 배웠나요?'
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
            />
          </div>

          {/* 적용 계획 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>적용 계획</span>
            <InputArea
              width='51.25rem'
              placeholder='앞으로 어디에, 어떻게 적용해 볼 건가요?'
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            />
          </div>
        </div>

        <span className='text-right'>{totalLength}/250</span>
      </div>
    </div>
  );
}

// 레퍼런스 템플릿 폼
export function ReferenceTemplateForm() {
  const [source, setSource] = useState('');
  const [content, setContent] = useState('');
  const [thought, setThought] = useState('');
  const [plan, setPlan] = useState('');

  const totalLength =
    source.length + content.length + thought.length + plan.length;

  return (
    <div className='flex flex-col gap-[1.25rem]'>
      <div className='flex items-center gap-[0.25rem] text-[1.125rem] font-bold'>
        <span>내용</span>
        <span className='text-[#DC0000]'>*</span>
      </div>

      <div className='flex flex-col gap-[0.5rem]'>
        <div className='flex flex-col gap-[1.25rem]'>
          {/* 출처 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>출처</span>
            <InputArea
              width='51.25rem'
              placeholder='어디서 얻은 레퍼런스인가요?'
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>

          {/* 내용 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>내용</span>
            <InputArea
              width='51.25rem'
              placeholder='어떤 점이 인상 깊었나요?'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* 나의 생각 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>나의 생각</span>
            <InputArea
              width='51.25rem'
              placeholder='이 레퍼런스를 보고 어떤 생각이 들었나요?'
              value={thought}
              onChange={(e) => setThought(e.target.value)}
            />
          </div>

          {/* 적용 계획 */}
          <div className='flex items-center justify-between'>
            <span className='text-[1rem] text-[#1A1A1A]'>적용 계획</span>
            <InputArea
              width='51.25rem'
              placeholder='앞으로 어디에, 어떻게 적용해 볼 건가요?'
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            />
          </div>
        </div>

        <span className='text-right'>{totalLength}/250</span>
      </div>
    </div>
  );
}
