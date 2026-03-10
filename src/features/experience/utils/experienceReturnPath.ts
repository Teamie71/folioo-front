const STORAGE_KEY = 'experience_return_path';

/* 생성한 경험 → 채팅 진입 시 GET /status 호출 생략 */
export const CHAT_NEW_EXPERIENCE_STORAGE_KEY = 'folioo_experience_new_id';

export function setChatNewExperienceId(experienceId: number): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(
      CHAT_NEW_EXPERIENCE_STORAGE_KEY,
      String(experienceId),
    );
  } catch {
    // ignore
  }
}

export function isChatNewExperience(experienceId: number): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return (
      sessionStorage.getItem(CHAT_NEW_EXPERIENCE_STORAGE_KEY) ===
      String(experienceId)
    );
  } catch {
    return false;
  }
}

export function clearChatNewExperienceId(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(CHAT_NEW_EXPERIENCE_STORAGE_KEY);
  } catch {}
}

export type ExperienceReturnPath = 'chat' | 'createloading' | 'portfolio';

const VALID_PATHS: ExperienceReturnPath[] = [
  'chat',
  'createloading',
  'portfolio',
];

function getStorage(): Record<string, ExperienceReturnPath> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return Object.fromEntries(
      Object.entries(parsed).filter(([, v]) =>
        VALID_PATHS.includes(v as ExperienceReturnPath),
      ),
    ) as Record<string, ExperienceReturnPath>;
  } catch {
    return {};
  }
}

function setStorage(data: Record<string, ExperienceReturnPath>) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/* 해당 경험 id에서 마지막으로 머문 페이지 저장 */
export function setExperienceReturnPath(
  id: string,
  path: ExperienceReturnPath,
): void {
  const next = { ...getStorage(), [id]: path };
  setStorage(next);
}

/* 해당 경험 id에 저장된 복귀 경로를 반환 (없으면 null) */
export function getExperienceReturnPath(
  id: string,
): ExperienceReturnPath | null {
  const stored = getStorage()[id];
  return stored ?? null;
}

/* 저장된 복귀 경로 전체 (id -> path). 클라이언트에서만 사용. */
export function getExperienceReturnPaths(): Record<
  string,
  ExperienceReturnPath
> {
  return getStorage();
}

/* createloading 페이지 진입 여부 */
const CREATELOADING_ENTERED_KEY = 'folioo_createloading_entered_ids';

function getCreateloadingEnteredIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = sessionStorage.getItem(CREATELOADING_ENTERED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function setCreateloadingEnteredIds(ids: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(CREATELOADING_ENTERED_KEY, JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}

/* 해당 경험에 대해 createloading 페이지에 진입했음을 기록 */
export function setCreateloadingEntered(id: string): void {
  if (!id) return;
  const set = getCreateloadingEnteredIds();
  set.add(id);
  setCreateloadingEnteredIds(set);
}

/* 해당 경험에 대해 createloading 진입 이력이 있으면 true */
export function hasCreateloadingEntered(id: string): boolean {
  if (!id) return false;
  return getCreateloadingEnteredIds().has(id);
}
