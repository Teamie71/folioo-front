/**
 * 맵 뷰 레이아웃 상수.
 *
 * 화면설계서 Frame 1133 기준:
 * - 모든 블록은 단계별로 좌정렬
 * - 열 간격 60px (단, 1-2단계 사이는 120px)
 * - 행 간격 16px
 * - 3단계 기준 묶음 사이 간격 40px
 * - 연결선은 중심 to 중심
 */

/** 1단계(그룹) → 2단계(활동) 열 간격 */
export const COLUMN_GAP_GROUP_TO_EXPERIENCE = 120;

/** 그 외 모든 열 간격 */
export const COLUMN_GAP = 60;

/** 4-5단계 형제 블록 사이 행 간격 */
export const ROW_GAP = 16;

/** 3단계 묶음(카테고리 서브트리) 사이 간격 */
export const SECTION_GAP = 40;

/**
 * 활동/그룹 서브트리 사이 간격.
 * 배경 영역이 없는 최소화 · 중간 수준에서 쓴다.
 */
export const SUBTREE_GAP = 64;

/**
 * 표준 수준에서 쓰는 서브트리 간격.
 * 활동 배경 영역이 위아래로 넓어지므로 영역끼리 붙지 않도록 더 벌린다.
 */
export const SUBTREE_GAP_WITH_AREA = 96;

/** 블록 박스 테두리 두께 (border-gray3) */
export const BLOCK_BORDER = 1;

/** 블록 박스 좌우 패딩 */
export const BLOCK_PADDING_X = 12;

/** 그룹 · 활동 · 내용 블록의 상하 패딩 */
export const BLOCK_PADDING_Y = 6;

/** 3단계(상세정보 · 주요성과 · 담당업무 · 문제해결 · 배운 점) 상하 패딩 */
export const SECTION_PADDING_Y = 8;

/** caption1 = 14px / line-height 150% */
export const BLOCK_FONT_SIZE = 14;
export const BLOCK_LINE_HEIGHT = 21;

/**
 * 최소 내용 너비.
 * 그룹 · 활동 · 카테고리는 텍스트에 맞춰 줄어들고,
 * 4-5단계 내용 블록만 빈 상태에서도 입력 영역이 보이도록 폭을 확보한다.
 */
export const MIN_CONTENT_WIDTH = 0;
export const MIN_CONTENT_WIDTH_LEAF = 200;

/** 이 너비를 넘으면 줄바꿈한다 */
export const MAX_CONTENT_WIDTH = 620;

/** 활동 배경 영역(#F6F5FF66)의 안쪽 여백 */
export const ACTIVITY_AREA_PADDING = 24;

/**
 * 활동 배경 영역 위쪽 여백.
 * '리스트로 확인하기' 버튼이 블록과 겹치지 않도록 버튼 높이만큼 더 확보한다.
 */
export const ACTIVITY_AREA_PADDING_TOP = 54;

/** 활동 배경 영역 라운드 */
export const ACTIVITY_AREA_RADIUS = 16;

/** 블록 박스 라운드 */
export const BLOCK_RADIUS = 8;

/** 그룹(1단계) · 활동(2단계) 텍스트 최대 길이 */
export const TITLE_MAX_LENGTH = 20;

/** 3-5단계 블록 텍스트 최대 길이 */
export const BLOCK_MAX_LENGTH = 500;

/** 블록 우측 hover/active 컨트롤 영역 */
export const BLOCK_CONTROL_GAP = 8;
export const BLOCK_CONTROL_SIZE = 16;

/**
 * '리스트로 확인하기' 버튼 — 활동 영역 우측 상단에 고정 배치한다.
 * 아이콘 없이 typo-b2 텍스트 + px-12px py-6px 패딩 크기를 어림한 값으로,
 * xyflow 노드 배치(우측 정렬 위치 계산)에만 쓰는 힌트다. 실제 렌더 크기는
 * 버튼 자체의 패딩이 결정한다.
 */
export const LIST_PREVIEW_BUTTON_WIDTH = 160;
export const LIST_PREVIEW_BUTTON_HEIGHT = 36;
export const LIST_PREVIEW_BUTTON_INSET = 12;
