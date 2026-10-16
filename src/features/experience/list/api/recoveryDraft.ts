import type { GuestDraft } from './guestDraft';

// 게스트 초안과 분리한다. 재로그인 후 기존 서버 데이터에 자동 병합하지 않는다.
const KEY = 'experience_map_recovery_v1';
let memory: GuestDraft | null = null;
export function saveRecoveryDraft(draft: GuestDraft) {
  memory = draft;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    /* 메모리 사본 유지 */
  }
}
export function readRecoveryDraft(): GuestDraft | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) {
      const draft = JSON.parse(raw) as GuestDraft;
      if (Array.isArray(draft.groups) && Array.isArray(draft.experiences))
        return draft;
    }
  } catch {
    /* 메모리 사본 사용 */
  }
  return memory;
}
export function clearRecoveryDraft() {
  memory = null;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* 무시 */
  }
}
