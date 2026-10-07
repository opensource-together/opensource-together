import { EXTERNAL_LINKS } from "@/shared/lib/constants";

const GITHUB_REPO_API_URL = EXTERNAL_LINKS.GITHUB_REPO.replace(
  "https://github.com/",
  "https://api.github.com/repos/"
);

export async function getGithubRepoStars(): Promise<number | null> {
  try {
    const response = await fetch(GITHUB_REPO_API_URL, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const data: { stargazers_count?: number } = await response.json();
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
}
