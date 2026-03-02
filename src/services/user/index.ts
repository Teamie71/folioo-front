import { userControllerGetProfile } from '@/api/endpoints/user/user';
import type { UserProfile } from '@/types/api/user';
import type { UserProfileResDTO } from '@/api/models/userProfileResDTO';
function toEmailString(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === 'string') return v || null;
  return null;
}

function mapProfile(dto: UserProfileResDTO): UserProfile {
  const first = dto.socialAccounts?.[0];
  const emailStr = toEmailString(first?.socialEmail);
  const primarySocialAccount = first
    ? {
        socialType: first.socialType,
        email: emailStr,
      }
    : undefined;

  return {
    name: dto.name,
    email: emailStr ?? '-',
    phoneNum: dto.phoneNum != null ? String(dto.phoneNum) : '-',
    isMarketingAgreed: dto.isMarketingAgreed ?? false,
    primarySocialAccount,
  };
}

/* 사용자 프로필 조회 */
export async function getMe(): Promise<UserProfile> {
  const res = await userControllerGetProfile();

  if (res?.isSuccess && res?.result != null) {
    return mapProfile(res.result);
  }

  throw new Error('프로필을 불러오는데 실패했습니다.');
}
