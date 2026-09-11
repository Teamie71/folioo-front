import type { AssessmentResultResDTO } from '@/api/models';
import { HOLLAND_TYPES } from '@/features/recommendation/constants';
import { getMajorFieldLabel } from '@/features/recommendation/lib/majorField';
import { getValueKindLabel } from '@/features/recommendation/lib/valueKind';
import type {
  HollandCode,
  HollandScores,
  HollandTypeResult,
  RecommendationResultData,
  WorkConditionRank,
} from '@/features/recommendation/types';

const TRAIT_TO_CODE: Record<string, HollandCode> = {
  REALISTIC: 'R',
  INVESTIGATIVE: 'I',
  ARTISTIC: 'A',
  SOCIAL: 'S',
  ENTERPRISING: 'E',
  CONVENTIONAL: 'C',
  R: 'R',
  I: 'I',
  A: 'A',
  S: 'S',
  E: 'E',
  C: 'C',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value != null && !Array.isArray(value);
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function splitHeadline(headline: string): readonly [string, string] {
  const parts = headline
    .split(/\n|<br\s*\/?>/i)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return [parts[0], parts.slice(1).join(' ')] as const;
  }

  const tokens = headline.trim().split(/\s+/);
  if (tokens.length >= 4) {
    const mid = Math.ceil(tokens.length / 2);
    return [tokens.slice(0, mid).join(' '), tokens.slice(mid).join(' ')] as const;
  }

  return [headline.trim() || '나에게 맞는', '직무를 찾았어요'] as const;
}

function mapTraitVector(raw: unknown): {
  scores: HollandScores;
  types: HollandTypeResult[];
} {
  const scores: HollandScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  if (isRecord(raw)) {
    for (const [key, value] of Object.entries(raw)) {
      const code = TRAIT_TO_CODE[key];
      const num = asNumber(value);
      if (code && num != null) scores[code] = num;
    }
  }

  const max = Math.max(...Object.values(scores), 1);
  const normalized: HollandScores = {
    R: scores.R / max,
    I: scores.I / max,
    A: scores.A / max,
    S: scores.S / max,
    E: scores.E / max,
    C: scores.C / max,
  };

  const ranked = (Object.entries(normalized) as [HollandCode, number][])
    .sort((a, b) => b[1] - a[1])
    .filter(([, score]) => score > 0);

  const topScore = ranked[0]?.[1] ?? 0;
  const types = ranked
    .filter(([, score]) => score >= topScore * 0.85)
    .slice(0, 3)
    .map(([code]) => {
      const meta = HOLLAND_TYPES.find((type) => type.code === code);
      return {
        code,
        name: meta?.name ?? code,
        description: meta?.description ?? '',
      };
    });

  return {
    scores: normalized,
    types:
      types.length > 0
        ? types
        : [
            {
              code: 'C',
              name: HOLLAND_TYPES.find((t) => t.code === 'C')?.name ?? '체계형 (C)',
              description:
                HOLLAND_TYPES.find((t) => t.code === 'C')?.description ?? '',
            },
          ],
  };
}

function mapWorkConditions(
  ranking: AssessmentResultResDTO['valueRanking'],
): WorkConditionRank[] {
  return ranking.slice(0, 3).map((kind, index) => ({
    rank: (index + 1) as 1 | 2 | 3,
    label: getValueKindLabel(kind),
  }));
}

function asDisplayString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  return fallback;
}

export function mapAssessmentResult(
  dto: AssessmentResultResDTO,
): RecommendationResultData & { locked: boolean; uuid: string } {
  const holland = mapTraitVector(dto.traitVector as unknown);

  return {
    uuid: dto.uuid,
    locked: false,
    userName: 'OOO',
    headline: splitHeadline(dto.headline || ''),
    major: getMajorFieldLabel(dto.majorField),
    holland,
    workConditions: mapWorkConditions(dto.valueRanking),
    jobs: (dto.topJobs ?? []).map((job) => ({
      id: job.code,
      name: asDisplayString(job.name, job.code),
      fitPercent: String(Math.round(job.matchRate)),
      intro: asDisplayString(job.summary),
      skills: job.coreSkills ?? [],
      activities: job.recommendedActivities ?? [],
    })),
    companies: dto.companyType
      ? [
          {
            id: dto.companyType.code,
            name: dto.companyType.name,
            features: dto.companyType.description,
            tip: asDisplayString(dto.companyType.tip),
          },
        ]
      : [],
  };
}
