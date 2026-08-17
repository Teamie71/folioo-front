'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  PanOnScrollMode,
  ReactFlow,
  ReactFlowProvider,
  useNodesInitialized,
  useReactFlow,
  type Edge,
  type Node,
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
  DETAIL_RESET_ZOOM,
  DETAIL_ZOOM_MAX,
  DETAIL_ZOOM_MIN,
  FOCUS_ZOOM,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM,
  maxVisibleLevel,
  stepDetail,
  type MapDetailLevel,
} from '@/features/experience/map/model/mapZoom';
import {
  buildMapLayout,
  type MapLayoutArea,
  type MapLayoutNode,
} from '@/features/experience/map/utils/mapLayout';
import { resetMeasureCache } from '@/features/experience/map/utils/measureBlockBox';
import { MapActivityAreas } from '@/features/experience/map/components/MapActivityAreas';
import { MapBlockNode } from '@/features/experience/map/components/MapBlockNode';
import { MapElbowEdge } from '@/features/experience/map/components/MapElbowEdge';
import { MapListPreviewNode } from '@/features/experience/map/components/MapListPreviewNode';
import { MapInteractionProvider } from '@/features/experience/map/components/MapInteractionContext';
import { collectSelectionIds } from '@/features/experience/map/utils/mapSelection';

const nodeTypes = {
  mapBlock: MapBlockNode,
  listPreview: MapListPreviewNode,
};

const edgeTypes = {
  elbow: MapElbowEdge,
};

const EDGE_STYLE = { stroke: '#9EA4A9', strokeWidth: 1 };

const EMPTY_AREAS: MapLayoutArea[] = [];

const FIT_VIEW_OPTIONS = {
  padding: 0.2,
  // 표시 수준 전환 범위 안에 머무르게 해서 진입 직후 수준이 다시 바뀌지 않도록 한다.
  maxZoom: DETAIL_RESET_ZOOM,
};

function ExperienceMapCanvasInner() {
  const groups = useExperienceListStore((s) => s.groups);
  const experiences = useExperienceListStore((s) => s.experiences);
  const blockSelectionMode = useExperienceListStore(
    (s) => s.blockSelectionMode,
  );
  const selectedBlockIds = useExperienceListStore((s) => s.selectedBlockIds);
  const setBlockSelection = useExperienceListStore((s) => s.setBlockSelection);

  const { setCenter, fitView, zoomTo } = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  const didFitRef = useRef(false);
  // 수준 전환 중 발생하는 onMove가 다시 전환을 유발하지 않도록 잠근다.
  const steppingRef = useRef(false);

  const [detail, setDetail] = useState<MapDetailLevel>(DEFAULT_DETAIL);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fontVersion, setFontVersion] = useState(0);
  const [menuCloseSignal, setMenuCloseSignal] = useState(0);

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

  // 노드 크기가 잡힌 뒤 한 번만 화면에 맞춘다. (이후 확대/축소는 사용자 조작을 따른다)
  useEffect(() => {
    if (!nodesInitialized || didFitRef.current) return;
    didFitRef.current = true;
    void fitView(FIT_VIEW_OPTIONS);
  }, [nodesInitialized, fitView]);

  const layout = useMemo(
    () => buildMapLayout(groups, experiences, maxVisibleLevel(detail)),
    // fontVersion은 측정 캐시 무효화 신호다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groups, experiences, detail, fontVersion],
  );

  const nodes = useMemo<Node[]>(() => {
    // 크기를 미리 넘겨야 첫 렌더에서 fitView가 동작하고,
    // 측정 전 visibility:hidden 상태로 클릭이 막히지 않는다.
    const blockNodes: Node[] = layout.nodes.map((node) => ({
      id: node.id,
      type: 'mapBlock',
      position: { x: node.x, y: node.y },
      data: { node },
      draggable: false,
      selectable: false,
      initialWidth: node.width,
      initialHeight: node.height,
    }));

    // '리스트로 확인하기'는 모든 블록이 보이는 표준 수준에서만 노출한다.
    if (detail !== 'standard') return blockNodes;

    const previewNodes: Node[] = layout.areas.map((area) => ({
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
      data: {},
      draggable: false,
      selectable: false,
      initialWidth: LIST_PREVIEW_BUTTON_WIDTH,
      initialHeight: LIST_PREVIEW_BUTTON_HEIGHT,
    }));

    return [...blockNodes, ...previewNodes];
  }, [layout, detail]);

  const edges = useMemo<Edge[]>(
    () =>
      layout.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        // 문제해결 계열 블록에서 뻗는 선만 직각으로 꺾어 그린다.
        type: edge.orthogonal ? 'elbow' : 'straight',
        data: edge.branchX == null ? undefined : { branchX: edge.branchX },
        style: EDGE_STYLE,
      })),
    [layout],
  );

  /**
   * 최소화 · 중간 수준에서 블록을 클릭하면 표준 수준으로 확대한다.
   * 확대 후에는 표시 단계가 늘어나 좌표가 바뀌므로,
   * 표준 수준 레이아웃에서 같은 블록의 위치를 다시 찾아 중앙에 맞춘다.
   */
  const focusOnStandard = useCallback(
    (nodeId: string) => {
      const standardLayout = buildMapLayout(groups, experiences, 5);
      const target = standardLayout.nodes.find((n) => n.id === nodeId);
      if (!target) return;

      void setCenter(
        target.x + target.width / 2,
        target.y + target.height / 2,
        { zoom: FOCUS_ZOOM, duration: 300 },
      );
    },
    [groups, experiences, setCenter],
  );

  const onBlockClick = useCallback(
    (node: MapLayoutNode) => {
      // 선택 삭제 모드에서는 편집/확대 대신 선택 상태만 전환한다.
      if (blockSelectionMode) {
        const ids = collectSelectionIds(groups, experiences, node.id);
        if (ids.length === 0) return;
        setBlockSelection(ids, !selectedBlockIds[node.id]);
        return;
      }

      // 최소화 · 중간 수준에서는 편집 대신 해당 블록을 중앙에 두고 표준 수준으로 확대한다.
      if (detail !== 'standard') {
        setDetail('standard');
        focusOnStandard(node.id);
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
      detail,
      focusOnStandard,
    ],
  );

  /**
   * 스크롤 확대/축소가 한 수준의 범위를 벗어나면 표시 단계를 옮기고 배율을 되돌린다.
   * 최소화 수준에서는 더 축소해 전체를 조망할 수 있고,
   * 표준 수준에서는 최대화(300%)까지 확대할 수 있다.
   */
  const onViewportChange = useCallback(
    (zoom: number) => {
      if (steppingRef.current) return;

      const direction =
        zoom < DETAIL_ZOOM_MIN ? -1 : zoom > DETAIL_ZOOM_MAX ? 1 : 0;
      if (direction === 0) return;

      const next = stepDetail(detail, direction);
      if (!next) return;

      steppingRef.current = true;
      setDetail(next);
      void zoomTo(DETAIL_RESET_ZOOM).finally(() => {
        steppingRef.current = false;
      });
    },
    [detail, zoomTo],
  );

  const onEditingChange = useCallback((id: string, editing: boolean) => {
    setEditingId((prev) => (editing ? id : prev === id ? null : prev));
  }, []);

  const interaction = useMemo(
    () => ({
      detail,
      activeId,
      editingId,
      onBlockClick,
      onEditingChange,
      menuCloseSignal,
    }),
    [
      detail,
      activeId,
      editingId,
      onBlockClick,
      onEditingChange,
      menuCloseSignal,
    ],
  );

  return (
    <MapInteractionProvider value={interaction}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={MAP_MIN_ZOOM}
        maxZoom={MAP_MAX_ZOOM}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        /*
         * 피그마와 동일한 마우스 조작:
         * 휠 = 상하 스크롤, Shift + 휠 = 좌우 스크롤,
         * Ctrl/Cmd + 휠 = 확대/축소 (zoomOnPinch가 ctrlKey 휠을 처리한다)
         */
        panOnScroll
        panOnScrollMode={PanOnScrollMode.Free}
        zoomOnScroll={false}
        zoomOnPinch
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
        onNodeClick={(_, flowNode) => {
          const payload = flowNode.data as { node?: MapLayoutNode };
          if (payload.node) onBlockClick(payload.node);
        }}
        onMove={(_, viewport) => onViewportChange(viewport.zoom)}
        // 캔버스를 움직이기 시작하면 열려 있는 블록 추가 드롭다운을 닫는다. (화면에 고정된 채로 어긋나 보이는 상태 방지)
        onMoveStart={() => setMenuCloseSignal((s) => s + 1)}
        onPaneClick={() => {
          setActiveId(null);
          setEditingId(null);
        }}
        className='bg-white'
      >
        {/* 활동 배경은 모든 블록이 보이는 표준 수준에서만 표시한다. */}
        <MapActivityAreas
          areas={detail === 'standard' ? layout.areas : EMPTY_AREAS}
        />
      </ReactFlow>
    </MapInteractionProvider>
  );
}

export function ExperienceMapCanvas() {
  return (
    <ReactFlowProvider>
      <ExperienceMapCanvasInner />
    </ReactFlowProvider>
  );
}
