import type { Experience, Group } from '@/features/experience/list/types';
import {
  createExperienceTemplateBlocks,
  createFreeBlock,
  createSectionBlock,
  uid,
} from '@/features/experience/list/factories';

export const MOCK_GROUPS: Group[] = [
  { id: 'g_2026', name: '2026', isUnclassified: false },
  { id: 'g_2025', name: '2025', isUnclassified: false },
  { id: 'unclassified', name: '미분류', isUnclassified: true },
];

export const MOCK_EXPERIENCES: Experience[] = [
  {
    id: 'e_1',
    groupId: 'g_2026',
    name: '새로운 활동 1',
    blocks: [
      createSectionBlock('detail', [
        createFreeBlock('진행 기간: 2023.09 ~ 2023.12 (4개월)'),
        createFreeBlock(
          '프로젝트 배경 및 목적: 교내 커뮤니티의 비효율적인 게시판형 거래 방식을 개선하고, 전공 서적 거래의 편의성과 신뢰도를 높이기 위한 전용 플랫폼 기획 및 앱 리뉴얼',
        ),
        createFreeBlock(
          '프로젝트 범위 및 구성: 기획/디자인 2명, 개발 2명 (총 4인 팀) / 본인 역할: PM 및 UX 기획',
        ),
        createFreeBlock(
          '대상 및 타깃: 비싼 전공 서적 가격에 부담을 느끼며, 교내 직거래를 통해 택배비 절약과 빠른 거래를 원하는 대학생',
        ),
        createFreeBlock(
          '주요 기술, 방법론 및 툴: Figma, Notion, Slack, Google Analytics, IDI(심층 인터뷰), Usability Test',
        ),
      ]),
      createSectionBlock('achievement', [
        createFreeBlock('리뉴얼 전 대비 DAU(일간 활성 사용자) 150% 증가'),
        createFreeBlock('거래 성사율 20% → 65%로 상승'),
        createFreeBlock('교내 창업 경진대회 대상 수상'),
        createFreeBlock(
          '"검색부터 구매 약속까지 과정이 직관적이다"라는 사용자 피드백 다수 확보',
        ),
      ]),
      createSectionBlock('duty', [
        {
          id: uid(),
          kind: 'free',
          text: '사용자 리서치 및 문제 정의',
          editable: true,
          children: [
            createFreeBlock(
              '기존 커뮤니티 이용자 20명 대상 심층 인터뷰를 통해 핵심 이탈 요인 도출',
            ),
            createFreeBlock(
              '판매자와 구매자의 행동 패턴을 분석한 데이터 기반 페르소나 수립 및 여정 지도 설계',
            ),
          ],
        },
        {
          id: uid(),
          kind: 'free',
          text: '서비스 기획 및 UX 설계',
          editable: true,
          children: [
            createFreeBlock(
              '거래 절차를 기존 5단계에서 3단계(검색-채팅-거래)로 단축하는 와이어프레임 및 스토리보드 작성',
            ),
            createFreeBlock(
              "불필요한 채팅 소요를 줄이기 위해 시스템이 가격을 자동 수락하는 '스마트 오퍼' 기능 기획",
            ),
          ],
        },
      ]),
      createSectionBlock('problem', [
        {
          id: uid(),
          kind: 'problem',
          text: '기존 커뮤니티 거래의 낮은 성사율을 UX 개선으로 끌어올린 경험',
          editable: true,
          children: [
            createFreeBlock(
              '게시판형 거래는 탐색·협상 비용이 커 이탈이 잦았고, 전용 플로우가 필요했다.',
            ),
            createFreeBlock(
              '심층 인터뷰와 여정 분석으로 핵심 이탈 구간을 파악했다.',
            ),
            createFreeBlock(
              '검색-채팅-거래 3단계로 단축하고 스마트 오퍼를 기획·검증했다.',
            ),
            createFreeBlock(
              '거래 성사율 65%·DAU 150% 증가로 효과를 확인하고 PM 역량을 키웠다.',
            ),
          ],
        },
      ]),
      createSectionBlock('learning', [
        createFreeBlock(
          "화려한 기능보다는 '핵심 가치'에 집중하여 개발 리소스를 조율하는 PM의 일정 관리 역량과 커뮤니케이션 스킬이 성장",
        ),
        createFreeBlock(
          '이번 프로젝트에서는 구글 애널리틱스를 기초적으로만 활용했지만, 향후에는 SQL을 학습하여 직접 DB에서 데이터를 추출하고 더 정교하게 사용자 행동 데이터를 분석해보기',
        ),
      ]),
    ],
  },
  {
    id: 'e_2',
    groupId: 'g_2026',
    name: '새로운 활동 2',
    blocks: createExperienceTemplateBlocks(),
  },
  {
    id: 'e_3',
    groupId: 'g_2026',
    name: '새로운 활동 3',
    blocks: [],
  },
  {
    id: 'e_4',
    groupId: 'g_2026',
    name: '새로운 활동 4',
    blocks: createExperienceTemplateBlocks(),
  },
];

export const MOCK_GROUP_COUNTER = 0;
export const MOCK_EXPERIENCE_COUNTER = 4;

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

export function getExperienceListSeed() {
  return {
    groups: structuredClone(MOCK_GROUPS),
    experiences: structuredClone(MOCK_EXPERIENCES),
    groupCounter: MOCK_GROUP_COUNTER,
    experienceCounter: MOCK_EXPERIENCE_COUNTER,
  };
}
