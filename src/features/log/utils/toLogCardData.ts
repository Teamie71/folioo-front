import type { InsightLogResDTO } from '@/api/models';
import type { LogCardData } from '@/store/useLogStore';

type InsightLogItem = InsightLogResDTO & { id?: number };

/* API 로그 응답(InsightLogResDTO) → 로그 카드 데이터 */
export function toLogCardData(result: InsightLogItem): LogCardData {
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

/* 로그 목록 조회 API result[] → LogCardData[] */
export function toLogCardDataList(items: InsightLogItem[]): LogCardData[] {
  return items.map(toLogCardData);
}
