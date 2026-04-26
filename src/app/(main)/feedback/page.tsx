import type { Metadata } from 'next';
import { SITE_URL } from '@/constants/seo';
import { BackButton } from '@/components/BackButton';
import { FeedbackForm } from '@/features/feedback/components/FeedbackForm';

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
    <main className='flex flex-col gap-[4.5rem] pb-[15rem]'>
      <div className='bg-sub1 mx-auto flex h-[15.625rem] w-full min-w-[66rem] flex-col justify-center'>
        <div className='mx-auto w-full max-w-[66rem] min-w-[66rem] px-6'>
          <div className='flex items-start gap-6'>
            <BackButton className='shrink-0' />
            <div className='flex min-w-0 flex-col gap-6'>
              <h1 className='typo-h3'>Folioo 사용 후기</h1>
              <p className='typo-b2-sb text-main'>
                사용 후기 남기고, 무료 이용권 2종 받으세요!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto flex w-full max-w-[66rem] min-w-[66rem] flex-col px-6'>
        <FeedbackForm />
      </div>
    </main>
  );
}
