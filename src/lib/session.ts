// Browser-scoped pseudo-user id, stored in localStorage. Soft tenancy key for the demo.
// Replace with real auth (auth.uid()) later.

const KEY = "stocksense.session_id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr-no-session";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}