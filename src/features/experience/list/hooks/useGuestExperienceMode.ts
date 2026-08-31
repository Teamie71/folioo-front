'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveGuestDraft } from '@/features/experience/list/api/guestDraft';
import { useGuestLeaveGuard } from '@/features/experience/list/hooks/useGuestLeaveGuard';
import { useExperienceListStore } from '@/store/useExperienceListStore';

/**
 * 비로그인 상태에서 필요한 안내(스낵바 0-1)와 이탈 방지(모달 0-2)를 한데 묶는다.
 *
 * 로그인으로 넘어갈 때는 편집 내용을 저장해 두고, 로그인 후 돌아오면 서버에 반영한다.
 * (화면설계서: "로그인 이후 본 페이지로 돌아왔을 때 이전의 편집 내용이 모두 저장된다")
 */
export function useGuestExperienceMode(isGuest: boolean) {
  const router = useRouter();
  const groups = useExperienceListStore((s) => s.groups);
  const experiences = useExperienceListStore((s) => s.experiences);

  const [snackbarDismissed, setSnackbarDismissed] = useState(false);
  const leaveGuard = useGuestLeaveGuard(isGuest);

  // 로그인하지 않는 한 계속 떠 있고, X를 누르면 사라진다.
  const snackbarOpen = isGuest && !snackbarDismissed;

  useEffect(() => {
    if (!isGuest) setSnackbarDismissed(false);
  }, [isGuest]);

  /** 편집 내용을 저장해 두고 로그인 페이지로 보낸다. 로그인 후 이 페이지로 돌아온다. */
  const goToLogin = useCallback(() => {
    saveGuestDraft({ groups, experiences });
    const redirectTo = `${window.location.pathname}${window.location.search}`;
    router.push(`/login?redirect_to=${encodeURIComponent(redirectTo)}`);
  }, [groups, experiences, router]);

  return {
    snackbarOpen,
    dismissSnackbar: () => setSnackbarDismissed(true),
    goToLogin,
    leaveGuardOpen: leaveGuard.open,
    onLeaveGuardOpenChange: (open: boolean) => {
      if (!open) leaveGuard.cancel();
    },
    onLeave: leaveGuard.leave,
  };
}
