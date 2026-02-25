import type { InsightLogResDTO } from '@/api/models';
import type { LogCardData } from '@/store/useLogStore';

/* API 로그 생성 응답(InsightLogResDTO) → 스토어 LogCardData */
export function toLogCardData(
  result: InsightLogResDTO & { id?: number },
): LogCardData {
  const date =
    result.createdAt?.split('T')[0] ?? new Date().toISOString().split('T')[0];
  return {
    id: result.id != null ? String(result.id) : `${date}-${result.title}`,
    title: result.title,
    activityName: result.activityNames?.[0] ?? '미분류',
    category: result.category,
    content: result.description,
    date,
  };
}
