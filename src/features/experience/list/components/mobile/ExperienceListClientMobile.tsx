'use client';

import { useCallback, useEffect, useState } from 'react';
import { useExperienceListStore } from '@/store/useExperienceListStore';
import { MobileExperienceListGroup } from '@/features/experience/list/components/mobile/MobileExperienceListGroup';
import { MobileExperienceListModals } from '@/features/experience/list/components/mobile/MobileExperienceListModals';
import { MobileExperienceDetail } from '@/features/experience/list/components/mobile/MobileExperienceDetail';
import { MobileGroupDetail } from '@/features/experience/list/components/mobile/MobileGroupDetail';
import { useSidebarDnd } from '@/features/experience/list/hooks/useSidebarDnd';
import { useExperienceMap } from '@/features/experience/list/hooks/useExperienceMap';
import { useGuestExperienceMode } from '@/features/experience/list/hooks/useGuestExperienceMode';
import { GuestLoginSnackbar } from '@/features/experience/list/components/GuestLoginSnackbar';
import { GuestLeaveGuardModal } from '@/features/experience/list/components/GuestLeaveGuardModal';
import {
  MOBILE_MODAL_CLS,
  MOBILE_MODAL_OVERLAY_CLS,
} from '@/features/experience/list/components/mobile/mobileModalStyles';

export default function ExperienceListClientMobile() {
  // GET /experience-map 으로 그룹·활동·블록 트리를 채운다. (비로그인은 기본 제공 데이터)
  const { isGuest } = useExperienceMap();
  const guest = useGuestExperienceMode(isGuest);

  const groups = useExperienceListStore((s) => s.groups);
  const experiences = useExperienceListStore((s) => s.experiences);
  const collapsedGroups = useExperienceListStore((s) => s.collapsedGroups);
  const selectExperience = useExperienceListStore((s) => s.selectExperience);

  const [detailExperienceId, setDetailExperienceId] = useState<string | null>(
    null,
  );
  const [detailGroupId, setDetailGroupId] = useState<string | null>(null);

  const dnd = useSidebarDnd();

  const openDetail = useCallback(
    (experienceId: string) => {
      selectExperience(experienceId);
      setDetailGroupId(null);
      setDetailExperienceId(experienceId);
    },
    [selectExperience],
  );

  const closeDetail = useCallback(() => {
    setDetailExperienceId(null);
  }, []);

  const openGroupDetail = useCallback((groupId: string) => {
    setDetailExperienceId(null);
    setDetailGroupId(groupId);
  }, []);

  const closeGroupDetail = useCallback(() => {
    setDetailGroupId(null);
  }, []);

  useEffect(() => {
    if (!detailExperienceId) return;
    const exists = experiences.some((e) => e.id === detailExperienceId);
    if (!exists) setDetailExperienceId(null);
  }, [detailExperienceId, experiences]);

  useEffect(() => {
    if (!detailGroupId) return;
    const group = groups.find((g) => g.id === detailGroupId);
    if (!group) {
      setDetailGroupId(null);
      return;
    }
    const hasExperiences = experiences.some((e) => e.groupId === detailGroupId);
    if (hasExperiences) setDetailGroupId(null);
  }, [detailGroupId, groups, experiences]);

  return (
    <div className='flex min-h-[100dvh] w-full flex-col bg-white'>
      <div className='flex flex-1 flex-col px-[16px] pt-[12px] pb-[40px]'>
        <h2 className='typo-c1-b text-gray6'>나의 경험</h2>

        <div className='mt-[8px] flex flex-col gap-[4px]'>
          {groups.map((group) => (
            <MobileExperienceListGroup
              key={group.id}
              group={group}
              groups={groups}
              groupExperiences={experiences.filter(
                (e) => e.groupId === group.id,
              )}
              collapsed={collapsedGroups[group.id] ?? false}
              dnd={dnd}
              onOpenExperience={openDetail}
              onOpenEmptyGroup={openGroupDetail}
            />
          ))}
        </div>
      </div>

      {detailGroupId && (
        <MobileGroupDetail
          groupId={detailGroupId}
          onBack={closeGroupDetail}
          onOpenExperience={openDetail}
        />
      )}

      {detailExperienceId && (
        <MobileExperienceDetail
          experienceId={detailExperienceId}
          onBack={closeDetail}
        />
      )}

      <MobileExperienceListModals />

      {/* 로그인 안내 스낵바 (0-1) — 하단 기준 40px 위 */}
      {guest.snackbarOpen && (
        <GuestLoginSnackbar
          onLogin={guest.goToLogin}
          onDismiss={guest.dismissSnackbar}
          className='fixed'
        />
      )}

      {/* 이탈 방지 모달 (0-2) */}
      <GuestLeaveGuardModal
        open={guest.leaveGuardOpen}
        onOpenChange={guest.onLeaveGuardOpenChange}
        onLogin={guest.goToLogin}
        onLeave={guest.onLeave}
        className={MOBILE_MODAL_CLS}
        overlayClassName={MOBILE_MODAL_OVERLAY_CLS}
      />
    </div>
  );
}
