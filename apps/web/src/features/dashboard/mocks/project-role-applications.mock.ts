import { mockProjects } from "@/features/projects/mocks/project.mock";

import { ProjectRoleApplicationType } from "../types/project-role-application.type";

const gitifyProject = mockProjects.find((p) => p.slug === "gitify");
const leetgrindProject = mockProjects.find((p) => p.slug === "leetgrind");
const opensourcifyProject = mockProjects.find((p) => p.slug === "opensourcify");
const codequestProject = mockProjects.find((p) => p.slug === "codequest");

export const mockProjectRoleApplications: ProjectRoleApplicationType[] = [
  {
    appplicationId: "d78b2322-65db-4c8b-a2d0-6cf65afae882",
    projectRoleId: "3715420c-d33e-4541-8e9a-e547eb169ba1",
    projectRoleTitle: "Dev back",
    project: {
      id: "0247bb88-93cc-408d-8635-d149fa5b7604",
      title: "studydi",
      shortDescription: "Application de révision interactive",
      image: "https://example.com/project-image.jpg",
      owner: {
        ownerId: "936d4402-83ff-4be1-a3f7-6e5fba8fa052",
        username: "Lucalhost",
        avatarUrl: "https://avatars.githubusercontent.com/u/45101981?v=4",
      },
    },
    projectRole: {
      id: "3715420c-d33e-4541-8e9a-e547eb169ba1",
      projectId: "0247bb88-93cc-408d-8635-d149fa5b7604",
      title: "Dev back",
      description: "Développement backend avec Node.js et Express",
      techStacks: [
        {
          id: "tech-1",
          name: "Node.js",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
        },
        {
          id: "tech-2",
          name: "Express",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
        },
      ],
      roleCount: 1,
      projectGoal: [
        {
          id: "goal-1",
          projectId: "0247bb88-93cc-408d-8635-d149fa5b7604",
          goal: "Créer une API REST robuste",
        },
      ],
    },
    status: "PENDING",
    selectedKeyFeatures: [
      {
        feature: "auth",
      },
    ],
    selectedProjectGoals: [
      {
        goal: "app de revision",
      },
    ],
    appliedAt: new Date("2025-07-29T09:07:15.289Z"),
    decidedAt: new Date("2025-07-29T18:14:27.974Z"),
    decidedBy: undefined,
    rejectionReason: undefined,
    motivationLetter: "dfsajhksadfhjkasdfhjkdsafghjkdgsahkjadgshjksadfgklhj",
    userProfile: {
      id: "936d4402-83ff-4be1-a3f7-6e5fba8fa052",
      name: "Lucalhost",
      avatarUrl: "https://avatars.githubusercontent.com/u/45101981?v=4",
    },
  },
  {
    appplicationId: "2",
    projectRoleId: "role2",
    projectRoleTitle: "Backend Developer",
    project: {
      id: leetgrindProject?.id || "2",
      title: leetgrindProject?.title || "LeetGrind",
      shortDescription:
        leetgrindProject?.shortDescription ||
        "LeetGrind is a tool for managing code source for developers.",
      image:
        "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Fwww.leetgrindbot.com%2F",
      owner: {
        ownerId: "1",
        username: "y2_dev",
        avatarUrl:
          "https://pbs.twimg.com/profile_images/1799769138413391872/USSwdetq_400x400.jpg",
      },
    },
    projectRole: {
      id: "role2",
      projectId: "2",
      title: "Backend Developer",
      description:
        "Nous recherchons un développeur backend pour aider à développer LeetGrind, un outil de gestion de code source pour les développeurs.",
      techStacks: [
        {
          id: "1",
          name: "Node.js",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
        },
        {
          id: "2",
          name: "NestJS",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg",
        },
        {
          id: "3",
          name: "PostgreSQL",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
        },
      ],
      roleCount: 2,
      projectGoal: [
        {
          id: "goal-1",
          projectId: "2",
          goal: "Aider 1000+ développeurs à améliorer leurs compétences en algorithmie",
        },
        {
          id: "goal-2",
          projectId: "2",
          goal: "Créer une communauté active et bienveillante",
        },
      ],
    },
    status: "ACCEPTED",
    selectedKeyFeatures: [
      {
        feature: "Défis LeetCode quotidiens automatisés",
      },
      {
        feature: "Système de classement compétitif",
      },
    ],
    selectedProjectGoals: [
      {
        goal: "Aider 1000+ développeurs à améliorer leurs compétences en algorithmie",
      },
      {
        goal: "Créer une communauté active et bienveillante",
      },
    ],
    appliedAt: new Date("2024-02-15"),
    decidedAt: new Date("2024-02-18"),
    decidedBy: "admin-user-id",
    rejectionReason: undefined,
    motivationLetter:
      "J'ai une solide expérience en développement backend et je suis passionné par l'algorithmie...",
    userProfile: {
      id: "user2",
      name: "Bob Johnson",
      avatarUrl: "https://github.com/bobjohnson.png",
    },
  },
  {
    appplicationId: "3",
    projectRoleId: "role3",
    projectRoleTitle: "UI/UX Designer",
    project: {
      id: opensourcifyProject?.id || "3",
      title: opensourcifyProject?.title || "OpenSourcify",
      shortDescription:
        opensourcifyProject?.shortDescription ||
        "OpenSourcify is a tool for managing code source for developers.",
      image: opensourcifyProject?.image || "/icons/opensourcify.png",
      owner: {
        ownerId: "2",
        username: "Jane Doe",
        avatarUrl: "/icons/janedoe.png",
      },
    },
    projectRole: {
      id: "role3",
      projectId: "3",
      title: "UI/UX Designer",
      description:
        "Nous recherchons un designer pour améliorer l'expérience utilisateur de notre plateforme.",
      techStacks: [
        {
          id: "1",
          name: "Figma",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
        },
        {
          id: "2",
          name: "Adobe XD",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/xd/xd-original.svg",
        },
      ],
      roleCount: 1,
      projectGoal: [
        {
          id: "goal-1",
          projectId: "3",
          goal: "Améliorer l'accessibilité",
        },
        {
          id: "goal-2",
          projectId: "3",
          goal: "Augmenter l'engagement utilisateur",
        },
      ],
    },
    status: "REJECTED",
    selectedKeyFeatures: [
      {
        feature: "Refonte du dashboard",
      },
      {
        feature: "Création d'un design system",
      },
    ],
    selectedProjectGoals: [
      {
        goal: "Améliorer l'accessibilité",
      },
      {
        goal: "Augmenter l'engagement utilisateur",
      },
    ],
    appliedAt: new Date("2024-03-01"),
    decidedAt: new Date("2024-03-05"),
    decidedBy: "admin-user-id",
    rejectionReason: "Profil trop junior pour ce poste.",
    motivationLetter:
      "J'adore concevoir des interfaces et je veux rendre l'open source plus accessible à tous.",
    userProfile: {
      id: "user3",
      name: "Charlie Lee",
      avatarUrl: "/icons/charlielee.png",
    },
  },
  {
    appplicationId: "4",
    projectRoleId: "role4",
    projectRoleTitle: "DevOps Engineer",
    project: {
      id: codequestProject?.id || "4",
      title: codequestProject?.title || "CodeQuest",
      shortDescription:
        codequestProject?.shortDescription ||
        "CodeQuest is a tool for managing code source for developers.",
      image: codequestProject?.image || "/icons/codequest.png",
      owner: {
        ownerId: "3",
        username: "Maxime Dupont",
        avatarUrl: "/icons/maximedupont.png",
      },
    },
    projectRole: {
      id: "role4",
      projectId: "4",
      title: "DevOps Engineer",
      description:
        "Nous avons besoin d'un DevOps pour automatiser nos déploiements et améliorer la CI/CD.",
      techStacks: [
        {
          id: "1",
          name: "Docker",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
        },
        {
          id: "2",
          name: "Kubernetes",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg",
        },
        {
          id: "3",
          name: "GitHub Actions",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
        },
      ],
      roleCount: 1,
      projectGoal: [
        {
          id: "goal-1",
          projectId: "4",
          goal: "Réduire le temps de mise en production",
        },
        {
          id: "goal-2",
          projectId: "4",
          goal: "Augmenter la fiabilité des releases",
        },
      ],
    },
    status: "PENDING",
    selectedKeyFeatures: [
      {
        feature: "Automatisation des tests",
      },
      {
        feature: "Déploiement continu",
      },
    ],
    selectedProjectGoals: [
      {
        goal: "Réduire le temps de mise en production",
      },
      {
        goal: "Augmenter la fiabilité des releases",
      },
    ],
    appliedAt: new Date("2024-03-10"),
    decidedAt: undefined,
    decidedBy: undefined,
    rejectionReason: undefined,
    motivationLetter:
      "J'ai une grande expérience DevOps et je souhaite aider à scaler CodeQuest.",
    userProfile: {
      id: "user4",
      name: "Sophie Martin",
      avatarUrl: "/icons/sophiemartin.png",
    },
  },
  {
    appplicationId: "5",
    projectRoleId: "role5",
    projectRoleTitle: "Frontend Developer",
    project: {
      id: gitifyProject?.id || "1",
      title: gitifyProject?.title || "Gitify",
      shortDescription:
        gitifyProject?.shortDescription ||
        "Gitify is a tool for managing code source for developers.",
      image: gitifyProject?.image,
      owner: {
        ownerId: "1",
        username: "69Killian",
        avatarUrl: "/icons/killiancodes-icon.jpg",
      },
    },
    projectRole: {
      id: "role5",
      projectId: "1",
      title: "Frontend Developer",
      description:
        "Nous recherchons un développeur frontend pour améliorer l'interface utilisateur.",
      techStacks: [
        {
          id: "1",
          name: "Vue.js",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg",
        },
        {
          id: "2",
          name: "Vite",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vite/vite-original.svg",
        },
      ],
      roleCount: 1,
      projectGoal: [
        {
          id: "goal-1",
          projectId: "1",
          goal: "Augmenter la rapidité de l'UI",
        },
      ],
    },
    status: "CANCELLED",
    selectedKeyFeatures: [
      {
        feature: "Refonte du composant dashboard",
      },
    ],
    selectedProjectGoals: [
      {
        goal: "Augmenter la rapidité de l'UI",
      },
    ],
    appliedAt: new Date("2024-03-12"),
    decidedAt: new Date("2024-03-13"),
    decidedBy: "user5",
    rejectionReason: "Candidature annulée par l'utilisateur.",
    motivationLetter:
      "Je souhaite contribuer à l'amélioration de l'expérience utilisateur sur Gitify.",
    userProfile: {
      id: "user5",
      name: "Lucas Bernard",
      avatarUrl: "/icons/lucasbernard.png",
    },
  },
];
