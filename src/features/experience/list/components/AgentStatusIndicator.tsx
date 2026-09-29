import AgentStatusSpinner from '@/components/icons/agent/AgentStatusSpinner';
import type { AgentStatus } from '@/features/experience/list/model/agentStatusStore';

export function agentStatusLabel(kind: AgentStatus['kind'] | undefined) {
  if (kind === 'working') return '작업 진행 중';
  if (kind === 'success') return '성공 응답 수신';
  if (kind === 'error') return '실패 응답 수신';
  return null;
}

export function AgentStatusIndicator({
  kind,
}: {
  kind: AgentStatus['kind'] | undefined;
}) {
  if (kind === 'working')
    return (
      <span
        aria-hidden
        className='ml-[10px] inline-flex size-[12px] shrink-0 motion-safe:animate-spin motion-reduce:animate-none'
      >
        <AgentStatusSpinner />
      </span>
    );
  if (kind === 'success' || kind === 'error')
    return (
      <span
        aria-hidden
        className={`${kind === 'success' ? 'bg-success' : 'bg-error'} ml-[14px] size-[6px] shrink-0 rounded-full opacity-60`}
      />
    );
  return null;
}
