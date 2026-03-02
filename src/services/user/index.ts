import type {
  UserProfileResDTO,
  UserControllerGetProfile200,
} from '@/api/models';
import { userControllerGetProfile } from '@/api/endpoints/user/user';

/** 사용자 프로필 조회 */
export async function getMe(): Promise<UserProfileResDTO> {
  const res = (await userControllerGetProfile({
    withCredentials: true,
  })) as UserControllerGetProfile200;
  if (res?.isSuccess && res?.result != null) {
    return res.result;
  }
  throw new Error('프로필을 불러오는데 실패했습니다.');
}
