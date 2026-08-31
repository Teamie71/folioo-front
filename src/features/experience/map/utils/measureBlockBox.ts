import {
  BLOCK_BORDER,
  BLOCK_FONT_SIZE,
  BLOCK_LINE_HEIGHT,
  BLOCK_PADDING_X,
  BLOCK_PADDING_Y,
  MAX_CONTENT_WIDTH,
  MIN_CONTENT_WIDTH,
  SECTION_PADDING_Y,
} from '@/features/experience/map/constants';

/**
 * 맵 뷰는 xyflow에 좌표를 넘기기 전에 각 블록의 크기를 알아야 한다.
 * DOM 렌더 이후 측정하면 2패스가 되므로, canvas measureText로 미리 계산한다.
 */

let ctx: CanvasRenderingContext2D | null = null;
let ctxFont = '';

const widthCache = new Map<string, number>();

function resolveFontFamily(): string {
  if (typeof window === 'undefined') return 'sans-serif';
  const family = window
    .getComputedStyle(document.body)
    .getPropertyValue('font-family');
  return family || 'sans-serif';
}

function getCtx(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null;
  if (!ctx) {
    ctx = document.createElement('canvas').getContext('2d');
  }
  if (!ctx) return null;

  const font = `400 ${BLOCK_FONT_SIZE}px ${resolveFontFamily()}`;
  if (font !== ctxFont) {
    ctx.font = font;
    ctxFont = font;
    widthCache.clear();
  }
  return ctx;
}

/** 폰트 로딩이 끝나면 캐시를 비워 재측정하도록 한다. */
export function resetMeasureCache() {
  widthCache.clear();
  ctxFont = '';
}

/** 캐시를 거치지 않는 실측. 한 번만 쓰고 버릴 문자열에 쓴다. */
function measureRaw(text: string): number {
  const c = getCtx();
  // canvas를 못 쓰는 환경(SSR 등)에서는 한글 기준 근사치로 대체한다.
  return c ? c.measureText(text).width : text.length * BLOCK_FONT_SIZE * 0.95;
}

function textWidth(text: string): number {
  if (!text) return 0;
  const cached = widthCache.get(text);
  if (cached != null) return cached;

  const width = measureRaw(text);
  widthCache.set(text, width);
  return width;
}

/**
 * MAX_CONTENT_WIDTH를 넘는 텍스트가 몇 줄로 접히는지 센다.
 * CSS의 overflow-wrap: anywhere와 동일하게 글자 단위로 끊는다.
 *
 * 한 글자씩 늘려 가며 재기 때문에 여기서 만들어지는 중간 문자열은 다시 쓸 일이 없다.
 * 기존 산출물에서 옮겨 온 긴 본문이 많으면 그 접두사가 전부 캐시에 쌓이므로
 * 이 안에서는 캐시를 쓰지 않는다.
 */
function countLines(text: string, maxWidth: number): number {
  const paragraphs = text.split('\n');
  let lines = 0;

  for (const paragraph of paragraphs) {
    if (!paragraph) {
      lines += 1;
      continue;
    }

    let current = '';
    let paragraphLines = 1;

    for (const char of paragraph) {
      const next = current + char;
      if (measureRaw(next) > maxWidth && current) {
        paragraphLines += 1;
        current = char;
      } else {
        current = next;
      }
    }
    lines += paragraphLines;
  }

  return Math.max(lines, 1);
}

export type BlockBoxSize = { width: number; height: number };

/**
 * 블록 박스의 크기를 계산한다.
 * 텍스트가 비어 있으면 placeholder가 보이므로 placeholder 기준으로 잰다.
 */
export function measureBlockBox(
  text: string,
  {
    isSection = false,
    minWidth = MIN_CONTENT_WIDTH,
  }: { isSection?: boolean; minWidth?: number } = {},
): BlockBoxSize {
  const paddingY = isSection ? SECTION_PADDING_Y : BLOCK_PADDING_Y;
  const raw = textWidth(text);

  const contentWidth = Math.min(Math.max(raw, minWidth), MAX_CONTENT_WIDTH);

  const lines =
    raw > MAX_CONTENT_WIDTH || text.includes('\n')
      ? countLines(text, MAX_CONTENT_WIDTH)
      : 1;

  // box-border라 1px 테두리가 내용 폭을 잠식한다. 측정값에 미리 더해 줄바꿈을 막는다.
  return {
    width: Math.ceil(contentWidth) + BLOCK_PADDING_X * 2 + BLOCK_BORDER * 2 + 1,
    height: lines * BLOCK_LINE_HEIGHT + paddingY * 2 + BLOCK_BORDER * 2,
  };
}
