'use client';

import LayoutContent from '@/components/LayoutContent';
import { CommonErrorLayout } from '@/components/error/CommonErrorLayout';

export default function NotFoundClient() {
  return (
    <LayoutContent>
      <CommonErrorLayout />
    </LayoutContent>
  );
}
