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
  name: "Linus Torvalds",
  email: "linus@example.com",
  emailVerified: true,
  image: "/mocks/user-pfp.mock.jpg",
  banner: null,
  jobTitle: "Creator of Linux and Git",
  bio: "Building operating systems, version control, and the occasional strongly worded code review.",
  provider: "github",
  contributionsCount: contributionGraph.totalContributions,
  createdAt: "2024-01-17T09:00:00.000Z",
  updatedAt: "2026-08-15T09:28:21.000Z",
  githubUrl: "https://github.com/torvalds",
  websiteUrl: "https://kernel.org",
  connectedProviders: ["github"],
  betaTester: true,
  userTechStacks: [
    techStacks[14],
    techStacks[3],
    techStacks[21],
    techStacks[2],
  ],
  userCategories: [categories[1], categories[4]],
  userTechStacksIds: [
    techStacks[14].id,
    techStacks[3].id,
    techStacks[21].id,
    techStacks[2].id,
  ],
  userExperiences: [
    {
      title: "Creator & Maintainer of Linux",
      startAt: "1991-08-25T00:00:00.000Z",
      endAt: null,
      url: "https://kernel.org",
    },
    {
      title: "Creator of Git",
      startAt: "2005-04-07T00:00:00.000Z",
      endAt: null,
      url: "https://git-scm.com",
    },
  ],
  githubStats: {
    commitsThisYear: contributionGraph.totalContributions,
    contributedRepos: 3,
    totalStars: 18612,
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
    name: "mistral-common",
    description:
      "Official inference library for pre-processing of Mistral models",
    stargazers_count: 933,
    forks_count: 156,
    open_issues_count: 11,
    url: "https://api.github.com/repos/mistralai/mistral-common",
    logo_url: "https://avatars.githubusercontent.com/u/132372032?v=4",
    html_url: "https://github.com/mistralai/mistral-common",
    created_at: "2024-04-15T08:43:59.000Z",
    updated_at: "2026-08-13T04:57:07.000Z",
    pushed_at: "2026-08-06T15:58:19.000Z",
  },
  {
    name: "polar",
    description: "Polar — A billing platform for the intelligence era",
    stargazers_count: 10194,
    forks_count: 758,
    open_issues_count: 95,
    url: "https://api.github.com/repos/polarsource/polar",
    logo_url: "https://avatars.githubusercontent.com/u/105373340?v=4",
    html_url: "https://github.com/polarsource/polar",
    created_at: "2023-01-26T10:04:27.000Z",
    updated_at: "2026-08-15T01:12:47.000Z",
    pushed_at: "2026-08-15T07:27:10.000Z",
  },
  {
    name: "steel-browser",
    description: "Open Source Browser API for AI Agents & Apps",
    stargazers_count: 7485,
    forks_count: 965,
    open_issues_count: 57,
    url: "https://api.github.com/repos/steel-dev/steel-browser",
    logo_url: "https://avatars.githubusercontent.com/u/183960033?v=4",
    html_url: "https://github.com/steel-dev/steel-browser",
    created_at: "2024-11-01T18:15:29.000Z",
    updated_at: "2026-08-15T09:05:58.000Z",
    pushed_at: "2026-08-05T23:12:01.000Z",
  },
];

export const pullRequests = [
  {
    title: "Garmin: Report correct local time offset",
    repository: "libdc",
    owner: "subsurface",
    state: "closed",
    draft: false,
    number: 69,
    created_at: "2024-12-26T20:13:25.000Z",
    updated_at: "2024-12-28T03:03:04.000Z",
    closed_at: "2024-12-26T23:18:29.000Z",
    merged_at: "2024-12-26T23:18:29.000Z",
    url: "https://github.com/subsurface/libdc/pull/69",
    branch: { from: "garmin-localtime", to: "Subsurface-DS9" },
  },
  {
    title: "Fix sample times in dive merging",
    repository: "subsurface",
    owner: "subsurface",
    state: "closed",
    draft: false,
    number: 4301,
    created_at: "2024-08-28T04:57:02.000Z",
    updated_at: "2024-08-28T08:35:27.000Z",
    closed_at: "2024-08-28T08:35:26.000Z",
    merged_at: "2024-08-28T08:35:26.000Z",
    url: "https://github.com/subsurface/subsurface/pull/4301",
    branch: { from: "fix-dive-merge", to: "master" },
  },
] satisfies UserPullRequest[];
