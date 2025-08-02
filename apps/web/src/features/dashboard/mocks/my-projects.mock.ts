import { MyProjectType } from "../types/my-projects.type";

// Mock principal contenant tous les projets avec leurs applications et membres d'équipe
export const mockDashboardData: MyProjectType[] = [
  {
    id: "1",
    title: "Gitify",
    shortDescription: "Application desktop pour gérer les notifications GitHub",
    image: "/icons/gitifyIcon.png",
    status: "PUBLISHED",
    techStacks: [
      { id: "1", name: "React", iconUrl: "/icons/react.svg" },
      { id: "2", name: "TypeScript", iconUrl: "/icons/typescript.svg" },
    ],
    author: {
      id: "user-1",
      name: "69Kilian",
      avatarUrl: "/icons/user-placeholder.svg",
    },
    applications: [
      {
        id: "app-1",
        status: "PENDING",
        applicant: {
          id: "user-2",
          name: "Byron Love",
          avatarUrl: "/icons/exemplebyronIcon.svg",
          email: "byron.love@email.com",
        },
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
        status: "PENDING",
        applicant: {
          id: "user-3",
          name: "Sarah Johnson",
          avatarUrl: "/icons/exemplebyronIcon.svg",
          email: "sarah.johnson@email.com",
        },
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
        status: "ACCEPTED",
        applicant: {
          id: "user-8",
          name: "Lucas Rodriguez",
          avatarUrl: "/icons/exemplebyronIcon.svg",
          email: "lucas.rodriguez@email.com",
        },
        projectRole: {
          id: "role-6",
          title: "Full-Stack Developer",
          description: "Développer les fonctionnalités complètes",
          techStacks: [
            { id: "1", name: "React", iconUrl: "/icons/react.svg" },
            { id: "3", name: "Node.js", iconUrl: "/icons/nodejs.svg" },
            { id: "12", name: "GraphQL", iconUrl: "/icons/graphql.svg" },
          ],
          roleCount: 1,
        },
        appliedAt: new Date("2024-01-10T10:00:00Z"),
        decidedAt: new Date("2024-01-11T14:30:00Z"),
        motivationLetter:
          "Développeur full-stack avec une forte expérience en React et Node.js. Je peux contribuer à toutes les couches de l'application et apporter des améliorations significatives.",
        selectedKeyFeatures: [
          { feature: "Notifications GitHub centralisées" },
          { feature: "Interface desktop native" },
        ],
        selectedProjectGoals: [
          { goal: "Améliorer la productivité des développeurs" },
          { goal: "Centraliser la gestion des notifications" },
        ],
      },
      {
        id: "app-4",
        status: "REJECTED",
        applicant: {
          id: "user-5",
          name: "Marie Dubois",
          avatarUrl: "/icons/exemplebyronIcon.svg",
          email: "marie.dubois@email.com",
        },
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
      {
        id: "app-5",
        status: "PENDING",
        applicant: {
          id: "user-6",
          name: "David Kim",
          avatarUrl: "/icons/exemplebyronIcon.svg",
          email: "david.kim@email.com",
        },
        projectRole: {
          id: "role-4",
          title: "DevOps Engineer",
          description: "Gérer l'infrastructure et les déploiements",
          techStacks: [
            { id: "7", name: "Docker", iconUrl: "/icons/docker.svg" },
            { id: "8", name: "Kubernetes", iconUrl: "/icons/kubernetes.svg" },
            { id: "9", name: "AWS", iconUrl: "/icons/aws.svg" },
          ],
          roleCount: 1,
        },
        appliedAt: new Date("2024-01-15T08:15:00Z"),
        motivationLetter:
          "Expert en DevOps avec 8 ans d'expérience, je peux optimiser l'infrastructure de Gitify pour une meilleure scalabilité et fiabilité. J'ai une forte expertise en CI/CD et monitoring.",
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
        id: "app-6",
        status: "PENDING",
        applicant: {
          id: "user-7",
          name: "Emma Wilson",
          avatarUrl: "/icons/exemplebyronIcon.svg",
          email: "emma.wilson@email.com",
        },
        projectRole: {
          id: "role-5",
          title: "Product Manager",
          description: "Définir la roadmap produit et les priorités",
          techStacks: [
            { id: "10", name: "Jira", iconUrl: "/icons/jira.svg" },
            { id: "11", name: "Notion", iconUrl: "/icons/notion.svg" },
          ],
          roleCount: 1,
        },
        appliedAt: new Date("2024-01-14T13:20:00Z"),
        motivationLetter:
          "Product Manager avec une passion pour les outils de productivité. J'ai dirigé plusieurs projets tech et je peux aider à structurer la roadmap de Gitify pour maximiser son impact.",
        selectedKeyFeatures: [
          { feature: "Interface desktop native" },
          { feature: "Support multi-comptes" },
        ],
        selectedProjectGoals: [
          { goal: "Améliorer la productivité des développeurs" },
        ],
      },
    ],
    teamMembers: [
      {
        id: "member-1",
        name: "69Kilian",
        avatarUrl: "/icons/user-placeholder.svg",
        role: "Project Lead",
        joinedAt: new Date("2024-01-01T00:00:00Z"),
        techStacks: [
          { id: "1", name: "React" },
          { id: "2", name: "TypeScript" },
          { id: "3", name: "Node.js" },
        ],
      },
      {
        id: "member-3",
        name: "Lucas Rodriguez",
        avatarUrl: "/icons/exemplebyronIcon.svg",
        role: "Full-Stack Developer",
        joinedAt: new Date("2024-01-11T14:30:00Z"),
        techStacks: [
          { id: "1", name: "React" },
          { id: "3", name: "Node.js" },
          { id: "12", name: "GraphQL" },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "OpenDocs",
    shortDescription:
      "Plateforme collaborative pour la documentation technique",
    image: "/icons/gitifyIcon.png",
    status: "DRAFT",
    techStacks: [
      { id: "1", name: "React", iconUrl: "/icons/react.svg" },
      { id: "2", name: "TypeScript", iconUrl: "/icons/typescript.svg" },
    ],
    author: {
      id: "user-1",
      name: "69Kilian",
      avatarUrl: "/icons/user-placeholder.svg",
    },
    applications: [
      {
        id: "app-7",
        status: "ACCEPTED",
        applicant: {
          id: "user-4",
          name: "Alex Chen",
          avatarUrl: "/icons/exemplebyronIcon.svg",
          email: "alex.chen@email.com",
        },
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
        appliedAt: new Date("2024-01-12T11:20:00Z"),
        decidedAt: new Date("2024-01-13T10:00:00Z"),
        motivationLetter:
          "Je suis spécialisé dans la conception d'interfaces pour les outils de documentation et j'ai une forte expérience en recherche utilisateur. Je serais ravi de contribuer à créer une expérience utilisateur exceptionnelle pour OpenDocs.",
        selectedKeyFeatures: [
          { feature: "Éditeur markdown avancé" },
          { feature: "Collaboration en temps réel" },
        ],
        selectedProjectGoals: [
          { goal: "Simplifier la création de documentation" },
        ],
      },
    ],
    teamMembers: [
      {
        id: "member-1",
        name: "69Kilian",
        avatarUrl: "/icons/user-placeholder.svg",
        role: "Project Lead",
        joinedAt: new Date("2024-01-01T00:00:00Z"),
        techStacks: [
          { id: "1", name: "React" },
          { id: "2", name: "TypeScript" },
          { id: "3", name: "Node.js" },
        ],
      },
      {
        id: "member-2",
        name: "Alex Chen",
        avatarUrl: "/icons/exemplebyronIcon.svg",
        role: "UX/UI Designer",
        joinedAt: new Date("2024-01-13T10:00:00Z"),
        techStacks: [
          { id: "5", name: "Figma" },
          { id: "6", name: "Adobe XD" },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "DevHub",
    shortDescription: "Plateforme de networking pour développeurs",
    image: "/icons/gitifyIcon.png",
    status: "PUBLISHED",
    techStacks: [
      { id: "1", name: "React", iconUrl: "/icons/react.svg" },
      { id: "2", name: "TypeScript", iconUrl: "/icons/typescript.svg" },
    ],
    author: {
      id: "user-1",
      name: "69Kilian",
      avatarUrl: "/icons/user-placeholder.svg",
    },
    applications: [], // Pas encore de candidatures
    teamMembers: [
      {
        id: "member-1",
        name: "69Kilian",
        avatarUrl: "/icons/user-placeholder.svg",
        role: "Project Lead",
        joinedAt: new Date("2024-01-01T00:00:00Z"),
        techStacks: [
          { id: "1", name: "React" },
          { id: "2", name: "TypeScript" },
          { id: "3", name: "Node.js" },
        ],
      },
    ],
  },
];
