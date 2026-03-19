'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';

export default function TermsClient({ children }: { children: ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
