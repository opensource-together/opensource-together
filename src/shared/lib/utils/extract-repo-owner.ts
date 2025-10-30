/**
 * Extracts the owner of a repository from a repository URL.
 * @param repositoryUrl - The URL of the repository.
 * @returns The owner of the repository.
 */
export function extractRepositoryOwner(
  repositoryUrl?: string | null
): string | null {
  if (!repositoryUrl) return null;

  const trimmed = repositoryUrl.trim();
  if (!trimmed) return null;

  // Remove protocol and potential trailing .git suffix
  const normalized = trimmed
    .replace(/^[a-zA-Z]+:\/\/[^/]+\//, "")
    .replace(/^git@[^:]+:/, "")
    .replace(/\.git$/, "")
    .trim();

  const segments = normalized.split("/");

  if (segments.length < 2) {
    return null;
  }

  const [ownerCandidate] = segments;

  if (!ownerCandidate) {
    return null;
  }

  // Allow alphanumeric, dashes, underscores (typical GitHub/GitLab owner slugs)
  const ownerMatch = ownerCandidate.match(/^[\w-]+$/i);

  return ownerMatch ? ownerCandidate : null;
}
