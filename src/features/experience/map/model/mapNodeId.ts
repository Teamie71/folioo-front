/**
 * 맵 뷰 노드 id 규칙.
 *
 * 그룹 · 활동 · 블록의 도메인 id가 서로 겹치지 않도록 prefix를 붙인다.
 * 블록은 활동별로 관리되므로 소속 활동 id까지 포함한다.
 * (도메인 id에는 ':'가 쓰이지 않는다 — factories.uid 참고)
 */

export const groupNodeId = (groupId: string) => `g:${groupId}`;

export const experienceNodeId = (experienceId: string) => `e:${experienceId}`;

export const blockNodeId = (experienceId: string, blockId: string) =>
  `b:${experienceId}:${blockId}`;

export type ParsedMapNodeId =
  | { kind: 'group'; groupId: string }
  | { kind: 'experience'; experienceId: string }
  | { kind: 'block'; experienceId: string; blockId: string };

export function parseMapNodeId(nodeId: string): ParsedMapNodeId | null {
  const [prefix, first, second] = nodeId.split(':');

  if (prefix === 'g' && first) return { kind: 'group', groupId: first };
  if (prefix === 'e' && first) {
    return { kind: 'experience', experienceId: first };
  }
  if (prefix === 'b' && first && second) {
    return { kind: 'block', experienceId: first, blockId: second };
  }
  return null;
}
