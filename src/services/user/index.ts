import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types/api/common';
import type { UserProfile } from '@/types/api/user';

/** 사용자 프로필 조회 */
export async function getMe(): Promise<UserProfile> {
  const response = await apiClient.get<ApiResponse<UserProfile>>('/users/me');

  if (response.data.isSuccess && response.data.result != null) {
    return response.data.result;
  }

  throw new Error('프로필을 불러오는데 실패했습니다.');
}
