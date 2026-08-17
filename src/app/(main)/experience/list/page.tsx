import { redirect } from 'next/navigation';
import { buildWorkspaceHref } from '@/features/experience/workspace/model/workspaceView';

/** 이전 경로 하위호환. 워크스페이스 리스트 뷰로 넘긴다. */
export default function ExperienceListPage() {
  redirect(buildWorkspaceHref('list'));
}
