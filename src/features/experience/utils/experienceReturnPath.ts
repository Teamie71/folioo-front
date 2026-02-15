const STORAGE_KEY = 'experience_return_path';

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
