'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  PanOnScrollMode,
  ReactFlow,
  ReactFlowProvider,
  useNodesInitialized,
  useReactFlow,
  type CoordinateExtent,
  type Edge,
  type Node,
  type OnMove,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useExperienceListStore } from '@/store/useExperienceListStore';
import {
  LIST_PREVIEW_BUTTON_HEIGHT,
  LIST_PREVIEW_BUTTON_INSET,
  LIST_PREVIEW_BUTTON_WIDTH,
} from '@/features/experience/map/constants';
import {
  DEFAULT_DETAIL,
  FOCUS_ZOOM,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM,
  detailForZoom,
  maxVisibleLevel,
  type MapDetailLevel,
} from '@/features/experience/map/model/mapZoom';
import {
  buildMapLayout,
  type MapLayout,
  type MapLayoutArea,
  type MapLayoutNode,
} from '@/features/experience/map/utils/mapLayout';
import { resetMeasureCache } from '@/features/experience/map/utils/measureBlockBox';
import { MapActivityAreas } from '@/features/experience/map/components/MapActivityAreas';
import { MapActivityPreviewModal } from '@/features/experience/map/components/MapActivityPreviewModal';
import { MapBlockNode } from '@/features/experience/map/components/MapBlockNode';
import { MapDropIndicator } from '@/features/experience/map/components/MapDropIndicator';
import { MapElbowEdge } from '@/features/experience/map/components/MapElbowEdge';
import { MapListPreviewNode } from '@/features/experience/map/components/MapListPreviewNode';
import { MapZoomController } from '@/features/experience/map/components/MapZoomController';
import { MapInteractionProvider } from '@/features/experience/map/components/MapInteractionContext';
import { useMapBlockDrag } from '@/features/experience/map/hooks/useMapBlockDrag';
import { useAnimatedMapLayout } from '@/features/experience/map/hooks/useAnimatedMapLayout';
import { experienceNodeId } from '@/features/experience/map/model/mapNodeId';
import { collectSelectionIds } from '@/features/experience/map/utils/mapSelection';

const nodeTypes = {
  mapBlock: MapBlockNode,
  listPreview: MapListPreviewNode,
};

const edgeTypes = {
  elbow: MapElbowEdge,
};

const EDGE_STYLE = { stroke: '#9EA4A9', strokeWidth: 1 };
const PRO_OPTIONS = { hideAttribution: true };

const EMPTY_AREAS: MapLayoutArea[] = [];

const FIT_VIEW_OPTIONS = {
  padding: 0.2,
  maxZoom: 0.49,
};
// 25%에서도 화면 한 폭 이상을 자유롭게 이동할 수 있도록 넓은 여백을 둔다.
const PAN_BOUNDARY_MARGIN = 3000;
const PAN_SCROLL_SPEED = 0.5;
const WHEEL_ZOOM_SENSITIVITY = 0.06;
const MAX_WHEEL_ZOOM_DELTA = 0.04;

function layoutShiftAtPoint(
  from: MapLayout,
  to: MapLayout,
  x: number,
  y: number,
) {
  const nextNodes = new Map(to.nodes.map((node) => [node.id, node]));
  let closest: { x: number; y: number; distance: number } | null = null;
  for (const node of from.nodes) {
    const next = nextNodes.get(node.id);
    if (!next) continue;
    const dx = Math.max(node.x - x, 0, x - node.x - node.width);
    const dy = Math.max(node.y - y, 0, y - node.y - node.height);
    const distance = dx * dx + dy * dy;
    if (!closest || distance < closest.distance) {
      closest = {
        x: next.x - node.x,
        y: next.y - node.y,
        distance,
      };
    }
  }
  return closest ?? { x: 0, y: 0 };
}

type CanvasProps = {
  /** 진입 직후 화면 중앙에 두고 표준 수준으로 확대할 활동 id. (모바일 진입용) */
  focusExperienceId?: string;
};

function ExperienceMapCanvasInner({ focusExperienceId }: CanvasProps) {
  const groups = useExperienceListStore((s) => s.groups);
  const experiences = useExperienceListStore((s) => s.experiences);
  const blockSelectionMode = useExperienceListStore(
    (s) => s.blockSelectionMode,
  );
  const selectedBlockIds = useExperienceListStore((s) => s.selectedBlockIds);
  const setBlockSelection = useExperienceListStore((s) => s.setBlockSelection);
  const selectExperience = useExperienceListStore((s) => s.selectExperience);

  const { setCenter, fitView, getViewport, setViewport } = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  const mapViewportRef = useRef<HTMLDivElement>(null);
  const didFitRef = useRef(false);

  const [detail, setDetail] = useState<MapDetailLevel>(DEFAULT_DETAIL);
  const [standardBoundary, setStandardBoundary] = useState(false);
  const [wheelBoundaryAt, setWheelBoundaryAt] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fontVersion, setFontVersion] = useState(0);

  useEffect(() => {
    if (!standardBoundary) return;
    const timer = window.setTimeout(() => setStandardBoundary(false), 200);
    return () => window.clearTimeout(timer);
  }, [detail, standardBoundary]);

  useEffect(() => {
    if (!wheelBoundaryAt) return;
    const timer = window.setTimeout(() => setWheelBoundaryAt(0), 200);
    return () => window.clearTimeout(timer);
  }, [wheelBoundaryAt]);

  // 폰트가 늦게 로드되면 canvas 측정값이 달라지므로 한 번 다시 계산한다.
  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts) return;
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      resetMeasureCache();
      setFontVersion((v) => v + 1);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // 터치 기기에서는 스크롤 팬(트랙패드용) 대신 한 손가락 드래그 팬을 쓴다.
  const isCoarsePointer = useMemo(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches,
    [],
  );

  const layoutCache = useMemo(
    () => new Map<MapDetailLevel, MapLayout>(),
    // 폰트 또는 데이터가 바뀌면 세 표시 수준의 캐시를 모두 무효화한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groups, experiences, fontVersion],
  );
  const getLayout = useCallback(
    (level: MapDetailLevel) => {
      let next = layoutCache.get(level);
      if (!next) {
        next = buildMapLayout(groups, experiences, maxVisibleLevel(level));
        layoutCache.set(level, next);
      }
      return next;
    },
    [groups, experiences, layoutCache],
  );
  const layout = useMemo(() => getLayout(detail), [detail, getLayout]);

  useEffect(() => {
    const container = mapViewportRef.current;
    if (!container) return;
    const isMac = /Mac/.test(navigator.userAgent);
    const onWheel = (event: WheelEvent) => {
      if (
        (!event.ctrlKey && !event.metaKey) ||
        !(event.target instanceof Element)
      )
        return;
      if (
        !event.target.closest('.react-flow') ||
        event.target.closest('.nowheel')
      )
        return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const { x, y, zoom } = getViewport();
      const deltaUnit =
        event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002;
      const delta = -event.deltaY * deltaUnit * (isMac ? 10 : 1);
      const zoomDelta = Math.max(
        -MAX_WHEEL_ZOOM_DELTA,
        Math.min(MAX_WHEEL_ZOOM_DELTA, delta * WHEEL_ZOOM_SENSITIVITY),
      );
      const nextZoom = Math.min(
        MAP_MAX_ZOOM,
        Math.max(MAP_MIN_ZOOM, zoom * 2 ** zoomDelta),
      );
      if (nextZoom === zoom) return;

      const bounds = container.getBoundingClientRect();
      const pointerX = event.clientX - bounds.left;
      const pointerY = event.clientY - bounds.top;
      let flowX = (pointerX - x) / zoom;
      let flowY = (pointerY - y) / zoom;
      const fromDetail = detailForZoom(zoom);
      const toDetail = detailForZoom(nextZoom);
      if (fromDetail !== toDetail) {
        setWheelBoundaryAt(performance.now());
        // 50%와 100% 경계에서는 기존 블록 자체의 좌표가 바뀐다.
        // 포인터에 가장 가까운 공통 블록의 이동량만큼 기준 좌표를 옮긴다.
        const shift = layoutShiftAtPoint(
          getLayout(fromDetail),
          getLayout(toDetail),
          flowX,
          flowY,
        );
        flowX += shift.x;
        flowY += shift.y;
      }
      void setViewport({
        x: pointerX - flowX * nextZoom,
        y: pointerY - flowY * nextZoom,
        zoom: nextZoom,
      });
    };

    container.addEventListener('wheel', onWheel, {
      capture: true,
      passive: false,
    });
    return () => container.removeEventListener('wheel', onWheel, true);
  }, [getLayout, getViewport, setViewport]);
  const panExtent = useMemo<CoordinateExtent | undefined>(() => {
    if (detail === 'standard' || layout.nodes.length === 0) return undefined;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const node of layout.nodes) {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x + node.width);
      maxY = Math.max(maxY, node.y + node.height);
    }

    return [
      [minX - PAN_BOUNDARY_MARGIN, minY - PAN_BOUNDARY_MARGIN],
      [maxX + PAN_BOUNDARY_MARGIN, maxY + PAN_BOUNDARY_MARGIN],
    ];
  }, [detail, layout]);

  // 현재 화면은 먼저 그리고, 나머지 표시 수준은 브라우저 유휴 시간에 한 단계씩 준비한다.
  useEffect(() => {
    const remaining = (
      ['minimized', 'medium', 'standard'] as MapDetailLevel[]
    ).filter((level) => !layoutCache.has(level));
    let handle = 0;
    const warm = () => {
      const level = remaining.shift();
      if (!level) return;
      getLayout(level);
      if (remaining.length) schedule();
    };
    const schedule = () => {
      handle = window.requestIdleCallback
        ? window.requestIdleCallback(warm)
        : window.setTimeout(warm, 100);
    };
    if (remaining.length) schedule();
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [getLayout, layoutCache]);

  const targetLayout = useMemo(
    () => (detail === 'standard' ? layout : { ...layout, areas: EMPTY_AREAS }),
    [detail, layout],
  );
  const visual = useAnimatedMapLayout(
    targetLayout,
    detail,
    wheelBoundaryAt !== 0,
  );
  const nodeData = useMemo(
    () => new Map(layout.nodes.map((node) => [node.id, { node }])),
    [layout],
  );

  const nodes = useMemo<Node[]>(() => {
    // 크기를 미리 넘겨야 첫 렌더에서 fitView가 동작하고,
    // 측정 전 visibility:hidden 상태로 클릭이 막히지 않는다.
    const blockNodes: Node[] = visual.layout.nodes.map((node) => ({
      id: node.id,
      type: 'mapBlock',
      position: { x: node.x, y: node.y },
      data: nodeData.get(node.id) ?? { node },
      draggable: false,
      selectable: false,
      initialWidth: node.width,
      initialHeight: node.height,
      style: {
        opacity: visual.nodeOpacity.get(node.id) ?? 1,
        transition:
          standardBoundary && !wheelBoundaryAt && node.level <= 3
            ? 'transform 180ms ease-out'
            : undefined,
        animation:
          standardBoundary && detail === 'standard' && node.level >= 4
            ? 'map-standard-reveal 180ms ease-out both'
            : undefined,
      },
    }));

    // 표준 수준 진입·이탈 중에는 미리보기 버튼도 배경 영역과 함께 페이드한다.
    if (visual.layout.areas.length === 0) return blockNodes;

    const previewNodes: Node[] = visual.layout.areas.map((area) => ({
      id: `preview:${area.experienceId}`,
      type: 'listPreview',
      position: {
        x:
          area.x +
          area.width -
          LIST_PREVIEW_BUTTON_INSET -
          LIST_PREVIEW_BUTTON_WIDTH,
        y: area.y + LIST_PREVIEW_BUTTON_INSET,
      },
      data: { experienceId: area.experienceId },
      draggable: false,
      selectable: false,
      initialWidth: LIST_PREVIEW_BUTTON_WIDTH,
      initialHeight: LIST_PREVIEW_BUTTON_HEIGHT,
      style: {
        animation:
          standardBoundary && detail === 'standard'
            ? 'map-standard-reveal 180ms ease-out both'
            : undefined,
      },
    }));

    return [...blockNodes, ...previewNodes];
  }, [detail, nodeData, standardBoundary, visual, wheelBoundaryAt]);

  const edges = useMemo<Edge[]>(
    () =>
      visual.layout.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        // 문제해결 계열 블록에서 뻗는 선만 직각으로 꺾어 그린다.
        type: edge.orthogonal ? 'elbow' : 'straight',
        data: edge.branchX == null ? undefined : { branchX: edge.branchX },
        style: {
          ...EDGE_STYLE,
          opacity: visual.edgeOpacity.get(edge.id) ?? 1,
          animation:
            standardBoundary && detail === 'standard'
              ? 'map-standard-reveal 140ms ease-out 80ms both'
              : undefined,
        },
      })),
    [detail, standardBoundary, visual],
  );

  /**
   * 최소화 · 중간 수준에서 블록을 클릭하면 표준 수준으로 확대한다.
   * 확대 후에는 표시 단계가 늘어나 좌표가 바뀌므로,
   * 표준 수준 레이아웃에서 같은 블록의 위치를 다시 찾아 중앙에 맞춘다.
   */
  const focusOnStandard = useCallback(
    (nodeId: string, alignLeft = false) => {
      const standardLayout = getLayout('standard');
      const target = standardLayout.nodes.find((n) => n.id === nodeId);
      if (!target) return;

      // 활동 노드는 세로 중앙을 유지하고, 가로로는 화면 중앙보다 왼쪽에 둔다.
      // flow 좌표로 변환해 뷰포트 크기와 배율이 달라도 같은 비율로 정렬한다.
      const viewportWidth = mapViewportRef.current?.clientWidth ?? 0;
      const horizontalOffset = alignLeft
        ? (viewportWidth * 0.2) / FOCUS_ZOOM
        : 0;

      void setCenter(
        target.x + target.width / 2 + horizontalOffset,
        target.y + target.height / 2,
        { zoom: FOCUS_ZOOM, duration: 300 },
      );
    },
    [getLayout, setCenter],
  );

  useEffect(() => {
    const onAgentFocus = (event: Event) => {
      const experienceId = (event as CustomEvent<string>).detail;
      setStandardBoundary(true);
      setDetail('standard');
      focusOnStandard(experienceNodeId(experienceId));
    };
    window.addEventListener('experience-agent:focus', onAgentFocus);
    return () =>
      window.removeEventListener('experience-agent:focus', onAgentFocus);
  }, [focusOnStandard]);

  /**
   * 활동 미리보기 모달을 닫을 때, 화살표로 마지막까지 보고 있던 활동으로 확대한다.
   * 표준 수준이 아니었다면(맵 뷰 최소화 상태에서 리스트로 확인하기를 눌렀을 리는
   * 없지만, 방어적으로) 표준 수준으로 맞춘 뒤 이동한다.
   */
  const onPreviewClose = useCallback(
    (lastExperienceId: string) => {
      setStandardBoundary(true);
      setDetail('standard');
      focusOnStandard(experienceNodeId(lastExperienceId));
    },
    [focusOnStandard],
  );

  // 노드 크기가 잡힌 뒤 한 번만 화면에 맞춘다. (이후 확대/축소는 사용자 조작을 따른다)
  // focusExperienceId가 있으면(모바일 진입) 전체 맞춤 대신 해당 활동을 중앙에 두고 확대한다.
  useEffect(() => {
    if (!nodesInitialized || didFitRef.current) return;
    didFitRef.current = true;

    if (focusExperienceId) {
      const standardLayout = getLayout('standard');
      const targetId = experienceNodeId(focusExperienceId);
      const target = standardLayout.nodes.find((n) => n.id === targetId);
      if (target) {
        setStandardBoundary(true);
        setDetail('standard');
        void setCenter(
          target.x + target.width / 2,
          target.y + target.height / 2,
          { zoom: FOCUS_ZOOM },
        );
        return;
      }
    }

    void fitView(FIT_VIEW_OPTIONS);
  }, [nodesInitialized, fitView, focusExperienceId, getLayout, setCenter]);

  const onBlockClick = useCallback(
    (node: MapLayoutNode) => {
      // 선택 삭제 모드에서는 편집/확대 대신 선택 상태만 전환한다.
      if (blockSelectionMode) {
        const ids = collectSelectionIds(groups, experiences, node.id);
        if (ids.length === 0) return;
        setBlockSelection(ids, !selectedBlockIds[node.id]);
        return;
      }

      // 뷰 전환 시 같은 그룹/활동을 이어서 보여주기 위해 탐색 대상을 공용 선택 상태에 남긴다.
      if (node.kind === 'group')
        useExperienceListStore.setState({
          selection: { kind: 'group', id: node.refId },
        });
      else if (node.kind === 'experience') selectExperience(node.refId);
      else if (node.experienceId) selectExperience(node.experienceId);

      // 최소화 · 중간 수준에서는 편집 대신 해당 블록을 중앙에 두고 표준 수준으로 확대한다.
      if (detail !== 'standard') {
        setStandardBoundary(true);
        setDetail('standard');
        focusOnStandard(node.id, node.kind === 'experience');
        return;
      }

      setActiveId(node.id);
    },
    [
      blockSelectionMode,
      groups,
      experiences,
      selectedBlockIds,
      setBlockSelection,
      selectExperience,
      detail,
      focusOnStandard,
    ],
  );

  /**
   * 리스트 뷰와 동일하게 더블클릭으로 제목/본문 편집을 시작한다.
   * 표준 수준에서 편집 가능한 블록만 대상으로 하며,
   * 선택 삭제 모드에서는 무시한다.
   */
  const onBlockDoubleClick = useCallback(
    (node: MapLayoutNode) => {
      if (blockSelectionMode) return;
      if (detail !== 'standard') return;
      if (!node.editable) return;
      setActiveId(node.id);
      setEditingId(node.id);
    },
    [blockSelectionMode, detail],
  );

  /** 휠·핀치·컨트롤러 모두 동일한 배율 경계에서 표시 단계를 변경한다. */
  const onViewportChange = useCallback(
    (zoom: number) => {
      const next = detailForZoom(zoom);
      if (next === detail) return;
      setStandardBoundary(next === 'standard' || detail === 'standard');
      setDetail(next);
    },
    [detail],
  );

  const onEditingChange = useCallback((id: string, editing: boolean) => {
    setEditingId((prev) => (editing ? id : prev === id ? null : prev));
  }, []);

  const { draggingId, dropTarget, onBlockPressStart, consumeSuppressedClick } =
    useMapBlockDrag();

  const interaction = useMemo(
    () => ({
      detail,
      activeId,
      editingId,
      onBlockClick,
      onEditingChange,
      draggingId,
      onBlockPressStart,
    }),
    [
      detail,
      activeId,
      editingId,
      onBlockClick,
      onEditingChange,
      draggingId,
      onBlockPressStart,
    ],
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, flowNode: Node) => {
      if (consumeSuppressedClick()) return;
      const payload = flowNode.data as { node?: MapLayoutNode };
      if (payload.node) onBlockClick(payload.node);
    },
    [consumeSuppressedClick, onBlockClick],
  );

  const handleNodeDoubleClick = useCallback(
    (_: React.MouseEvent, flowNode: Node) => {
      const payload = flowNode.data as { node?: MapLayoutNode };
      if (payload.node) onBlockDoubleClick(payload.node);
    },
    [onBlockDoubleClick],
  );

  const handleMove = useCallback<OnMove>(
    (_, viewport) => onViewportChange(viewport.zoom),
    [onViewportChange],
  );

  const handleMoveStart = useCallback(() => {
    window.dispatchEvent(new Event('experience-map:move-start'));
  }, []);

  const handlePaneClick = useCallback(() => {
    useExperienceListStore.setState({ selection: null });
    setActiveId(null);
    setEditingId(null);
  }, []);

  return (
    <MapInteractionProvider value={interaction}>
      <div ref={mapViewportRef} className='absolute inset-0'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          minZoom={MAP_MIN_ZOOM}
          maxZoom={MAP_MAX_ZOOM}
          translateExtent={panExtent}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          /*
           * 피그마와 동일한 마우스 조작:
           * 휠 = 상하 스크롤, Shift + 휠 = 좌우 스크롤,
           * Ctrl/Cmd + 휠 = 위의 별도 감도로 확대/축소
           */
          panOnScroll={!isCoarsePointer}
          panOnScrollSpeed={PAN_SCROLL_SPEED}
          panOnScrollMode={PanOnScrollMode.Free}
          // 터치 기기: 한 손가락 드래그로 캔버스 이동, 두 손가락으로 확대/축소.
          // (데스크톱도 react-flow 기본값이 드래그 팬 허용이라 동작은 그대로다)
          panOnDrag
          zoomOnScroll={false}
          zoomOnPinch
          zoomOnDoubleClick={false}
          proOptions={PRO_OPTIONS}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
          onMove={handleMove}
          // 캔버스를 움직이기 시작하면 열려 있는 블록 추가 드롭다운을 닫는다. (화면에 고정된 채로 어긋나 보이는 상태 방지)
          onMoveStart={handleMoveStart}
          onPaneClick={handlePaneClick}
          className='experience-map-flow bg-white'
        >
          {/* 활동 배경은 모든 블록이 보이는 표준 수준에서만 표시한다. */}
          <MapActivityAreas areas={visual.layout.areas} />
        </ReactFlow>
      </div>
      {dropTarget && <MapDropIndicator target={dropTarget} />}
      <MapZoomController />
      <MapActivityPreviewModal onClose={onPreviewClose} />
    </MapInteractionProvider>
  );
}

export function ExperienceMapCanvas({ focusExperienceId }: CanvasProps = {}) {
  return (
    <ReactFlowProvider>
      <ExperienceMapCanvasInner focusExperienceId={focusExperienceId} />
    </ReactFlowProvider>
  );
}
