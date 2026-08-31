import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '경험 정리 - Folioo',
};

/*
 * 여기에는 로그인 가드를 두지 않는다.
 * 경험 정리(맵/리스트 뷰)는 비로그인 사용자도 조회·편집할 수 있고,
 * 수정 사항만 서버에 저장되지 않는다. (화면설계서 "페이지 권한")
 * 로그인이 필요한 하위 기능은 각자의 layout에서 막는다.
 */
export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
