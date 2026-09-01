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
import type {
  Block,
  Experience,
  Group,
} from '@/features/experience/list/types';

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
/**
 * 비로그인 모드.
 *
 * 화면설계서: 비로그인 사용자도 조회·편집 권한을 모두 갖지만
 * 수정 사항은 서버에 저장되지 않고 클라이언트에만 임시 유지된다.
 * 그래서 이 모드에서는 쓰기를 아예 서버로 보내지 않는다. (스토어의 낙관적 갱신만 남는다)
 */
let guestMode = false;
let queue: Promise<void> = Promise.resolve();
let mapVersion: string | null = null;
/** 큐에 남아 있는 작업 수. 0이 될 때만 화면을 서버 상태로 맞춘다. */
let pending = 0;
/** 낙관적으로 만든 임시 id → 서버가 돌려준 실제 블록 id */
const idAliases = new Map<string, string>();

export function configureExperienceMapSync(next: SyncHandlers) {
  handlers = next;
}

/** 비로그인 여부를 알린다. true인 동안에는 서버로 아무것도 쓰지 않는다. */
export function setExperienceMapGuestMode(next: boolean) {
  guestMode = next;
}

export function isExperienceMapGuestMode(): boolean {
  return guestMode;
}

/** 로그아웃·페이지 재진입 등으로 맵을 처음부터 다시 읽을 때 호출한다. */
export function resetExperienceMapSync() {
  queue = Promise.resolve();
  mapVersion = null;
  pending = 0;
  idAliases.clear();
}

/**
 * 서버가 준 실패 사유를 읽을 수 있는 에러로 바꾼다.
 *
 * 공통 응답(CommonResponse)의 error.errorCode / reason이 실제 원인인데,
 * 그대로 두면 "Request failed with status code 400"만 남아 무엇이 잘못됐는지 알 수 없다.
 * 예) 블록 생성 실패 (kind=CONTENT, parentId=12) · HTTP 400 · BLOCK4001 · 해당 위치에 …
 */
function describeApiError(error: unknown, context: string): Error {
  const response = (
    error as { response?: { status?: number; data?: unknown } } | undefined
  )?.response;
  const detail = (
    response?.data as
      | { error?: { errorCode?: string; reason?: string } }
      | undefined
  )?.error;

  const parts = [context];
  if (response?.status) parts.push(`HTTP ${response.status}`);
  if (detail?.errorCode) parts.push(detail.errorCode);
  if (detail?.reason) parts.push(detail.reason);

  const wrapped = new Error(parts.join(' · '));
  wrapped.cause = error;
  return wrapped;
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
  // 비로그인 편집은 서버에 저장하지 않는다.
  if (guestMode) return;
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
        /*
         * 생성 응답의 children은 항상 빈 배열이라(활동을 만들면 서버가 SECTION 5종을
         * 함께 만들지만 응답에 담기지 않는다) 화면은 반드시 이 재조회 결과로 그린다.
         */
        const snapshot = await fetchMap();
        /*
         * 조회하는 사이에 새 작업이 들어왔다면 그 작업의 낙관적 변경이 아직
         * 서버에 없다. 지금 반영하면 방금 만든 블록이 사라졌다 돌아오므로,
         * 그 작업이 끝난 뒤의 재조회에 맡긴다.
         */
        if (pending > 0) return;
        handlers?.onSnapshot(snapshot);
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
  const parentId = params.parentId ? serverId(params.parentId) : undefined;
  const response = await write((expectedMapVersion) =>
    experienceMapControllerCreateBlock({
      kind: params.kind,
      ...(parentId ? { parentId } : {}),
      content: toContentPayload<CreateBlockReqDTOContent>(params.content),
      expectedMapVersion,
    }),
  ).catch((error) => {
    throw describeApiError(
      error,
      `블록 생성 실패 (kind=${params.kind}, parentId=${parentId ?? '루트'})`,
    );
  });

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
  ).catch((error) => {
    throw describeApiError(error, `블록 이동 실패 (blockId=${blockId})`);
  });
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
    )
      .then(() => undefined)
      .catch((error) => {
        throw describeApiError(
          error,
          `블록 내용 수정 실패 (blockId=${blockId})`,
        );
      }),
  );
}

export function syncDeleteBlocks(blockIds: string[]) {
  enqueue(async () => {
    for (const blockId of blockIds) {
      await write((expectedMapVersion) =>
        experienceMapControllerDeleteBlock(serverId(blockId), {
          expectedMapVersion,
        }),
      ).catch((error) => {
        throw describeApiError(error, `블록 삭제 실패 (blockId=${blockId})`);
      });
    }
  });
}

/**
 * 비로그인 때 편집한 내용을 로그인 후 서버에 옮긴다. (화면설계서 "페이지 권한")
 *
 * 활동을 만들면 서버가 SECTION 5종을 함께 만들어 주므로, 임시로 갖고 있던 섹션은
 * 새로 만들지 않고 종류(kind)로 짝지어 그 아래에 하위 블록만 붙인다.
 */
export function syncImportGuestDraft(draft: {
  groups: Group[];
  experiences: Experience[];
}) {
  enqueue(async () => {
    // 서버의 미분류 그룹으로 임시 미분류의 활동을 옮겨 붙인다.
    const serverState = await fetchMap();
    const serverUnclassifiedId = serverState.groups.find(
      (g) => g.isUnclassified,
    )?.id;

    for (const group of draft.groups) {
      if (group.isUnclassified) {
        if (serverUnclassifiedId) idAliases.set(group.id, serverUnclassifiedId);
        continue;
      }
      await createBlock({
        clientId: group.id,
        kind: BlockResDTOKind.GROUP,
        content: group.name,
      });
    }

    for (const experience of draft.experiences) {
      await createBlock({
        clientId: experience.id,
        kind: BlockResDTOKind.EXPERIENCE,
        parentId: experience.groupId,
        content: experience.name,
      });

      // 서버가 만들어 준 섹션을 받아 와야 그 아래에 블록을 붙일 수 있다.
      const afterCreate = await fetchMap();
      const created = afterCreate.experiences.find(
        (e) => e.id === serverId(experience.id),
      );
      if (!created) continue;

      for (const section of experience.blocks) {
        const target = created.blocks.find((b) => b.kind === section.kind);
        // 짝이 되는 섹션이 없으면(자유 블록 등) 활동 아래에 그대로 만든다.
        const parentId = target?.id ?? serverId(experience.id);
        if (!target) {
          await createSubtree(section, parentId);
          continue;
        }
        for (const child of section.children) {
          await createSubtree(child, target.id);
        }
      }
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
