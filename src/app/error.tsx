'use client';

import { CommonErrorLayout } from '@/components/error/CommonErrorLayout';

export default function Error({
  error: _error,
  reset: _reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <CommonErrorLayout />;
}
