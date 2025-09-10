import { Profile } from "../types/profile.type";

export const mockPublicProfile: Profile = {
  id: "43a39f90-1718-470d-bcef-c7ebeb972c0d",
  username: "John Doe",
  avatarUrl: "https://avatars.githubusercontent.com/u/45101981?v=4",
  bio: "Fullstack Developer | Express & React | Building @awesome-project | Passionné par l'open source et les nouvelles technologies. J'aime créer des applications qui ont un impact positif sur la vie des gens.",
  jobTitle: "Senior Fullstack Developer",
  contributionsCount: 1250,
  provider: "github",
  socialLinks: {
    github: "https://github.com/johndoe",
    twitter: "https://twitter.com/johndoe",
    linkedin: "https://www.linkedin.com/in/johndoe/",
    website: "https://johndoe.com",
    discord: "https://discord.gg/johndoe",
  },
  techStacks: [
    {
      id: "1",
      name: "React",
      iconUrl:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      type: "TECH",
    },
    {
      id: "2",
      name: "TypeScript",
      iconUrl:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      type: "LANGUAGE",
    },
    {
      id: "3",
      name: "Node.js",
      iconUrl:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      type: "TECH",
    },
    {
      id: "4",
      name: "PostgreSQL",
      iconUrl:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      type: "TECH",
    },
    {
      id: "5",
      name: "Docker",
      iconUrl:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
      type: "TECH",
    },
    {
      id: "6",
      name: "Python",
      iconUrl:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      type: "LANGUAGE",
    },
  ],
  projects: [
    {
      id: "1",
      title: "Awesome Project",
      description: "Une application révolutionnaire pour la gestion de projets",
      image:
        "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Awesome+Project",
      owner: {
        id: "43a39f90-1718-470d-bcef-c7ebeb972c0d",
        username: "John Doe",
        avatarUrl: "https://avatars.githubusercontent.com/u/45101981?v=4",
      },
      techStacks: [
        {
          id: "1",
          name: "React",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        },
        {
          id: "2",
          name: "TypeScript",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        },
      ],
      categories: [
        { id: "1", name: "Développement Web" },
        { id: "2", name: "Open Source" },
      ],
      projectStats: {
        stars: 150,
        forks: 25,
        contributors: [],
      },
      status: "PUBLISHED",
      keyFeatures: [
        { id: "1", feature: "Gestion de projets avancée" },
        { id: "2", feature: "Interface intuitive" },
      ],
      createdAt: new Date("2024-01-15T10:30:00.000Z"),
      updatedAt: new Date("2024-03-20T14:45:00.000Z"),
    },
    {
      id: "2",
      title: "Open Source Library",
      description: "Bibliothèque JavaScript pour les animations",
      image:
        "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Open+Source+Lib",
      owner: {
        id: "43a39f90-1718-470d-bcef-c7ebeb972c0d",
        username: "John Doe",
        avatarUrl: "https://avatars.githubusercontent.com/u/45101981?v=4",
      },
      techStacks: [
        {
          id: "2",
          name: "TypeScript",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        },
        {
          id: "6",
          name: "Python",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
        },
      ],
      categories: [
        { id: "3", name: "Bibliothèque" },
        { id: "2", name: "Open Source" },
      ],
      projectStats: {
        stars: 89,
        forks: 12,
        contributors: [],
      },
      status: "PUBLISHED",
      keyFeatures: [
        { id: "3", feature: "Animations fluides" },
        { id: "4", feature: "Performance optimisée" },
      ],
      createdAt: new Date("2023-08-10T09:15:00.000Z"),
      updatedAt: new Date("2024-02-28T16:20:00.000Z"),
    },
  ],
  joinedAt: "2025-04-16T15:47:31.633Z",
  profileUpdatedAt: "2025-04-16T15:47:31.633Z",
};
