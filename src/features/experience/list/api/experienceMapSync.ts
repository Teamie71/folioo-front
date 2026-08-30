import { BlockResDTOKind } from '@/api/models';
import type {
  CreateBlockReqDTOContent,
  CreateBlockReqDTOKind,
  UpdateBlockContentReqDTOContent,
} from '@/api/models';
import {
  experienceMapControllerCreateBlock,
  experienceMapControllerDeleteBlock,
  experienceMapControllerGetMap,
  experienceMapControllerMoveBlock,
  experienceMapControllerUpdateBlockContent,
} from '@/api/endpoints/experience-map/experience-map';
import {
  DTO_KIND_BY_SECTION,
  toContentPayload,
} from '@/features/experience/list/api/experienceMapKinds';
import {
  toListState,
  type ListStateFromServer,
} from '@/features/experience/list/api/experienceMapMapper';
import type { Block } from '@/features/experience/list/types';

/**
 * 경험 맵 쓰기 동기화 계층.
 *
 * 모든 쓰기 API가 `expectedMapVersion`(낙관적 잠금)을 요구하고, 그 값은
 * GET /experience-map 으로만 읽을 수 있다. 그래서
 *
 *   1. 쓰기를 하나의 큐로 직렬화하고,
 *   2. 쓰기 직전에 항상 최신 mapVersion을 확보하며,
 *   3. 작업이 끝나면 맵을 다시 읽어 스토어를 서버 상태로 맞춘다.
 *
 * 3번 덕분에 낙관적으로 만든 임시 id도 서버 id로 자연스럽게 대체된다.
 * 아직 응답이 오지 않은 사이에 이어진 작업을 위해 임시 id → 서버 id 별칭을 따로 둔다.
 */

type SyncHandlers = {
  /** 서버에서 읽은 맵을 스토어에 반영한다. */
  onSnapshot: (snapshot: ListStateFromServer) => void;
  /** 요청 실패를 알린다. (스토어는 이후 서버 상태로 되돌려진다) */
  onError: (error: unknown) => void;
};

let handlers: SyncHandlers | null = null;
let queue: Promise<void> = Promise.resolve();
let mapVersion: string | null = null;
/** 큐에 남아 있는 작업 수. 0이 될 때만 화면을 서버 상태로 맞춘다. */
let pending = 0;
/** 낙관적으로 만든 임시 id → 서버가 돌려준 실제 블록 id */
const idAliases = new Map<string, string>();

export function configureExperienceMapSync(next: SyncHandlers) {
  handlers = next;
}

/** 로그아웃·페이지 재진입 등으로 맵을 처음부터 다시 읽을 때 호출한다. */
export function resetExperienceMapSync() {
  queue = Promise.resolve();
  mapVersion = null;
  pending = 0;
  idAliases.clear();
}

/** 임시 id로 시작된 작업이라도 서버 id로 바꿔서 요청한다. */
function serverId(clientId: string): string {
  let id = clientId;
  // 별칭이 연쇄될 일은 없지만, 방어적으로 끝까지 따라간다.
  while (idAliases.has(id)) id = idAliases.get(id)!;
  return id;
}

/** 낙관적으로 만든 임시 id가 서버 id로 바뀌었는지 확인한다. (선택 상태 유지용) */
export function resolveSyncedId(clientId: string): string {
  return serverId(clientId);
}

async function fetchMap(): Promise<ListStateFromServer> {
  const response = await experienceMapControllerGetMap();
  const result = response.result;
  if (!result) throw new Error('경험 맵 응답이 비어 있습니다.');

  const snapshot = toListState(result);
  mapVersion = snapshot.mapVersion;
  return snapshot;
}

/**
 * 쓰기에 필요한 최신 mapVersion.
 *
 * 작업 도중의 조회 결과로는 화면을 갱신하지 않는다.
 * 템플릿처럼 여러 블록을 연달아 만드는 중에 화면을 덮어쓰면
 * 아직 서버에 없는 낙관적 블록이 사라졌다 다시 나타나 보이기 때문이다.
 */
async function currentVersion(): Promise<string> {
  if (mapVersion != null) return mapVersion;
  const snapshot = await fetchMap();
  return snapshot.mapVersion;
}

/**
 * 쓰기 한 건을 실행한다.
 * 쓰기가 성공하면 서버의 mapVersion이 올라가므로 로컬 값을 버리고 다시 읽게 한다.
 */
async function write<T>(run: (expectedMapVersion: string) => Promise<T>) {
  const version = await currentVersion();
  try {
    return await run(version);
  } finally {
    mapVersion = null;
  }
}

/** 최초 로딩. 스토어를 서버 상태로 채운다. */
export async function loadExperienceMap(): Promise<ListStateFromServer> {
  const snapshot = await fetchMap();
  idAliases.clear();
  handlers?.onSnapshot(snapshot);
  return snapshot;
}

/**
 * 사용자 조작 한 번(=낙관적 반영 한 번)에 대응하는 서버 작업을 큐에 넣는다.
 * 작업이 끝나면 성공·실패와 무관하게 맵을 다시 읽어 화면을 서버 상태로 맞춘다.
 */
function enqueue(run: () => Promise<void>) {
  pending += 1;
  queue = queue
    .then(run)
    .catch((error) => {
      handlers?.onError(error);
    })
    .then(async () => {
      pending -= 1;
      // 대기 중인 작업이 더 있으면 마지막 하나가 끝난 뒤에 한 번만 화면을 맞춘다.
      if (pending > 0) return;
      try {
        handlers?.onSnapshot(await fetchMap());
      } catch (error) {
        handlers?.onError(error);
      }
    });
  /*
   * 별칭(임시 id → 서버 id)은 여기서 지우지 않는다.
   * "만들고 곧바로 옮기기"처럼 한 조작이 여러 작업으로 나뉘는 경우가 있어,
   * 뒤따르는 작업이 아직 임시 id를 들고 있을 수 있다. (페이지 재진입 시 한 번에 비운다)
   */
}

async function createBlock(params: {
  clientId: string;
  kind: CreateBlockReqDTOKind;
  parentId?: string;
  content: string | null;
}): Promise<string> {
  const response = await write((expectedMapVersion) =>
    experienceMapControllerCreateBlock({
      kind: params.kind,
      ...(params.parentId ? { parentId: serverId(params.parentId) } : {}),
      content: toContentPayload<CreateBlockReqDTOContent>(params.content),
      expectedMapVersion,
    }),
  );

  const created = response.result;
  if (!created?.id) throw new Error('블록 생성 응답에 id가 없습니다.');

  idAliases.set(params.clientId, created.id);
  return created.id;
}

async function moveBlockTo(
  blockId: string,
  position: number,
  parentId?: string,
) {
  await write((expectedMapVersion) =>
    experienceMapControllerMoveBlock(serverId(blockId), {
      ...(parentId ? { parentId: serverId(parentId) } : {}),
      position,
      expectedMapVersion,
    }),
  );
}

/**
 * 만들려는 블록의 서버 종류.
 *
 * 고정 섹션(상세정보·주요성과·담당업무·문제해결·배운 점)만 SECTION_*이고,
 * 나머지는 모두 CONTENT다. 섹션은 제목을 못 고치므로 editable로 구분한다.
 * (4~5단계 블록의 kind는 드롭다운 분기용 표시라 서버 종류와 무관하다)
 */
function createKindOf(block: Block): CreateBlockReqDTOKind {
  if (block.editable || block.kind === 'free') return BlockResDTOKind.CONTENT;
  return DTO_KIND_BY_SECTION[block.kind];
}

/**
 * 블록 하나와 그 하위 블록을 순서대로 만든다.
 *
 * 생성 API에는 위치 지정이 없어 항상 부모의 마지막에 붙는다.
 * 형제 사이에 끼워 넣어야 하면 만든 뒤 위치를 옮긴다.
 */
async function createSubtree(
  block: Block,
  parentClientId: string,
  position?: number,
) {
  await createBlock({
    clientId: block.id,
    kind: createKindOf(block),
    parentId: parentClientId,
    // 고정 섹션의 제목은 서버가 정한다.
    content: block.editable ? block.text || null : null,
  });

  if (position != null) await moveBlockTo(block.id, position);

  for (const child of block.children) {
    await createSubtree(child, block.id);
  }
}

/* ------------------------------------------------------------------ *
 * 스토어에서 호출하는 작업들
 * ------------------------------------------------------------------ */

export function syncCreateGroup(clientId: string, name: string) {
  enqueue(() =>
    createBlock({
      clientId,
      kind: BlockResDTOKind.GROUP,
      content: name,
    }).then(() => undefined),
  );
}

export function syncCreateExperience(
  clientId: string,
  groupId: string,
  name: string,
) {
  // EXPERIENCE를 만들면 서버가 5종 SECTION을 함께 만든다.
  // 응답에는 포함되지 않으므로 enqueue의 맵 재조회로 받아온다.
  enqueue(() =>
    createBlock({
      clientId,
      kind: BlockResDTOKind.EXPERIENCE,
      parentId: groupId,
      content: name,
    }).then(() => undefined),
  );
}

/** 활동/블록 하위에 블록(및 템플릿 하위 블록)을 만든다. */
export function syncCreateBlocks(
  parentId: string,
  blocks: Block[],
  startPosition?: number,
) {
  enqueue(async () => {
    for (const [index, block] of blocks.entries()) {
      await createSubtree(
        block,
        parentId,
        startPosition == null ? undefined : startPosition + index,
      );
    }
  });
}

export function syncUpdateContent(blockId: string, text: string) {
  enqueue(() =>
    write((expectedMapVersion) =>
      experienceMapControllerUpdateBlockContent(serverId(blockId), {
        content: toContentPayload<UpdateBlockContentReqDTOContent>(text),
        expectedMapVersion,
      }),
    ).then(() => undefined),
  );
}

export function syncDeleteBlocks(blockIds: string[]) {
  enqueue(async () => {
    for (const blockId of blockIds) {
      await write((expectedMapVersion) =>
        experienceMapControllerDeleteBlock(serverId(blockId), {
          expectedMapVersion,
        }),
      );
    }
  });
}

export function syncMoveBlock(
  blockId: string,
  position: number,
  parentId?: string,
) {
  enqueue(() => moveBlockTo(blockId, position, parentId));
}
