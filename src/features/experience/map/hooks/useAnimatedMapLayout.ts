'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { MapDetailLevel } from '@/features/experience/map/model/mapZoom';
import type {
  MapLayout,
  MapLayoutEdge,
  MapLayoutNode,
} from '@/features/experience/map/utils/mapLayout';

type VisualLayout = {
  layout: MapLayout;
  nodeOpacity: Map<string, number>;
  edgeOpacity: Map<string, number>;
};

const DURATION_MS = 180;

function createInterpolator(from: VisualLayout, to: MapLayout) {
  const fromNodes = new Map(from.layout.nodes.map((node) => [node.id, node]));
  const toNodeIds = new Set(to.nodes.map((node) => node.id));
  const fromEdges = new Map(from.layout.edges.map((edge) => [edge.id, edge]));
  const toEdgeIds = new Set(to.edges.map((edge) => edge.id));

  return (progress: number): VisualLayout => {
    const nodeOpacity = new Map<string, number>();
    const nodes: MapLayoutNode[] = to.nodes.map((node) => {
      const previous = fromNodes.get(node.id);
      nodeOpacity.set(
        node.id,
        previous
          ? (from.nodeOpacity.get(node.id) ?? 1) +
              (1 - (from.nodeOpacity.get(node.id) ?? 1)) * progress
          : progress,
      );
      if (!previous) return node;
      return {
        ...node,
        x: previous.x + (node.x - previous.x) * progress,
        y: previous.y + (node.y - previous.y) * progress,
      };
    });
    for (const node of from.layout.nodes) {
      if (toNodeIds.has(node.id)) continue;
      nodes.push(node);
      nodeOpacity.set(
        node.id,
        (from.nodeOpacity.get(node.id) ?? 1) * (1 - progress),
      );
    }

    const edgeOpacity = new Map<string, number>();
    const edges: MapLayoutEdge[] = to.edges.map((edge) => {
      const previous = fromEdges.get(edge.id);
      edgeOpacity.set(
        edge.id,
        previous
          ? (from.edgeOpacity.get(edge.id) ?? 1) +
              (1 - (from.edgeOpacity.get(edge.id) ?? 1)) * progress
          : progress,
      );
      return edge;
    });
    for (const edge of from.layout.edges) {
      if (toEdgeIds.has(edge.id)) continue;
      edges.push(edge);
      edgeOpacity.set(
        edge.id,
        (from.edgeOpacity.get(edge.id) ?? 1) * (1 - progress),
      );
    }

    return {
      layout: { nodes, edges, areas: to.areas },
      nodeOpacity,
      edgeOpacity,
    };
  };
}

/** 표시 수준이 바뀔 때만 위치·연결선·신규 블록을 함께 보간한다. */
export function useAnimatedMapLayout(
  target: MapLayout,
  detail: MapDetailLevel,
  keepWheelAnchor = false,
) {
  const [frame, setFrame] = useState<VisualLayout | null>(null);
  const stable = useMemo<VisualLayout>(
    () => ({ layout: target, nodeOpacity: new Map(), edgeOpacity: new Map() }),
    [target],
  );
  const visualRef = useRef<VisualLayout>({
    layout: target,
    nodeOpacity: new Map(),
    edgeOpacity: new Map(),
  });
  const detailRef = useRef(detail);

  useLayoutEffect(() => {
    const previousDetail = detailRef.current;
    detailRef.current = detail;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    // 표준 수준은 노드 수가 많으므로 프레임마다 React Flow 전체를 갱신하지 않는다.
    if (
      previousDetail === detail ||
      keepWheelAnchor ||
      reducedMotion ||
      previousDetail === 'standard' ||
      detail === 'standard'
    ) {
      visualRef.current = stable;
      setFrame(null);
      return;
    }

    const from = visualRef.current;
    const interpolate = createInterpolator(from, target);
    const startedAt = performance.now();
    let frameId = 0;
    const tick = (now: number) => {
      const linear = Math.min(1, (now - startedAt) / DURATION_MS);
      const eased = 1 - (1 - linear) ** 3;
      const next = interpolate(eased);
      visualRef.current = next;
      setFrame(linear < 1 ? next : null);
      if (linear < 1) frameId = requestAnimationFrame(tick);
      else visualRef.current = stable;
    };
    setFrame(from);
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [detail, keepWheelAnchor, stable, target]);

  return frame ?? stable;
}
