'use client';

import { useRouter } from 'next/navigation';
import { OBTRedirectModal } from '@/components/OBT/OBTRedirectModal';

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

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
