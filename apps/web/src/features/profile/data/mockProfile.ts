import { Profile } from "../types/profileTypes";

// export const mockProfiles: Profile[] = [
//   {
//     id: "1",
//     login: "byronlove111",
//     avatar_url:
//       "https://pbs.twimg.com/profile_images/1813513692471779328/6RxAJKDu_400x400.jpg",
//     html_url: "https://github.com/byronlove111",
//     type: "User",
//     site_admin: false,
//     name: "Byron Love",
//     bio: "Développeur fullstack créant du code propre et efficace pour des expériences web modernes.",
//     location: "Paris, France",
//     blog: "https://byronlove111.dev",
//     links: [
//       {
//         type: "github",
//         url: "https://github.com/byronlove111",
//       },
//       {
//         type: "blog",
//         url: "https://byronlove111.dev",
//       },
//       {
//         type: "x",
//         url: "https://x.com/byronlove111",
//       },
//       {
//         type: "linkedin",
//         url: "https://www.linkedin.com/in/byronlove111/",
//       },
//       {
//         type: "discord",
//         url: "https://discord.com/byronlove111",
//       },
//     ],
//     company: "Freelance",
//     public_repos: 32,
//     followers: 412,
//     following: 156,
//     created_at: "2025-04-25T00:00:00Z",
//     updated_at: "2024-03-19T00:00:00Z",
//     contributions_count: 1268,
//     skills: [
//       {
//         name: "React",
//         level: "EXPERT",
//         badges: [
//           {
//             label: "React",
//             color: "#7C86FF",
//             bgColor: "#E0E7FF50",
//           },
//         ],
//       },
//       {
//         name: "Figma",
//         level: "ADVANCED",
//         badges: [{ label: "Figma", color: "#FDC700", bgColor: "#FEF9C280" }],
//       },
//       {
//         name: "MongoDB",
//         level: "ADVANCED",
//         badges: [
//           {
//             label: "MongoDB",
//             color: "#00D492",
//             bgColor: "#D0FAE550",
//           },
//         ],
//       },
//     ],
//     projects: [
//       {
//         id: "1",
//         name: "LeetGrind",
//         full_name: "LeetGrind/LeetGrind",
//         description:
//           "Un bot Discord pour pratiquer LeetCode chaque jour et progresser en algorithme dans une ambiance motivante et collaborative, avec des défis quotidiens et un système de classement pour suivre votre évolution",
//         html_url: "https://github.com/LeetGrind/LeetGrind",
//         homepage: "https://www.leetgrindbot.com/",
//         stargazers_count: 156,
//         watchers_count: 156,
//         forks_count: 23,
//         language: "TypeScript",
//         topics: ["discord-bot", "typescript", "developer-tools"],
//         created_at: "2024-01-01T00:00:00Z",
//         updated_at: "2024-03-19T00:00:00Z",
//         pushed_at: "2024-03-19T00:00:00Z",
//         image:
//           "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Fwww.leetgrindbot.com%2F",
//         techStacks: [
//           {
//             id: "1",
//             name: "TypeScript",
//             iconUrl:
//               "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
//           },
//         ],
//       },
//       {
//         id: "2",
//         name: "devcord",
//         full_name: "devcord-bot/devcord",
//         description:
//           "Bot Discord pour les développeurs avec des commandes intelligentes",
//         html_url: "https://github.com/devcord-bot/devcord",
//         homepage: "https://docs.devcord.app/introduction",
//         stargazers_count: 156,
//         watchers_count: 156,
//         forks_count: 23,
//         language: "Go",
//         topics: ["discord-bot", "golang", "developer-tools"],
//         created_at: "2024-01-01T00:00:00Z",
//         updated_at: "2024-03-19T00:00:00Z",
//         pushed_at: "2024-03-19T00:00:00Z",
//         image:
//           "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Fdocs.devcord.app%2Fintroduction",
//         techStacks: [
//           {
//             id: "1",
//             name: "Go",
//             iconUrl:
//               "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg",
//           },
//         ],
//       },
//     ],
//     socialLinks: [
//       { type: "github", url: "https://github.com/byronlove111" },
//       { type: "twitter", url: "https://twitter.com/byronlove111" },
//       { type: "website", url: "https://byronlove111.dev" },
//     ],
//     experiences: [
//       {
//         id: "1",
//         company: "OpenSource Together",
//         position: "Lead Developer",
//         startDate: "2024-01-01",
//         endDate: "2025",
//       },
//       {
//         id: "2",
//         company: "LeetGrind",
//         position: "Lead Developer",
//         startDate: "2023-01-01",
//         endDate: "2024-03-19",
//       },
//       {
//         id: "3",
//         company: "Project",
//         position: "Intern",
//         startDate: "2021-01-01",
//         endDate: "2023-01-01",
//       },
//     ],
//   },
// ];

export const mockProfile: Profile = {
  id: "1",
  login: "byronlove111",
  avatarUrl:
    "https://pbs.twimg.com/profile_images/1813513692471779328/6RxAJKDu_400x400.jpg",
  websiteUrl: "https://github.com/byronlove111",
  type: "User",
  name: "Byron Love",
  bio: "Développeur fullstack créant du code propre et efficace pour des expériences web modernes.",
  location: "Paris, France",
  blog: "https://byronlove111.dev",
  links: [
    {
      type: "github",
      url: "https://github.com/byronlove111",
    },
    {
      type: "blog",
      url: "https://byronlove111.dev",
    },
    {
      type: "x",
      url: "https://x.com/byronlove111",
    },
    {
      type: "linkedin",
      url: "https://www.linkedin.com/in/byronlove111/",
    },
    {
      type: "discord",
      url: "https://discord.com/byronlove111",
    },
  ],
  company: "Freelance",
  joinedAt: "2025-04-25T00:00:00Z",
  contributionsCount: 1268,
  skills: [
    {
      name: "React",
      level: "EXPERT",
      badges: [
        {
          label: "React",
          color: "#7C86FF",
          bgColor: "#E0E7FF50",
        },
      ],
    },
    {
      name: "Figma",
      level: "ADVANCED",
      badges: [{ label: "Figma", color: "#FDC700", bgColor: "#FEF9C280" }],
    },
    {
      name: "MongoDB",
      level: "ADVANCED",
      badges: [
        {
          label: "MongoDB",
          color: "#00D492",
          bgColor: "#D0FAE550",
        },
      ],
    },
  ],
  projects: [
    {
      id: "1",
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
    {
      id: "2",
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
  ],
  socialLinks: [
    { type: "github", url: "https://github.com/byronlove111" },
    { type: "twitter", url: "https://twitter.com/byronlove111" },
    { type: "website", url: "https://byronlove111.dev" },
  ],
  experiences: [
    {
      id: "1",
      company: "OpenSource Together",
      position: "Lead Developer",
      startDate: "2024-01-01",
      endDate: "2025",
    },
    {
      id: "2",
      company: "LeetGrind",
      position: "Lead Developer",
      startDate: "2023-01-01",
      endDate: "2024-03-19",
    },
    {
      id: "3",
      company: "Project",
      position: "Intern",
      startDate: "2021-01-01",
      endDate: "2023-01-01",
    },
  ],
};

