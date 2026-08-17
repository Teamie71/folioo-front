'use client';

import { BaseEdge, type EdgeProps } from '@xyflow/react';

type MapElbowEdgeData = {
  branchX?: number;
};

/**
 * 문제해결 계열 팬아웃 전용 직각 연결선.
 *
 * xyflow 내장 'step'/'smoothstep'은 형제 엣지마다 방향 우선순위(수직/수평)를
 * 개별적으로 판정해 경로를 고르는데, 우리는 Handle을 노드 "중앙"에 두면서도
 * position은 Left/Right로 선언해 두었다(중심 to 중심 연결선을 위해).
 * 이 조합에서 내장 알고리즘이 형제 엣지마다 다른 분기를 타면서
 * 트렁크(세로 버스 라인)가 서로 다른 x에 그려져 선이 어긋나 보인다.
 *
 * 같은 부모에서 뻗는 형제 엣지는 항상 "가로 → 세로 → 가로" 순서로만
 * 그리면 되므로, 분기 없이 직접 경로를 계산해 트렁크 x를 강제로 통일한다.
 */
export function MapElbowEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  style,
}: EdgeProps) {
  const branchX = (data as MapElbowEdgeData | undefined)?.branchX;
  const busX = branchX ?? sourceX + (targetX - sourceX) / 2;
  const path = `M${sourceX},${sourceY} L${busX},${sourceY} L${busX},${targetY} L${targetX},${targetY}`;

  return <BaseEdge path={path} style={style} />;
}
