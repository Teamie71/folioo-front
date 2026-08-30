import { BlockResDTOKind } from '@/api/models';
import type { CreateBlockReqDTOKind } from '@/api/models';
import type { SectionKind } from '@/features/experience/list/types';

/**
 * 서버 블록 종류 ↔ 클라이언트 SectionKind 매핑.
 *
 * 서버는 트리 전체를 하나의 block 테이블로 다루고 종류를 kind로 구분한다.
 * (1단계 GROUP_UNCATEGORIZED/GROUP, 2단계 EXPERIENCE, 3단계 SECTION_* 또는 CONTENT,
 *  4~5단계 CONTENT)
 * 클라이언트는 그룹/활동/블록을 분리한 모델을 쓰므로 3단계 이하만 SectionKind로 옮긴다.
 */
export const SECTION_KIND_BY_DTO: Record<string, SectionKind> = {
  [BlockResDTOKind.SECTION_DETAIL]: 'detail',
  [BlockResDTOKind.SECTION_ACHIEVEMENT]: 'achievement',
  [BlockResDTOKind.SECTION_TASK]: 'duty',
  [BlockResDTOKind.SECTION_PROBLEM_SOLVING]: 'problem',
  [BlockResDTOKind.SECTION_LEARNING]: 'learning',
  [BlockResDTOKind.CONTENT]: 'free',
};

export const DTO_KIND_BY_SECTION: Record<
  Exclude<SectionKind, 'free'>,
  CreateBlockReqDTOKind
> = {
  detail: BlockResDTOKind.SECTION_DETAIL,
  achievement: BlockResDTOKind.SECTION_ACHIEVEMENT,
  duty: BlockResDTOKind.SECTION_TASK,
  problem: BlockResDTOKind.SECTION_PROBLEM_SOLVING,
  learning: BlockResDTOKind.SECTION_LEARNING,
};

/** 고정 섹션(상세정보/주요성과/담당업무/문제해결/배운 점)은 제목을 수정할 수 없다. */
export function isFixedSectionDtoKind(kind: string): boolean {
  return kind.startsWith('SECTION_');
}

/**
 * 서버 요청의 content 타입 캐스팅.
 *
 * OpenAPI 문서상 요청 DTO의 content가 `type: object`로 선언돼 있어 orval이
 * `{ [key: string]: unknown } | null`로 생성했지만, 응답(BlockResDTO)의 content는
 * `string | null`이고 문서의 maxLength: 500 역시 문자열 기준이다.
 * 실제로는 문자열을 주고받으므로 여기서 한 번만 캐스팅한다.
 * (백엔드 스펙이 고쳐지면 이 함수만 지우면 된다)
 */
export function toContentPayload<T>(text: string | null): T {
  return text as unknown as T;
}
