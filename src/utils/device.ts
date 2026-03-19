const TOPUP_MOBILE_UA_PATTERN =
  /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i;

export function isTopupMobileUserAgent(
  userAgent: string | null | undefined,
): boolean {
  return TOPUP_MOBILE_UA_PATTERN.test(userAgent ?? '');
}
