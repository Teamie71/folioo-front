'use client';

import { CommonErrorLayout } from '@/components/error/CommonErrorLayout';
import LayoutContent from '@/components/LayoutContent';

export default function NotFoundClient({
  isMobileDevice,
}: {
  isMobileDevice: boolean;
}) {
  return (
    <LayoutContent isMobileDevice={isMobileDevice}>
      <CommonErrorLayout />
    </LayoutContent>
  );
}
