'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  PanOnScrollMode,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useStoreApi,
  type CoordinateExtent,
  type Edge,
  type Node,
  type OnMove,
  type Viewport,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useExperienceListStore } from '@/store/useExperienceListStore';
import { useAuthStore } from '@/store/useAuthStore';
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

const INITIAL_FIT_PADDING = 0.2;
const INITIAL_MAX_ZOOM = 0.49;
const INITIAL_VIEWPORT = { x: 0, y: 0, zoom: MAP_MIN_ZOOM };
const VIEWPORT_STORAGE_KEY = 'folioo:experience-map:viewport:v1';
// 25%에서도 화면 한 폭 이상을 자유롭게 이동할 수 있도록 넓은 여백을 둔다.
const PAN_BOUNDARY_MARGIN = 3000;
const PAN_SCROLL_SPEED = 0.5;
const WHEEL_ZOOM_SENSITIVITY = 0.06;
const MAX_WHEEL_ZOOM_DELTA = 0.04;
const ACTIVITY_FOCUS_LEFT_OFFSET_RATIO = 0.2;

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

function initialViewportForLayout(
  layout: MapLayout,
  width: number,
  height: number,
): Viewport {
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
  const contentWidth = Math.max(1, maxX - minX);
  const contentHeight = Math.max(1, maxY - minY);
  const fitZoom = Math.min(
    INITIAL_MAX_ZOOM,
    width / (contentWidth * (1 + INITIAL_FIT_PADDING * 2)),
    height / (contentHeight * (1 + INITIAL_FIT_PADDING * 2)),
  );
  const zoom = Math.max(MAP_MIN_ZOOM, fitZoom);

  // 최소 배율로도 전체가 들어오지 않으면 첫 그룹부터 탐색할 수 있게 둔다.
  if (fitZoom < MAP_MIN_ZOOM) {
    const firstGroup = layout.nodes.find((node) => node.kind === 'group');
    if (firstGroup)
      return {
        x: width * 0.35 - (firstGroup.x + firstGroup.width / 2) * zoom,
        y: height * 0.35 - (firstGroup.y + firstGroup.height / 2) * zoom,
        zoom,
      };
  }

  return {
    x: (width - contentWidth * zoom) / 2 - minX * zoom,
    y: (height - contentHeight * zoom) / 2 - minY * zoom,
    zoom,
  };
}

function readSavedViewport(ownerKey: string | undefined): Viewport | null {
  if (!ownerKey || typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(VIEWPORT_STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as {
      ownerKey?: string;
      viewport?: Partial<Viewport>;
    };
    const viewport = saved.viewport;
    if (
      saved.ownerKey !== ownerKey ||
      !viewport ||
      !Number.isFinite(viewport.x) ||
      !Number.isFinite(viewport.y) ||
      !Number.isFinite(viewport.zoom) ||
      viewport.zoom! < MAP_MIN_ZOOM ||
      viewport.zoom! > MAP_MAX_ZOOM
    )
      return null;
    return viewport as Viewport;
  } catch {
    return null;
  }
}

function saveViewport(ownerKey: string | undefined, viewport: Viewport) {
  if (!ownerKey || typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(
      VIEWPORT_STORAGE_KEY,
      JSON.stringify({ ownerKey, viewport }),
    );
  } catch {
    // 저장소 사용이 막혀도 맵 조작은 계속 가능해야 한다.
  }
}

type CanvasProps = {
  /** 진입 직후 화면 중앙에 두고 표준 수준으로 확대할 활동 id. (모바일 진입용) */
  focusExperienceId?: string;
};

function ExperienceMapCanvasInner({ focusExperienceId }: CanvasProps) {
  const groups = useExperienceListStore((s) => s.groups);
  const experiences = useExperienceListStore((s) => s.experiences);
  const isContentLoading = useExperienceListStore((s) => s.isContentLoading);
  const accessToken = useAuthStore((s) => s.accessToken);
  const ownerKey = accessToken
    ? groups.find((group) => group.isUnclassified)?.id
    : 'guest';
  const savedViewport = useMemo(() => readSavedViewport(ownerKey), [ownerKey]);
  const blockSelectionMode = useExperienceListStore(
    (s) => s.blockSelectionMode,
  );
  const selectedBlockIds = useExperienceListStore((s) => s.selectedBlockIds);
  const setBlockSelection = useExperienceListStore((s) => s.setBlockSelection);
  const selectExperience = useExperienceListStore((s) => s.selectExperience);

  const { setCenter, getViewport, setViewport } = useReactFlow();
  const flowStore = useStoreApi();
  const mapViewportRef = useRef<HTMLDivElement>(null);
  const sidebarPanFrame = useRef<number | null>(null);
  const didFitRef = useRef(false);
  const [flowReady, setFlowReady] = useState(false);
  const [viewportReady, setViewportReady] = useState(false);

  const [detail, setDetail] = useState<MapDetailLevel>(() =>
    savedViewport ? detailForZoom(savedViewport.zoom) : DEFAULT_DETAIL,
  );
  const [standardBoundary, setStandardBoundary] = useState(false);
  const [anchoredBoundaryAt, setAnchoredBoundaryAt] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fontVersion, setFontVersion] = useState(0);

  useEffect(() => {
    if (!standardBoundary) return;
    const timer = window.setTimeout(() => setStandardBoundary(false), 200);
    return () => window.clearTimeout(timer);
  }, [detail, standardBoundary]);

  useEffect(() => {
    if (!anchoredBoundaryAt) return;
    const timer = window.setTimeout(
      () => setAnchoredBoundaryAt(0),
      Math.max(200, anchoredBoundaryAt - performance.now() + 200),
    );
    return () => window.clearTimeout(timer);
  }, [anchoredBoundaryAt]);

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

  const zoomAtPoint = useCallback(
    (nextZoom: number, pointerX: number, pointerY: number, duration = 0) => {
      const { x, y, zoom } = getViewport();
      if (nextZoom === zoom) return;
      let flowX = (pointerX - x) / zoom;
      let flowY = (pointerY - y) / zoom;
      const fromDetail = detailForZoom(zoom);
      const toDetail = detailForZoom(nextZoom);
      if (fromDetail !== toDetail) {
        setAnchoredBoundaryAt(performance.now() + duration);
        const shift = layoutShiftAtPoint(
          getLayout(fromDetail),
          getLayout(toDetail),
          flowX,
          flowY,
        );
        flowX += shift.x;
        flowY += shift.y;
      }
      void setViewport(
        {
          x: pointerX - flowX * nextZoom,
          y: pointerY - flowY * nextZoom,
          zoom: nextZoom,
        },
        { duration },
      );
    },
    [getLayout, getViewport, setViewport],
  );

  const zoomFromController = useCallback(
    (nextZoom: number, duration: number) => {
      const bounds = mapViewportRef.current?.getBoundingClientRect();
      if (!bounds) return;
      zoomAtPoint(nextZoom, bounds.width / 2, bounds.height / 2, duration);
    },
    [zoomAtPoint],
  );

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

      const { zoom } = getViewport();
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
      zoomAtPoint(nextZoom, pointerX, pointerY);
    };

    container.addEventListener('wheel', onWheel, {
      capture: true,
      passive: false,
    });
    return () => container.removeEventListener('wheel', onWheel, true);
  }, [getViewport, zoomAtPoint]);
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
    anchoredBoundaryAt !== 0,
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
          standardBoundary && !anchoredBoundaryAt && node.level <= 3
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
  }, [anchoredBoundaryAt, detail, nodeData, standardBoundary, visual]);

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
        ? (viewportWidth * ACTIVITY_FOCUS_LEFT_OFFSET_RATIO) / FOCUS_ZOOM
        : 0;

      void setCenter(
        target.x + target.width / 2 + horizontalOffset,
        target.y + target.height / 2,
        { zoom: FOCUS_ZOOM, duration: 300, interpolate: 'linear' },
      );
    },
    [getLayout, setCenter],
  );

  useEffect(() => {
    const onSidebarFocus = (event: Event) => {
      const experienceId = (event as CustomEvent<string>).detail;
      const zoom = getViewport().zoom;
      const currentLayout = getLayout(detailForZoom(zoom));
      const target = currentLayout.nodes.find(
        (node) => node.id === experienceNodeId(experienceId),
      );
      if (!target) return;
      const container = mapViewportRef.current;
      if (!container) return;
      if (sidebarPanFrame.current !== null)
        cancelAnimationFrame(sidebarPanFrame.current);
      const start = getViewport();
      const destinationX =
        container.clientWidth * 0.3 - (target.x + target.width / 2) * zoom;
      const destinationY =
        container.clientHeight / 2 - (target.y + target.height / 2) * zoom;
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      const duration = reducedMotion ? 0 : 300;
      const startedAt = performance.now();

      // panBy는 현재 배율을 건드리지 않는다. 매 프레임 위치 차이만 적용한다.
      const move = (now: number) => {
        const progress =
          duration === 0 ? 1 : Math.min(1, (now - startedAt) / duration);
        const eased = 1 - (1 - progress) ** 3;
        const current = getViewport();
        void flowStore.getState().panBy({
          x: start.x + (destinationX - start.x) * eased - current.x,
          y: start.y + (destinationY - start.y) * eased - current.y,
        });
        sidebarPanFrame.current =
          progress < 1 ? requestAnimationFrame(move) : null;
      };
      sidebarPanFrame.current = requestAnimationFrame(move);
    };
    window.addEventListener('experience-map:focus', onSidebarFocus);
    return () => {
      window.removeEventListener('experience-map:focus', onSidebarFocus);
      if (sidebarPanFrame.current !== null)
        cancelAnimationFrame(sidebarPanFrame.current);
    };
  }, [flowStore, getLayout, getViewport]);

  useEffect(() => {
    const onAgentFocus = (event: Event) => {
      const experienceId = (event as CustomEvent<string>).detail;
      // 이미 표준 단계라면 레이아웃/노드 등장 효과를 다시 시작하지 않고
      // 기존 캔버스의 뷰포트만 선택한 활동으로 이동한다.
      if (detail !== 'standard') {
        setStandardBoundary(true);
        setDetail('standard');
      }
      focusOnStandard(experienceNodeId(experienceId), true);
    };
    window.addEventListener('experience-agent:focus', onAgentFocus);
    return () =>
      window.removeEventListener('experience-agent:focus', onAgentFocus);
  }, [detail, focusOnStandard]);

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

  // 맵 데이터와 React Flow 캔버스가 준비된 뒤 한 번만 초기 위치를 정한다.
  // 노드 측정 상태에 의존하면 초기 fitView가 누락되어 기본 원점에 남을 수 있다.
  // focusExperienceId가 있으면 전체 맞춤 대신 해당 활동을 세로 중앙, 가로 왼쪽에 두고 확대한다.
  useEffect(() => {
    if (
      isContentLoading ||
      layout.nodes.length === 0 ||
      !flowReady ||
      didFitRef.current
    )
      return;
    const container = mapViewportRef.current;
    if (
      !container ||
      container.clientWidth === 0 ||
      container.clientHeight === 0
    )
      return;

    if (focusExperienceId) {
      const standardLayout = getLayout('standard');
      const targetId = experienceNodeId(focusExperienceId);
      const target = standardLayout.nodes.find((n) => n.id === targetId);
      if (target) {
        setStandardBoundary(true);
        setDetail('standard');
        void setCenter(
          target.x +
            target.width / 2 +
            (container.clientWidth * ACTIVITY_FOCUS_LEFT_OFFSET_RATIO) /
              FOCUS_ZOOM,
          target.y + target.height / 2,
          { zoom: FOCUS_ZOOM },
        ).then(() => setViewportReady(true));
        didFitRef.current = true;
        return;
      }
    }

    void setViewport(
      savedViewport ??
        initialViewportForLayout(
          layout,
          container.clientWidth,
          container.clientHeight,
        ),
    ).then(() => setViewportReady(true));
    didFitRef.current = true;
  }, [
    isContentLoading,
    layout,
    flowReady,
    focusExperienceId,
    getLayout,
    savedViewport,
    setCenter,
    setViewport,
  ]);

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
      if (node.editable) setEditingId(node.id);
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

  const handleMove = useCallback<OnMove>(
    (_, viewport) => onViewportChange(viewport.zoom),
    [onViewportChange],
  );

  const handleMoveEnd = useCallback<OnMove>(
    (_, viewport) => {
      if (viewportReady) saveViewport(ownerKey, viewport);
    },
    [ownerKey, viewportReady],
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
          defaultViewport={savedViewport ?? INITIAL_VIEWPORT}
          onInit={() => setFlowReady(true)}
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
          onMove={handleMove}
          onMoveEnd={handleMoveEnd}
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
      {viewportReady && <MapZoomController onZoomChange={zoomFromController} />}
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
