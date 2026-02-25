import apiClient from '@/lib/axios';
import type {
  ActivityNameReqDTO,
  ActivityNameResDTO,
  CreateInsightLogReqDTO,
  InsightControllerCreateActivityTag200,
  InsightControllerCreateLog200,
  InsightControllerGetActivityTags200,
  InsightControllerGetLogs200,
  InsightLogResDTO,
} from '@/api/models';
import type { CommonResponse } from '@/api/models';

/* 에러 메시지 반환 */
function getApiErrorMessage(err: unknown, defaultMessage: string): string {
  const res = (err as { response?: { data?: CommonResponse } })?.response?.data;
  if (typeof res?.error?.reason === 'string') return res.error.reason;
  return err instanceof Error ? err.message : defaultMessage;
}

/* 인사이트 로그 생성 (Orval 모델 사용, activityIds는 number[] 전달) */
export async function createInsightLog(
  body: Omit<CreateInsightLogReqDTO, 'activityIds'> & { activityIds: number[] },
): Promise<InsightLogResDTO> {
  try {
    const response = await apiClient.post<InsightControllerCreateLog200>(
      '/insights',
      body as unknown as CreateInsightLogReqDTO,
    );
    if (response.data.isSuccess && response.data.result != null) {
      return response.data.result;
    }
    const errorPayload = response.data.error as { reason?: string } | null;
    throw new Error(errorPayload?.reason ?? '로그 등록에 실패했습니다.');
  } catch (err: unknown) {
    throw new Error(getApiErrorMessage(err, '로그 등록에 실패했습니다.'));
  }
}

/* 활동 분류 태그 생성 (Orval ActivityNameReqDTO, 200 시 ActivityNameResDTO 반환, 409 중복) */
export async function createActivityTag(
  body: ActivityNameReqDTO,
): Promise<ActivityNameResDTO> {
  try {
    const response =
      await apiClient.post<InsightControllerCreateActivityTag200>(
        '/insights/tags',
        body,
      );
    if (response.data.isSuccess && response.data.result != null) {
      return response.data.result;
    }
    const errorPayload = response.data.error as { reason?: string } | null;
    throw new Error(errorPayload?.reason ?? '활동 태그 생성에 실패했습니다.');
  } catch (err: unknown) {
    throw new Error(getApiErrorMessage(err, '활동 태그 생성에 실패했습니다.'));
  }
}

/* 활동 분류 태그 목록 조회 (Orval ActivityNameResDTO[] 반환) */
export async function getActivityTags() {
  const response =
    await apiClient.get<InsightControllerGetActivityTags200>('/insights/tags');
  if (response.data.isSuccess && response.data.result != null) {
    return response.data.result;
  }
  throw new Error('활동 태그 목록을 불러오는데 실패했습니다.');
}

/* 로그 목록 조회 쿼리 파라미터 */
export interface GetLogsParams {
  keyword?: string;
  category?: string;
  activityId?: number;
}

/* 로그 목록 조회 (Orval InsightControllerGetLogs200, result는 InsightLogResDTO[]) */
export async function getLogs(
  params?: GetLogsParams,
): Promise<(InsightLogResDTO & { id?: number })[]> {
  const response = await apiClient.get<InsightControllerGetLogs200>(
    '/insights',
    { params: params ?? {} },
  );
  if (response.data.isSuccess && response.data.result != null) {
    return response.data.result;
  }
  throw new Error('로그 목록을 불러오는데 실패했습니다.');
}
