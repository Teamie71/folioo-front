/**
 * 직무/기업 표시명 매칭용 키
 */
export function normalizeRecommendationIconKey(name: string): string {
  return name
    .trim()
    .normalize('NFC')
    .replace(/\s+/g, '')
    .replace(/[·･・]/g, '/')
    .replace(/\.(?=[\uAC00-\uD7A3])/g, '/')
    .replace(/^\d+/, '');
}

export function buildNormalizedIconMap(
  byName: Record<string, string>,
): Map<string, string> {
  const map = new Map<string, string>();
  for (const [name, src] of Object.entries(byName)) {
    const key = normalizeRecommendationIconKey(name);
    if (!map.has(key)) map.set(key, src);
  }
  return map;
}
