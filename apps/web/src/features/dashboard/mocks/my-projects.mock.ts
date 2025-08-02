import { Project } from "@/features/projects/types/project.type";

export const mockMyProjects: Project[] = [
  {
    id: "1",
    ownerId: "user-1",
    slug: "gitify",
    title: "Gitify",
    image: "/icons/gitifyIcon.png",
    shortDescription:
      "Réalise des challenges en contribuant à des projets open source.",
    longDescription:
      "Une application desktop qui vous permet de gérer toutes vos notifications GitHub en un seul endroit. Gitify est conçu pour améliorer votre productivité en centralisant vos notifications et en vous permettant de les traiter rapidement.",
    status: "PUBLISHED",
    author: {
      ownerId: "user-1",
      name: "69Kilian",
      avatarUrl: "/icons/user-placeholder.svg",
    },
    techStacks: [
      { id: "1", name: "React", iconUrl: "/icons/react.svg" },
      { id: "2", name: "TypeScript", iconUrl: "/icons/typescript.svg" },
      { id: "3", name: "MongoDB", iconUrl: "/icons/mongodb.svg" },
      { id: "4", name: "Node.js", iconUrl: "/icons/nodejs.svg" },
    ],
    externalLinks: [
      { type: "github", url: "https://github.com/gitify-app/gitify" },
      { type: "website", url: "https://www.gitify.io" },
    ],
    projectStats: {
      forks: 14,
      contributors: [
        {
          login: "69Kilian",
          avatar_url: "/icons/user-placeholder.svg",
          html_url: "https://github.com/69Kilian",
          contributions: 120,
        },
        {
          login: "contributor2",
          avatar_url: "/icons/user-placeholder.svg",
          html_url: "https://github.com/contributor2",
          contributions: 45,
        },
      ],
      stars: 55,
      watchers: 12,
      openIssues: 8,
      commits: 234,
      lastCommit: {
        sha: "a1b2c3d",
        message: "Fix notification display issue",
        date: "2024-01-15T10:30:00Z",
        url: "https://github.com/gitify-app/gitify/commit/a1b2c3d",
        author: {
          login: "69Kilian",
          avatar_url: "/icons/user-placeholder.svg",
          html_url: "https://github.com/69Kilian",
        },
      },
    },
    keyFeatures: [
      { id: "1", feature: "Notifications GitHub centralisées" },
      { id: "2", feature: "Interface desktop native" },
      { id: "3", feature: "Support multi-comptes" },
    ],
    projectGoals: [
      { id: "1", goal: "Améliorer la productivité des développeurs" },
      { id: "2", goal: "Centraliser la gestion des notifications" },
    ],
    categories: [
      { id: "1", name: "Productivity" },
      { id: "2", name: "Developer Tools" },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    ownerId: "user-1",
    slug: "open-docs",
    title: "OpenDocs",
    image: "/icons/gitifyIcon.png",
    shortDescription:
      "Une plateforme collaborative pour créer et partager de la documentation technique.",
    longDescription:
      "OpenDocs est une solution open source pour créer, maintenir et partager de la documentation technique de manière collaborative. Elle offre des fonctionnalités avancées de versioning, de révision et d'intégration continue.",
    status: "DRAFT",
    author: {
      ownerId: "user-1",
      name: "69Kilian",
      avatarUrl: "/icons/user-placeholder.svg",
    },
    techStacks: [
      { id: "1", name: "React", iconUrl: "/icons/react.svg" },
      { id: "2", name: "TypeScript", iconUrl: "/icons/typescript.svg" },
      { id: "3", name: "MongoDB", iconUrl: "/icons/mongodb.svg" },
      { id: "4", name: "Node.js", iconUrl: "/icons/nodejs.svg" },
    ],
    externalLinks: [
      { type: "github", url: "https://github.com/user-1/open-docs" },
    ],
    projectStats: {
      forks: 3,
      contributors: [
        {
          login: "69Kilian",
          avatar_url: "/icons/user-placeholder.svg",
          html_url: "https://github.com/69Kilian",
          contributions: 67,
        },
      ],
      stars: 12,
      watchers: 5,
      openIssues: 15,
      commits: 89,
      lastCommit: {
        sha: "x1y2z3a",
        message: "Add markdown editor component",
        date: "2024-01-10T14:20:00Z",
        url: "https://github.com/user-1/open-docs/commit/x1y2z3a",
        author: {
          login: "69Kilian",
          avatar_url: "/icons/user-placeholder.svg",
          html_url: "https://github.com/69Kilian",
        },
      },
    },
    keyFeatures: [
      { id: "3", feature: "Éditeur markdown avancé" },
      { id: "4", feature: "Collaboration en temps réel" },
      { id: "5", feature: "Versioning automatique" },
    ],
    projectGoals: [
      { id: "3", goal: "Simplifier la création de documentation" },
      { id: "4", goal: "Améliorer la collaboration technique" },
    ],
    categories: [
      { id: "3", name: "Documentation" },
      { id: "4", name: "Collaboration" },
    ],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-10"),
  },
];

export const mockApplicationsReceived = [
  {
    id: "app-1",
    projectId: "1",
    projectTitle: "Gitify",
    projectRole: {
      id: "role-1",
      title: "Front-End Developer",
      description: "Développer l'interface utilisateur de l'application",
      techStacks: [
        { id: "1", name: "React", iconUrl: "/icons/react.svg" },
        { id: "2", name: "TypeScript", iconUrl: "/icons/typescript.svg" },
      ],
      roleCount: 2,
    },
    applicant: {
      id: "user-2",
      name: "Byron Love",
      avatarUrl: "/icons/exemplebyronIcon.svg",
      email: "byron.love@email.com",
    },
    status: "PENDING",
    appliedAt: new Date("2024-01-14T09:30:00Z"),
    motivationLetter:
      "Je suis passionné par les applications desktop et j'ai une solide expérience en React et TypeScript. J'aimerais contribuer à améliorer l'interface utilisateur de Gitify et apporter de nouvelles fonctionnalités innovantes.",
    selectedKeyFeatures: [
      { feature: "Interface desktop native" },
      { feature: "Support multi-comptes" },
    ],
    selectedProjectGoals: [
      { goal: "Améliorer la productivité des développeurs" },
    ],
  },
  {
    id: "app-2",
    projectId: "1",
    projectTitle: "Gitify",
    projectRole: {
      id: "role-2",
      title: "Backend Developer",
      description: "Développer les APIs et l'intégration GitHub",
      techStacks: [
        { id: "3", name: "Node.js", iconUrl: "/icons/nodejs.svg" },
        { id: "4", name: "Express", iconUrl: "/icons/express.svg" },
      ],
      roleCount: 1,
    },
    applicant: {
      id: "user-3",
      name: "Sarah Johnson",
      avatarUrl: "/icons/exemplebyronIcon.svg",
      email: "sarah.johnson@email.com",
    },
    status: "PENDING",
    appliedAt: new Date("2024-01-13T15:45:00Z"),
    motivationLetter:
      "Avec 5 ans d'expérience en développement backend et une expertise approfondie de l'API GitHub, je suis confiant dans ma capacité à améliorer l'architecture serveur de Gitify et à optimiser les performances.",
    selectedKeyFeatures: [
      { feature: "Notifications GitHub centralisées" },
      { feature: "Support multi-comptes" },
    ],
    selectedProjectGoals: [
      { goal: "Améliorer la productivité des développeurs" },
      { goal: "Centraliser la gestion des notifications" },
    ],
  },
  {
    id: "app-3",
    projectId: "2",
    projectTitle: "OpenDocs",
    projectRole: {
      id: "role-3",
      title: "UX/UI Designer",
      description: "Concevoir l'expérience utilisateur et l'interface",
      techStacks: [
        { id: "5", name: "Figma", iconUrl: "/icons/figma.svg" },
        { id: "6", name: "Adobe XD", iconUrl: "/icons/adobe-xd.svg" },
      ],
      roleCount: 1,
    },
    applicant: {
      id: "user-4",
      name: "Alex Chen",
      avatarUrl: "/icons/exemplebyronIcon.svg",
      email: "alex.chen@email.com",
    },
    status: "ACCEPTED",
    appliedAt: new Date("2024-01-12T11:20:00Z"),
    decidedAt: new Date("2024-01-13T10:00:00Z"),
    motivationLetter:
      "Je suis spécialisé dans la conception d'interfaces pour les outils de documentation et j'ai une forte expérience en recherche utilisateur. Je serais ravi de contribuer à créer une expérience utilisateur exceptionnelle pour OpenDocs.",
    selectedKeyFeatures: [
      { feature: "Éditeur markdown avancé" },
      { feature: "Collaboration en temps réel" },
    ],
    selectedProjectGoals: [{ goal: "Simplifier la création de documentation" }],
  },
  {
    id: "app-4",
    projectId: "1",
    projectTitle: "Gitify",
    projectRole: {
      id: "role-1",
      title: "Front-End Developer",
      description: "Développer l'interface utilisateur de l'application",
      techStacks: [
        { id: "1", name: "React", iconUrl: "/icons/react.svg" },
        { id: "2", name: "TypeScript", iconUrl: "/icons/typescript.svg" },
      ],
      roleCount: 2,
    },
    applicant: {
      id: "user-5",
      name: "Marie Dubois",
      avatarUrl: "/icons/exemplebyronIcon.svg",
      email: "marie.dubois@email.com",
    },
    status: "REJECTED",
    appliedAt: new Date("2024-01-11T14:30:00Z"),
    decidedAt: new Date("2024-01-12T16:45:00Z"),
    rejectionReason:
      "Profil intéressant mais nous recherchons une expérience plus approfondie en Electron pour ce rôle spécifique.",
    motivationLetter:
      "Je découvre le développement d'applications desktop et j'aimerais apprendre en contribuant à Gitify. J'ai de bonnes bases en React mais je suis encore débutante avec Electron.",
    selectedKeyFeatures: [{ feature: "Interface desktop native" }],
    selectedProjectGoals: [
      { goal: "Améliorer la productivité des développeurs" },
    ],
  },
];
