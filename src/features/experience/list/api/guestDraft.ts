import type { Experience, Group } from '@/features/experience/list/types';

const DRAFT_KEY = 'experience_map_guest_draft';

export type GuestDraft = {
  groups: Group[];
  experiences: Experience[];
};

/**
 * 비로그인 편집 내용 임시 보관.
 *
 * 로그인하러 가기 전에 담아 두었다가, 돌아왔을 때 서버에 옮긴다.
 * (탭을 닫으면 사라지도록 sessionStorage를 쓴다 — 어차피 서버에 없는 내용이다)
 */
export function saveGuestDraft(draft: GuestDraft) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // 저장 공간이 없으면 포기한다. 이탈 방지 모달에서 이미 안내했다.
  }
}

export function readGuestDraft(): GuestDraft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GuestDraft;
    if (!Array.isArray(parsed.groups) || !Array.isArray(parsed.experiences)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearGuestDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // 무시
  }
}
