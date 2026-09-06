export const WORKSPACE_PATH = '/experience/workspace';

export const WORKSPACE_VIEWS = ['list', 'map'] as const;

export type WorkspaceView = (typeof WORKSPACE_VIEWS)[number];

/**
 * 임시 조치: 맵 뷰 토글을 내리고 리스트 뷰만 지원한다. (원래 값은 'map')
 * 맵 뷰를 되살릴 때는 이 값을 'map'으로 되돌리고, 아래 parseWorkspaceView의
 * 임시 고정 return도 함께 원래 로직으로 되돌리면 된다.
 */
export const DEFAULT_WORKSPACE_VIEW: WorkspaceView = 'list';

export const WORKSPACE_VIEW_PARAM = 'view';

export function isWorkspaceView(value: unknown): value is WorkspaceView {
  return WORKSPACE_VIEWS.includes(value as WorkspaceView);
}

/** URL의 view 파라미터를 안전하게 해석한다. 값이 없거나 잘못되면 기본값(list). */
export function parseWorkspaceView(
  raw: string | null | undefined,
): WorkspaceView {
  // 임시 조치: 맵 뷰 비활성화 기간에는 URL에 ?view=map 이 있어도 항상 list로 고정한다.
  // 복구 시 아래 return을 지우고 주석 처리된 원래 로직으로 되돌리면 된다.
  return 'list';
  // return isWorkspaceView(raw) ? raw : DEFAULT_WORKSPACE_VIEW;
}

/** 서버/링크에서 사용할 워크스페이스 URL을 만든다. */
export function buildWorkspaceHref(
  view: WorkspaceView = DEFAULT_WORKSPACE_VIEW,
): string {
  return `${WORKSPACE_PATH}?${WORKSPACE_VIEW_PARAM}=${view}`;
}

/**
 * 앱 내부 이동에서 사용할 표준 워크스페이스 URL.
 * 내부 링크는 /experience 를 거치지 말고 이 값을 직접 사용한다.
 * (/experience, /experience/list 는 외부 북마크 호환용으로만 남긴다)
 */
export const CANONICAL_WORKSPACE_HREF = buildWorkspaceHref(
  DEFAULT_WORKSPACE_VIEW,
);

/** 내비게이션 활성 상태 판정용 경로. href에는 query가 붙으므로 분리해서 쓴다. */
export const EXPERIENCE_ACTIVE_PATH = '/experience';
