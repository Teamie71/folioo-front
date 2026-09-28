import { redirect } from 'next/navigation';
import { buildWorkspaceHref } from '@/features/experience/workspace/model/workspaceView';

export default function ExperiencePage() {
  redirect(buildWorkspaceHref('map'));
}
