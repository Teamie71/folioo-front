import { redirect } from 'next/navigation';
import { buildWorkspaceHref } from '@/features/experience/workspace/model/workspaceView';

export default function ExperiencePage() {
  // 임시 조치: 맵 뷰 비활성화 기간에는 리스트 뷰로 보낸다.
  // 복구 시 아래 주석 처리된 원래 리다이렉트로 되돌리면 된다.
  redirect(buildWorkspaceHref('list'));
  // redirect(buildWorkspaceHref('map'));
}
