import { AUTH_TOKEN_STORAGE_KEYS } from "@/constants/auth.constants";

/**
 * Same-tab notification that the session is over. The API client can end a
 * session from outside React, and this is how the provider hears about it
 * without a second authentication state layer.
 */
export const SESSION_ENDED_EVENT = "job-tracker:session-ended";

export function emitSessionEnded(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(SESSION_ENDED_EVENT));
}

/**
 * Cross-tab notification. `storage` only fires in the *other* tabs, so a tab
 * that clears its tokens tells every sibling tab the session is gone.
 */
export function isSessionEndedStorageEvent(
  event: Pick<StorageEvent, "key" | "newValue">,
): boolean {
  return event.key === AUTH_TOKEN_STORAGE_KEYS.accessToken && !event.newValue;
}
