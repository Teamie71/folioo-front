import type { Metadata } from 'next';
import { SITE_URL } from '@/constants/seo';
import { BackButton } from '@/components/BackButton';
import { FeedbackForm } from '@/features/feedback/components/FeedbackForm';
import { FEEDBACK_REWARD_HEADLINE } from '@/features/feedback/constants';

export const metadata: Metadata = {
  title: 'Folioo 사용 후기 - Folioo',
  description:
    'Folioo 사용 후기를 남겨주시면 서비스 개선과 더 나은 경험을 만드는 데 큰 도움이 됩니다.',
  openGraph: {
    title: 'Folioo 사용 후기 - Folioo',
    description:
      'Folioo 사용 후기를 남겨주시면 서비스 개선과 더 나은 경험을 만드는 데 큰 도움이 됩니다.',
    url: `${SITE_URL}/feedback`,
    siteName: 'Folioo',
    images: ['/OGImage.svg'],
    locale: 'ko_KR',
  },
};

export default function FeedbackPage() {
  return (
    <main className='flex min-w-0 flex-col gap-10 pb-[6.25rem] md:gap-[4.5rem]'>
      <div className='bg-sub1 mx-auto flex w-full flex-col justify-center py-8 md:h-[10.9375rem] md:pb-0'>
        <div className='mx-auto w-full max-w-[66rem] px-4 md:px-6'>
          <div className='flex items-start gap-6'>
            <BackButton className='hidden shrink-0 md:block' />
            <div className='flex min-w-0 flex-col gap-4 md:gap-6'>
              <h1 className='typo-h3'>Folioo 사용 후기</h1>
              <p className='typo-b2-sb text-main'>{FEEDBACK_REWARD_HEADLINE}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto flex w-full max-w-[66rem] flex-col px-4 md:px-6'>
        <FeedbackForm />
      </div>
    </main>
  );
}
