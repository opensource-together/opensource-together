import { Profile } from "../types/profileTypes";

export const mockProfiles: Profile[] = [
  {
    id: "1",
    login: "byronlove111",
    avatar_url:
      "https://pbs.twimg.com/profile_images/1813513692471779328/6RxAJKDu_400x400.jpg",
    html_url: "https://github.com/byronlove111",
    type: "User",
    site_admin: false,
    name: "Byron Love",
    bio: "Développeur fullstack passionné par la création de code clair et performant pour des expériences web modernes",
    location: "Paris, France",
    blog: "https://byronlove111.dev",
    company: "Freelance",
    public_repos: 32,
    followers: 412,
    following: 156,
    created_at: "2025-04-25T00:00:00Z",
    updated_at: "2024-03-19T00:00:00Z",
    contributions_count: 1268,
    skills: [
      {
        name: "Développeur Frontend",
        level: "EXPERT",
        badges: [
          {
            label: "Développeur Frontend",
            color: "#000000",
            bgColor: "#F3F3F3",
          },
        ],
      },
      {
        name: "Designer UX",
        level: "ADVANCED",
        badges: [
          { label: "Designer UX", color: "#F24E1E", bgColor: "#FFF0ED" },
        ],
      },
      {
        name: "Développeur Backend",
        level: "ADVANCED",
        badges: [
          {
            label: "Développeur Backend",
            color: "#339933",
            bgColor: "#E6F4EA",
          },
        ],
      },
    ],
    projects: [
      {
        id: "1",
        name: "devcord",
        full_name: "devcord-bot/devcord",
        description:
          "Bot Discord pour les développeurs avec des commandes intelligentes",
        html_url: "https://github.com/devcord-bot/devcord",
        homepage: "https://docs.devcord.app/introduction",
        stargazers_count: 156,
        watchers_count: 156,
        forks_count: 23,
        language: "Go",
        topics: ["discord-bot", "golang", "developer-tools"],
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-03-19T00:00:00Z",
        pushed_at: "2024-03-19T00:00:00Z",
        image:
          "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Fdocs.devcord.app%2Fintroduction",
        techStacks: [
          {
            id: "1",
            name: "Go",
            iconUrl:
              "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg",
          },
        ],
      },
      {
        id: "2",
        name: "LeetGrind",
        full_name: "LeetGrind/LeetGrind",
        description:
          "Un bot Discord pour pratiquer LeetCode chaque jour et progresser en algorithme dans une ambiance motivante et collaborative, avec des défis quotidiens et un système de classement pour suivre votre évolution",
        html_url: "https://github.com/LeetGrind/LeetGrind",
        homepage: "https://www.leetgrindbot.com/",
        stargazers_count: 156,
        watchers_count: 156,
        forks_count: 23,
        language: "TypeScript",
        topics: ["discord-bot", "typescript", "developer-tools"],
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-03-19T00:00:00Z",
        pushed_at: "2024-03-19T00:00:00Z",
        image:
          "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Fwww.leetgrindbot.com%2F",
        techStacks: [
          {
            id: "1",
            name: "TypeScript",
            iconUrl:
              "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
          },
        ],
      },
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/byronlove111" },
      { type: "twitter", url: "https://twitter.com/byronlove111" },
      { type: "website", url: "https://byronlove111.dev" },
    ],
  },
];
