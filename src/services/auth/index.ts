import { refreshSession } from '@/lib/axios';

/** refreshToken 쿠키로 세션을 복원한다. 동시 호출은 하나로 합친다. */
export const refreshAccessToken = refreshSession;
