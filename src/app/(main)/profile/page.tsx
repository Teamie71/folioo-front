import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { isTopupMobileUserAgent } from '@/utils/device';
import ProfileClientMobile from './ProfileClientMobile';

export default async function ProfilePage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = isTopupMobileUserAgent(userAgent);

  if (!isMobile) {
    redirect('/');
  }

  return <ProfileClientMobile />;
}
