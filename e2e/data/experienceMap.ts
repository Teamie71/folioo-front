import type {
  ExperienceMapAiControllerGetActivityStatuses200,
  ExperienceMapControllerGetMap200,
  TemplateControllerGetTemplates200,
  UserControllerGetProfile200,
} from '@/api/models';

const NOW = '2026-01-01T00:00:00.000Z';

/** 로그인 사용자의 기본 맵: 서버가 처음 만들어 주는 미분류 그룹만 있는 상태 */
export const experienceMapDefault: ExperienceMapControllerGetMap200 = {
  isSuccess: true,
  result: {
    mapVersion: '1',
    revertibleRequestId: null,
    roots: [
      {
        id: '1',
        parentId: null,
        kind: 'GROUP_UNCATEGORIZED',
        level: 1,
        position: 0,
        content: '미분류',
        placeholder: null,
        createdAt: NOW,
        updatedAt: NOW,
        children: [],
      },
    ],
  },
};

export const experienceMapEmpty: ExperienceMapControllerGetMap200 = {
  isSuccess: true,
  result: { mapVersion: '1', revertibleRequestId: null, roots: [] },
};

/** 섹션이 비어 있으면 화면은 기본 문구를 쓴다. */
export const templatesEmpty: TemplateControllerGetTemplates200 = {
  isSuccess: true,
  result: { sections: [] },
};

export const userProfile: UserControllerGetProfile200 = {
  isSuccess: true,
  result: {
    name: 'E2E 사용자',
    socialAccounts: [],
    phoneNum: null,
    isMarketingAgreed: false,
  },
};

export const activityStatusesEmpty: ExperienceMapAiControllerGetActivityStatuses200 =
  {
    isSuccess: true,
    result: [],
  };
