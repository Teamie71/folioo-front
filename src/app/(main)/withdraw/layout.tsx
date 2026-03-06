import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회원탈퇴 - Folioo',
};

export default function WithdrawLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
