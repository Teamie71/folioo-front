'use client';

import { useWindowSize } from '@/hooks/useWindowSize';
import ProfileClientMobile from './ProfileClientMobile';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { width } = useWindowSize();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (width >= 768) {
      router.push('/');
    }
  }, [width, router]);

  if (!isMounted) return null;

  const isMobile = width < 768;

  if (!isMobile) {
    return null;
  }

  return <ProfileClientMobile />;
}
