import Link from 'next/link';
import { FEEDBACK_PATH } from '@/constants/feedback';
import { AGENT_COMING_SOON_COPY as copy } from '@/features/experience/list/constants';

export function AgentComingSoon() {
  return (
    <div className='flex min-h-0 flex-1 flex-col overflow-y-auto px-[24px] py-[16px] text-center'>
      <div className='my-auto'>
        <p className='typo-b1-sb text-gray9'>
          {copy.titleFirstLine}
          <br />
          {copy.titleSecondLine}
        </p>
        <p className='typo-c2 text-gray9 mt-[20px]'>
          {copy.feedbackLead}
          <br />
          <Link
            href={FEEDBACK_PATH}
            className='text-main underline underline-offset-2'
          >
            {copy.feedbackLinkLabel}
          </Link>
          {copy.feedbackTail}
          <br />
          {copy.feedbackClosing}
        </p>
      </div>
    </div>
  );
}
