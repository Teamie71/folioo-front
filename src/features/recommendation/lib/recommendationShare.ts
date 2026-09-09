export function buildRecommendationResultLoginRedirect(
  uuid?: string | null,
): string {
  const trimmedUuid = uuid?.trim();
  if (trimmedUuid) {
    return `/recommendation/result?uuid=${encodeURIComponent(trimmedUuid)}`;
  }
  return '/recommendation/result';
}

export function buildRecommendationShareUrl(
  origin: string,
  uuid: string,
  name?: string | null,
): string {
  const params = new URLSearchParams({ uuid });
  const trimmedName = name?.trim();
  if (trimmedName) {
    params.set('name', trimmedName);
  }
  return `${origin}/recommendation/share?${params.toString()}`;
}

export function resolveRecommendationDisplayName({
  isShare,
  shareName,
  isLoggedIn,
  profileName,
  resultUserName,
}: {
  isShare: boolean;
  shareName?: string | null;
  isLoggedIn: boolean;
  profileName?: string | null;
  resultUserName?: string | null;
}): string {
  const fromShareQuery = shareName?.trim();
  if (isShare && fromShareQuery) {
    return fromShareQuery;
  }

  if (isShare) {
    return resultUserName?.trim() || 'OOO';
  }

  const fromProfile = profileName?.trim();
  if (isLoggedIn && fromProfile) {
    return fromProfile;
  }

  return resultUserName?.trim() || 'OOO';
}
