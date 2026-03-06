'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { OBTRedirectModal } from '@/components/OBT/OBTRedirectModal';

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    document.title = pathname?.includes('refund')
      ? '환불 신청 - Folioo'
      : '이용권 거래 내역 - Folioo';
  }, [pathname]);

  return (
    <>
      <OBTRedirectModal
        open={true}
        onOpenChange={(open) => {
          if (!open) router.back();
        }}
      />
    </>
  );
}
