import type {
  ContributionGraph,
  ContributionLevel,
} from "@/features/profile/types/github-graph.type";
import type { UserPullRequest } from "@/features/profile/types/profile.pull-request.type";
import type { Profile } from "@/features/profile/types/profile.type";
import type { GitUserRepositoryType } from "@/shared/types/git-repository.type";

import { categories, techStacks } from "./taxonomy.mock";

const LEVELS: ContributionLevel[] = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
];

const LEVEL_COLORS: Record<ContributionLevel, string> = {
  NONE: "#ebedf0",
  FIRST_QUARTILE: "#9be9a8",
  SECOND_QUARTILE: "#40c463",
  THIRD_QUARTILE: "#30a14e",
  FOURTH_QUARTILE: "#216e39",
};

function buildContributionGraph(): ContributionGraph {
  const weeks = [];
  let total = 0;
  let maxContributions = 0;
  const start = new Date("2025-01-01T00:00:00.000Z");

  for (let w = 0; w < 53; w++) {
    const contributionDays = [];
    for (let d = 0; d < 7; d++) {
      const dayIndex = w * 7 + d;
      const count =
        d === 0 || d === 6
          ? Math.floor(Math.random() * 4)
          : Math.floor(Math.random() * 13);
      const level = LEVELS[Math.min(4, Math.floor(count / 3))];
      const date = new Date(start);
      date.setUTCDate(start.getUTCDate() + dayIndex);
      total += count;
      maxContributions = Math.max(maxContributions, count);
      contributionDays.push({
        color: LEVEL_COLORS[level],
        contributionCount: count,
        contributionLevel: level,
        date: date.toISOString().slice(0, 10),
      });
    }
    weeks.push({ contributionDays });
  }

  return { totalContributions: total, maxContributions, weeks };
}

const contributionGraph = buildContributionGraph();

export const CURRENT_USER_ID = "usr_9f2c1a7b4d6e4f8a9b0c1d2e3f4a5b6c";

export const currentUser: Profile = {
  id: CURRENT_USER_ID,
  name: "Ada Lovelace",
  email: "ada@example.com",
  emailVerified: true,
  image: "https://avatars.githubusercontent.com/u/583231?v=4",
  banner: null,
  jobTitle: "Full-stack Engineer",
  bio: "Building developer tools. Occasional Rust enjoyer. Maintainer of a few small OSS libraries.",
  provider: "github",
  contributionsCount: contributionGraph.totalContributions,
  createdAt: "2024-03-11T09:24:00.000Z",
  updatedAt: "2025-11-02T16:45:00.000Z",
  githubUrl: "https://github.com/ada",
  twitterUrl: "https://x.com/ada",
  linkedinUrl: "https://linkedin.com/in/ada",
  websiteUrl: "https://ada.dev",
  connectedProviders: ["github"],
  betaTester: true,
  userTechStacks: [techStacks[0], techStacks[6], techStacks[7], techStacks[8]],
  userCategories: [categories[0], categories[1]],
  userTechStacksIds: [techStacks[0].id, techStacks[6].id],
  userExperiences: [
    {
      title: "Senior Frontend Engineer @ Acme",
      startAt: "2023-01-01T00:00:00.000Z",
      endAt: null,
      url: "https://acme.example",
    },
    {
      title: "Frontend Engineer @ Globex",
      startAt: "2020-06-01T00:00:00.000Z",
      endAt: "2022-12-31T00:00:00.000Z",
      url: null,
    },
  ],
  githubStats: {
    commitsThisYear: contributionGraph.totalContributions,
    contributedRepos: 37,
    totalStars: 2140,
    contributionGraph,
  },
  contributionGraph,
};

export const otherUser: Profile = {
  ...currentUser,
  id: "usr_1111aaaa2222bbbb3333cccc4444dddd",
  name: "Grace Hopper",
  email: undefined,
  image: "https://avatars.githubusercontent.com/u/1024025?v=4",
  jobTitle: "Systems Engineer",
  bio: "Compilers, debuggers, and a healthy distrust of magic constants.",
  githubUrl: "https://github.com/grace",
  betaTester: false,
};

export const users = [currentUser, otherUser];

export const userRepositories: GitUserRepositoryType[] = [
  {
    name: "steel-browser",
    description: "Open Source Browser API for AI Agents & Apps",
    stargazers_count: 4820,
    forks_count: 312,
    open_issues_count: 47,
    url: "https://api.github.com/repos/ada/steel-browser",
    logo_url: null,
    html_url: "https://github.com/ada/steel-browser",
    created_at: "2024-01-15T10:00:00.000Z",
    updated_at: "2025-11-20T14:32:00.000Z",
    pushed_at: "2025-11-20T14:32:00.000Z",
  },
  {
    name: "tiny-router",
    description: "A 900-byte client-side router with no dependencies",
    stargazers_count: 640,
    forks_count: 28,
    open_issues_count: 5,
    url: "https://api.github.com/repos/ada/tiny-router",
    logo_url: null,
    html_url: "https://github.com/ada/tiny-router",
    created_at: "2023-08-02T08:11:00.000Z",
    updated_at: "2025-09-14T11:02:00.000Z",
    pushed_at: "2025-09-14T11:02:00.000Z",
  },
  {
    name: "dotfiles",
    description: null,
    stargazers_count: 12,
    forks_count: 2,
    open_issues_count: 0,
    url: "https://api.github.com/repos/ada/dotfiles",
    logo_url: null,
    html_url: "https://github.com/ada/dotfiles",
    created_at: "2021-02-20T19:45:00.000Z",
    updated_at: "2025-06-01T07:20:00.000Z",
    pushed_at: "2025-06-01T07:20:00.000Z",
  },
];

export const pullRequests = [
  {
    title: "fix(router): avoid double navigation on rapid clicks",
    repository: "steel-dev/steel-browser",
    owner: "steel-dev",
    state: "open",
    draft: false,
    number: 412,
    created_at: "2025-10-02T09:15:00.000Z",
    updated_at: "2025-10-04T12:00:00.000Z",
    closed_at: null,
    merged_at: null,
    url: "https://github.com/steel-dev/steel-browser/pull/412",
    branch: { from: "fix/double-navigation", to: "main" },
  },
  {
    title: "feat: add sanitizer to markdown renderer",
    repository: "steel-dev/steel-browser",
    owner: "steel-dev",
    state: "closed",
    draft: false,
    number: 388,
    created_at: "2025-08-19T14:22:00.000Z",
    updated_at: "2025-08-22T10:05:00.000Z",
    closed_at: "2025-08-22T10:05:00.000Z",
    merged_at: "2025-08-22T10:05:00.000Z",
    url: "https://github.com/steel-dev/steel-browser/pull/388",
    branch: { from: "feat/markdown-sanitizer", to: "main" },
  },
] satisfies UserPullRequest[];
