import type { UserProfileResDTO } from '@/api/models';
import { userControllerGetProfile } from '@/api/endpoints/user/user';

/** 사용자 프로필 조회 */
export async function getMe(): Promise<UserProfileResDTO> {
  const res = await userControllerGetProfile({ credentials: 'include' });
  const body = res.data as { isSuccess?: boolean; result?: UserProfileResDTO };
  if (res.status === 200 && body?.isSuccess && body?.result != null) {
    return body.result;
  }
  throw new Error('프로필을 불러오는데 실패했습니다.');
}
