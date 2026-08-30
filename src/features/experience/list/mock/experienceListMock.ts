/**
 * 에이전트 탭(준비 중)에서 쓰는 예시 대화.
 *
 * 그룹·활동·블록 목록은 GET /experience-map 으로 받아오므로 더 이상 목 데이터를 두지 않는다.
 */
export type MockAgentMessage = {
  id: string;
  role: 'user' | 'ai';
  content: string;
};

export const MOCK_AGENT_MESSAGES: MockAgentMessage[] = [
  {
    id: 'm1',
    role: 'user',
    content: '이 경험의 핵심 성과를 한 줄로 정리해줘.',
  },
  {
    id: 'm2',
    role: 'ai',
    content:
      '교내 전공서적 거래 플랫폼을 리뉴얼해 DAU 150% 증가와 거래 성사율 65% 달성을 이끈 PM·UX 기획 경험입니다.',
  },
];
