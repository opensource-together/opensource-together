const KEY = "ost:whats-new:v1:seen-week";
const EVENT = "ost:whats-new:seen";
let seenInSession: string | null = null;

export function hasSeenWeek(id: string) {
  if (seenInSession === id) return true;
  try {
    return window.localStorage.getItem(KEY) === id;
  } catch {
    return false;
  }
}

export function markWeekSeen(id: string) {
  seenInSession = id;
  try {
    window.localStorage.setItem(KEY, id);
  } catch {
    // Keep dismissal working in this session when storage is unavailable.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeToSeenWeek(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
