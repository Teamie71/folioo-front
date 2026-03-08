import type { InsightLogResDTO } from '@/api/models';
import type { LogCardData } from '@/store/useLogStore';

type InsightLogItem = InsightLogResDTO & { id?: number };

function toLocalDateString(createdAt: string | undefined): string {
  if (createdAt == null || createdAt === '') {
    const d = new Date();
    return d.toLocaleDateString('en-CA');
  }
  const d = new Date(createdAt);
  return d.toLocaleDateString('en-CA');
}

/* API 로그 응답(InsightLogResDTO) → 로그 카드 데이터. createdAt을 로컬 날짜로 표시 */
export function toLogCardData(result: InsightLogItem): LogCardData {
  const date = toLocalDateString(result.createdAt);
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
