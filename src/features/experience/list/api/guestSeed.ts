import { UNCLASSIFIED_NAME } from '@/features/experience/list/constants';
import {
  createExperienceTemplateBlocks,
  uid,
} from '@/features/experience/list/factories';
import type { ListStateFromServer } from '@/features/experience/list/api/experienceMapMapper';

/**
 * 비로그인 사용자에게 보여 주는 기본 제공 데이터.
 *
 * 화면설계서 "초기 생성 데이터":
 *   그룹 '미분류', '새로운 그룹 1' / 활동 '새로운 활동 1'('새로운 그룹 1' 하위, 활동 템플릿 포함)
 * 신규 로그인 사용자에게 서버가 만들어 주는 것과 같은 구성이며,
 * 비로그인일 때는 서버에 저장되지 않고 클라이언트에만 유지된다.
 */
export function createGuestSeed(): ListStateFromServer {
  const unclassifiedId = uid('g');
  const groupId = uid('g');

  return {
    mapVersion: '0',
    groups: [
      { id: unclassifiedId, name: UNCLASSIFIED_NAME, isUnclassified: true },
      { id: groupId, name: '새로운 그룹 1', isUnclassified: false },
    ],
    experiences: [
      {
        id: uid('e'),
        groupId,
        name: '새로운 활동 1',
        blocks: createExperienceTemplateBlocks(),
      },
    ],
  };
}
