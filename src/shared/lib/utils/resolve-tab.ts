export function resolveTab(
  requestedTab: string | null,
  defaultTab: string,
  allowedTabs: readonly string[]
): string {
  if (requestedTab && allowedTabs.includes(requestedTab)) {
    return requestedTab;
  }

  return defaultTab;
}
