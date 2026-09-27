import Image from 'next/image';
import type { UserSocialAccountResDTO } from '@/api/models/userSocialAccountResDTO';
import type { UserSocialAccountResDTOSocialType } from '@/api/models/userSocialAccountResDTOSocialType';
import { cn } from '@/utils/utils';

const SOCIAL_ACCOUNTS: {
  type: UserSocialAccountResDTOSocialType;
  logo: string;
  label: string;
}[] = [
  { type: 'KAKAO', logo: '/KakaoEmailLogo.svg', label: 'Kakao' },
  { type: 'NAVER', logo: '/NaverEmailLogo.svg', label: 'Naver' },
  { type: 'GOOGLE', logo: '/GoogleEmailLogo.svg', label: 'Google' },
];

/** PC와 모바일 모두 연결된 소셜 계정을 같은 순서로 표시한다. */
export function ProfileSocialAccounts({
  socialAccounts,
  textClassName,
  rowClassName,
}: {
  socialAccounts: UserSocialAccountResDTO[];
  textClassName?: string;
  rowClassName?: string;
}) {
  const byType = new Map(
    socialAccounts.map((account) => [account.socialType, account]),
  );
  const connectedAccounts = SOCIAL_ACCOUNTS.filter(({ type }) =>
    byType.has(type),
  );

  if (connectedAccounts.length === 0) return null;

  return (
    <div className='flex min-w-0 flex-col gap-1'>
      {connectedAccounts.map(({ type, logo, label }) => {
        const email = byType.get(type)?.socialEmail;
        return (
          <div
            key={type}
            className={cn('flex min-w-0 items-center gap-1', rowClassName)}
          >
            <Image
              src={logo}
              alt={label}
              width={20}
              height={20}
              className='shrink-0'
            />
            <span
              className={cn(
                'text-gray6 min-w-0 truncate',
                textClassName ?? 'text-[1rem] leading-[150%]',
              )}
            >
              {typeof email === 'string' && email ? email : '-'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
