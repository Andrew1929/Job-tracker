import { AUTH_SESSION } from "@/constants/auth.constants";

/**
 * How long to wait before refreshing a token that expires at `expiryMs`.
 *
 * Refresh happens a lead time before expiry so an in-flight request never
 * carries a token that dies mid-flight. A token that is already inside its
 * lead window refreshes immediately rather than being reported as overdue,
 * which is what keeps a returning tab from firing a burst of refreshes.
 */
export function msUntilRefresh(
  expiryMs: number | null,
  nowMs: number,
  leadMs: number = AUTH_SESSION.refreshLeadMs,
): number | null {
  if (expiryMs === null) {
    return null;
  }

  return Math.max(0, expiryMs - leadMs - nowMs);
}

/** True once the token has entered its lead window and should be replaced. */
export function isRefreshDue(
  expiryMs: number | null,
  nowMs: number,
  leadMs: number = AUTH_SESSION.refreshLeadMs,
): boolean {
  return expiryMs !== null && expiryMs - leadMs <= nowMs;
}
