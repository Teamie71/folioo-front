/**
 * 주간 이용권 지급 관련 유틸리티 함수
 */

const STORAGE_KEY = 'weeklyVoucherLastGrantedWeek';

/**
 * 현재 날짜의 주차(월요일 기준)를 반환합니다.
 * YYYY-MM-DD 형식의 월요일 날짜를 반환 (예: "2024-01-01")
 */
export function getCurrentWeekKey(): string {
  const now = new Date();
  
  // 월요일을 주의 시작으로 설정
  const dayOfWeek = now.getDay(); // 0(일) ~ 6(토)
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 월요일로 조정
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  
  // YYYY-MM-DD 형식으로 반환
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const date = String(monday.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${date}`;
}

/**
 * 마지막으로 이용권을 지급한 주차를 반환합니다.
 */
export function getLastGrantedWeek(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * 마지막 이용권 지급 주차를 저장합니다.
 */
export function setLastGrantedWeek(weekKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, weekKey);
  } catch {
    // ignore
  }
}

/**
 * 이번 주에 이용권을 지급해야 하는지 확인합니다.
 */
export function shouldGrantWeeklyVoucher(): boolean {
  const currentWeek = getCurrentWeekKey();
  const lastGrantedWeek = getLastGrantedWeek();
  
  // 처음 접속하거나 이번 주에 아직 지급하지 않은 경우
  if (!lastGrantedWeek || lastGrantedWeek !== currentWeek) {
    return true;
  }
  
  return false;
}

/**
 * 이용권 지급을 완료 처리합니다.
 */
export function markWeeklyVoucherGranted(): void {
  const currentWeek = getCurrentWeekKey();
  setLastGrantedWeek(currentWeek);
}

