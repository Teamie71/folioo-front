import type {
  InterestQuestion,
  RecommendationMajorOption,
  ValueQuestion,
} from '@/features/recommendation/types';

export const MOCK_RECOMMENDATION_MAJORS: RecommendationMajorOption[] = [
  { id: 'humanities-social', label: '인문·사회' },
  { id: 'language', label: '어문' },
  { id: 'business', label: '경영' },
  { id: 'economics', label: '경제' },
  { id: 'media-communication', label: '미디어커뮤니케이션' },
  { id: 'natural-science', label: '자연과학' },
  { id: 'math-stats', label: '수리·통계' },
  { id: 'engineering', label: '공학계열' },
  { id: 'computer-science', label: '컴퓨터공학' },
  { id: 'art-design', label: '예술·디자인' },
  { id: 'other', label: '기타' },
  { id: 'any', label: '전공과 관계없이 찾기' },
];

export const MOCK_INTEREST_QUESTIONS: InterestQuestion[] = [
  {
    id: 'interest-1',
    text: '누군가에게 도움이 되는 일을 할 때 보람을 느낀다.',
  },
  {
    id: 'interest-2',
    text: '바로 답을 찾기보다 가설을 세우고 검증해 보는 편이다.',
  },
  {
    id: 'interest-3',
    text: '무언가를 만들거나 고쳐서 눈에 보이는 결과를 내는 일에 흥미가 있다.',
  },
  {
    id: 'interest-4',
    text: '목표를 세우고 사람들을 이끌어 결과를 만드는 일이 재미있다.',
  },
  {
    id: 'interest-5',
    text: '글, 이미지, 영상 등으로 생각과 감정을 표현하는 활동을 즐긴다.',
  },
  {
    id: 'interest-6',
    text: '정해진 절차와 기준에 따라 일을 체계적으로 처리할 때 만족스럽다.',
  },
  {
    id: 'interest-7',
    text: '자료나 데이터를 살펴보며 원인과 규칙을 찾아내는 과정이 재미있다.',
  },
  {
    id: 'interest-8',
    text: '기존 방식보다 나만의 아이디어와 표현으로 결과물을 만들고 싶다.',
  },
  {
    id: 'interest-9',
    text: '일의 세세한 부분까지 빠짐없이 정리해야 마음이 편하다.',
  },
  {
    id: 'interest-10',
    text: '내 아이디어에 사람들을 설득해 실행으로 옮기는 일이 흥미롭다.',
  },
  {
    id: 'interest-11',
    text: '다른 사람의 고민을 듣고 해결 방법을 함께 찾는 데 관심이 있다.',
  },
  {
    id: 'interest-12',
    text: '직접 기계나 장비를 다루며 문제를 해결하는 일이 즐겁다.',
  },
  {
    id: 'interest-13',
    text: '방향을 정해 일을 주도하기보다, 여러 가능성을 따져 이유를 밝혀내는 데 더 몰입한다.',
  },
  {
    id: 'interest-14',
    text: '고객 또는 팀과 대화하며 신뢰를 쌓는 업무보다 제품을 만들고 다루는 작업이 재미있다.',
  },
  {
    id: 'interest-15',
    text: '정확성과 일관성을 지키는 것보다 새로움과 개성을 더하는 쪽에 더 몰입한다.',
  },
];

export const MOCK_VALUE_QUESTIONS: ValueQuestion[] = [
  {
    id: 'value-1',
    left: '초봉이 평균의 1.5배지만,\n매일 야근하고 주말에도 연락을 받아요.',
    right:
      '매일 18시에 퇴근하고 주말은 온전히 쉴 수 있지만, 초봉은 평균의 0.8배예요.',
  },
  {
    id: 'value-2',
    left: '2번질문',
    right:
      '테스트용',
  },
];
