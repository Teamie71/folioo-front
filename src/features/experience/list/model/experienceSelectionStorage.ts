export type ExperienceSelection =
  | { kind: 'experience'; id: string }
  | { kind: 'group'; id: string }
  | null;

const STORAGE_KEY = 'folioo:experience-map:selection:v1';

export function readExperienceSelection(
  ownerKey: string | undefined,
): ExperienceSelection | undefined {
  if (!ownerKey || typeof window === 'undefined') return undefined;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const saved = JSON.parse(raw) as {
      ownerKey?: string;
      selection?: unknown;
    };
    if (saved.ownerKey !== ownerKey) return undefined;
    if (saved.selection === null) return null;
    const selection = saved.selection;
    if (
      selection &&
      typeof selection === 'object' &&
      'kind' in selection &&
      'id' in selection &&
      (selection.kind === 'experience' || selection.kind === 'group') &&
      typeof selection.id === 'string'
    )
      return { kind: selection.kind, id: selection.id };
  } catch {
    // 저장소를 사용할 수 없으면 기존 첫 활동 선택 규칙을 따른다.
  }
  return undefined;
}

export function saveExperienceSelection(
  ownerKey: string | undefined,
  selection: ExperienceSelection,
) {
  if (!ownerKey || typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ownerKey, selection }),
    );
  } catch {
    // 저장에 실패해도 현재 탭의 선택 동작은 계속 가능해야 한다.
  }
}
