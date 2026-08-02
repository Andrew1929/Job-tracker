/**
 * Reads the `exp` claim so refresh can be scheduled against the token's real
 * lifetime instead of a second copy of the expiry configuration. The signature
 * is never trusted here: the value only decides *when* to refresh, and the
 * server remains the sole authority on whether a token is valid.
 */

type AccessTokenClaims = {
  exp?: number;
};

function decodeSegment(segment: string): string | null {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/");

  try {
    return atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
  } catch {
    return null;
  }
}

export function getAccessTokenExpiryMs(token: string | null): number | null {
  const payload = token?.split(".")[1];
  if (!payload) {
    return null;
  }

  const decoded = decodeSegment(payload);
  if (!decoded) {
    return null;
  }

  try {
    const claims = JSON.parse(decoded) as AccessTokenClaims;
    return typeof claims.exp === "number" ? claims.exp * 1000 : null;
  } catch {
    return null;
  }
}
