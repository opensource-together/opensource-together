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
      {
        id: "1",
        name: "React",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      },
      {
        id: "2",
        name: "TypeScript",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      },
      {
        id: "3",
        name: "Electron",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/electron/electron-original.svg",
      },
      {
        id: "4",
        name: "Node.js",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
      },
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
            {
              id: "1",
              name: "React",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
            },
            {
              id: "2",
              name: "TypeScript",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
            },
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
            {
              id: "4",
              name: "Node.js",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
            },
            {
              id: "5",
              name: "Express",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
            },
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
            {
              id: "1",
              name: "React",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
            },
            {
              id: "4",
              name: "Node.js",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
            },
            {
              id: "6",
              name: "GraphQL",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg",
            },
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
            {
              id: "1",
              name: "React",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
            },
            {
              id: "2",
              name: "TypeScript",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
            },
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
          { id: "4", name: "Node.js" },
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
          { id: "4", name: "Node.js" },
          { id: "6", name: "GraphQL" },
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
      {
        id: "7",
        name: "Vue.js",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg",
      },
      {
        id: "8",
        name: "Nuxt.js",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg",
      },
      {
        id: "9",
        name: "PostgreSQL",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
      },
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
            {
              id: "10",
              name: "Figma",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
            },
            {
              id: "11",
              name: "Adobe XD",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/adobexd/adobexd-original.svg",
            },
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
      {
        id: "app-8",
        status: "PENDING",
        applicant: {
          id: "user-9",
          name: "Thomas Müller",
          avatarUrl: "/icons/exemplebyronIcon.svg",
          email: "thomas.muller@email.com",
        },
        projectRole: {
          id: "role-7",
          title: "Vue.js Developer",
          description: "Développer l'interface avec Vue.js et Nuxt.js",
          techStacks: [
            {
              id: "7",
              name: "Vue.js",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg",
            },
            {
              id: "8",
              name: "Nuxt.js",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg",
            },
          ],
          roleCount: 1,
        },
        appliedAt: new Date("2024-01-15T16:20:00Z"),
        motivationLetter:
          "Développeur Vue.js expérimenté avec une passion pour les outils de documentation. J'ai contribué à plusieurs projets open source et je peux apporter une expertise technique solide.",
        selectedKeyFeatures: [
          { feature: "Éditeur markdown avancé" },
          { feature: "Versioning automatique" },
        ],
        selectedProjectGoals: [
          { goal: "Simplifier la création de documentation" },
          { goal: "Améliorer la collaboration technique" },
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
          { id: "7", name: "Vue.js" },
          { id: "8", name: "Nuxt.js" },
          { id: "9", name: "PostgreSQL" },
        ],
      },
      {
        id: "member-2",
        name: "Alex Chen",
        avatarUrl: "/icons/exemplebyronIcon.svg",
        role: "UX/UI Designer",
        joinedAt: new Date("2024-01-13T10:00:00Z"),
        techStacks: [
          { id: "10", name: "Figma" },
          { id: "11", name: "Adobe XD" },
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
      {
        id: "12",
        name: "Angular",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg",
      },
      {
        id: "13",
        name: "Firebase",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg",
      },
      {
        id: "14",
        name: "MongoDB",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
      },
    ],
    author: {
      id: "user-1",
      name: "69Kilian",
      avatarUrl: "/icons/user-placeholder.svg",
    },
    applications: [
      {
        id: "app-9",
        status: "PENDING",
        applicant: {
          id: "user-10",
          name: "Elena Petrova",
          avatarUrl: "/icons/exemplebyronIcon.svg",
          email: "elena.petrova@email.com",
        },
        projectRole: {
          id: "role-8",
          title: "Angular Developer",
          description: "Développer l'interface avec Angular",
          techStacks: [
            {
              id: "12",
              name: "Angular",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg",
            },
            {
              id: "15",
              name: "RxJS",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rxjs/rxjs-original.svg",
            },
          ],
          roleCount: 1,
        },
        appliedAt: new Date("2024-01-16T12:00:00Z"),
        motivationLetter:
          "Développeuse Angular avec 4 ans d'expérience, je suis passionnée par les plateformes de networking tech. J'ai une forte expertise en RxJS et je peux contribuer à créer une expérience utilisateur fluide.",
        selectedKeyFeatures: [
          { feature: "Profils développeurs détaillés" },
          { feature: "Chat en temps réel" },
        ],
        selectedProjectGoals: [
          { goal: "Faciliter le networking tech" },
          { goal: "Améliorer le recrutement tech" },
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
          { id: "12", name: "Angular" },
          { id: "13", name: "Firebase" },
          { id: "14", name: "MongoDB" },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "CodeFlow",
    shortDescription: "IDE en ligne pour l'apprentissage du code",
    image: "/icons/gitifyIcon.png",
    status: "PUBLISHED",
    techStacks: [
      {
        id: "16",
        name: "Svelte",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg",
      },
      {
        id: "17",
        name: "WebAssembly",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/webassembly/webassembly-original.svg",
      },
      {
        id: "18",
        name: "Rust",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-plain.svg",
      },
    ],
    author: {
      id: "user-1",
      name: "69Kilian",
      avatarUrl: "/icons/user-placeholder.svg",
    },
    applications: [
      {
        id: "app-10",
        status: "ACCEPTED",
        applicant: {
          id: "user-11",
          name: "Marcus Johnson",
          avatarUrl: "/icons/exemplebyronIcon.svg",
          email: "marcus.johnson@email.com",
        },
        projectRole: {
          id: "role-9",
          title: "Rust Developer",
          description: "Développer les composants backend en Rust",
          techStacks: [
            {
              id: "18",
              name: "Rust",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-plain.svg",
            },
            {
              id: "19",
              name: "WASM",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/webassembly/webassembly-original.svg",
            },
          ],
          roleCount: 1,
        },
        appliedAt: new Date("2024-01-09T14:30:00Z"),
        decidedAt: new Date("2024-01-10T09:15:00Z"),
        motivationLetter:
          "Développeur Rust avec une expertise en WebAssembly. Je suis passionné par l'éducation tech et je peux contribuer à optimiser les performances de l'IDE en ligne.",
        selectedKeyFeatures: [
          { feature: "Éditeur de code en temps réel" },
          { feature: "Support multi-langages" },
        ],
        selectedProjectGoals: [
          { goal: "Faciliter l'apprentissage du code" },
          { goal: "Améliorer l'expérience développeur" },
        ],
      },
      {
        id: "app-11",
        status: "REJECTED",
        applicant: {
          id: "user-12",
          name: "Sophie Martin",
          avatarUrl: "/icons/exemplebyronIcon.svg",
          email: "sophie.martin@email.com",
        },
        projectRole: {
          id: "role-10",
          title: "Svelte Developer",
          description: "Développer l'interface utilisateur avec Svelte",
          techStacks: [
            {
              id: "16",
              name: "Svelte",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg",
            },
            {
              id: "20",
              name: "SvelteKit",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sveltekit/sveltekit-original.svg",
            },
          ],
          roleCount: 1,
        },
        appliedAt: new Date("2024-01-08T11:45:00Z"),
        decidedAt: new Date("2024-01-09T16:20:00Z"),
        rejectionReason:
          "Profil intéressant mais nous recherchons une expérience plus approfondie en WebAssembly et en développement d'outils de développement.",
        motivationLetter:
          "Développeuse Svelte débutante, j'aimerais apprendre en contribuant à un projet éducatif. J'ai de bonnes bases en JavaScript mais je découvre Svelte.",
        selectedKeyFeatures: [{ feature: "Interface utilisateur moderne" }],
        selectedProjectGoals: [{ goal: "Faciliter l'apprentissage du code" }],
      },
    ],
    teamMembers: [
      {
        id: "member-5",
        name: "Marcus Johnson",
        avatarUrl: "/icons/exemplebyronIcon.svg",
        role: "Rust Developer",
        joinedAt: new Date("2024-01-10T09:15:00Z"),
        techStacks: [
          { id: "18", name: "Rust" },
          { id: "19", name: "WASM" },
        ],
      },
    ],
  },
  {
    id: "5",
    title: "DataViz",
    shortDescription: "Bibliothèque de visualisation de données",
    image: "/icons/gitifyIcon.png",
    status: "DRAFT",
    techStacks: [
      {
        id: "21",
        name: "D3.js",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/d3js/d3js-original.svg",
      },
      {
        id: "22",
        name: "Python",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
      },
      {
        id: "23",
        name: "Jupyter",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jupyter/jupyter-original.svg",
      },
    ],
    author: {
      id: "user-1",
      name: "69Kilian",
      avatarUrl: "/icons/user-placeholder.svg",
    },
    applications: [
      {
        id: "app-12",
        status: "PENDING",
        applicant: {
          id: "user-13",
          name: "Yuki Tanaka",
          avatarUrl: "/icons/exemplebyronIcon.svg",
          email: "yuki.tanaka@email.com",
        },
        projectRole: {
          id: "role-11",
          title: "Data Scientist",
          description: "Développer les algorithmes de visualisation",
          techStacks: [
            {
              id: "22",
              name: "Python",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
            },
            {
              id: "24",
              name: "Pandas",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg",
            },
            {
              id: "25",
              name: "NumPy",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg",
            },
          ],
          roleCount: 1,
        },
        appliedAt: new Date("2024-01-17T08:00:00Z"),
        motivationLetter:
          "Data Scientist avec une expertise en visualisation de données. J'ai travaillé sur plusieurs projets de data viz et je peux contribuer à créer des algorithmes performants.",
        selectedKeyFeatures: [
          { feature: "Graphiques interactifs" },
          { feature: "Support multi-formats" },
        ],
        selectedProjectGoals: [
          { goal: "Simplifier la visualisation de données" },
          { goal: "Améliorer l'expérience utilisateur" },
        ],
      },
    ],
    teamMembers: [],
  },
  {
    id: "6",
    title: "SecureChat",
    shortDescription: "Application de messagerie chiffrée",
    image: "/icons/gitifyIcon.png",
    status: "PUBLISHED",
    techStacks: [
      {
        id: "26",
        name: "Go",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg",
      },
      {
        id: "27",
        name: "WebRTC",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/webrtc/webrtc-original.svg",
      },
      {
        id: "28",
        name: "WebCrypto",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/webcrypto/webcrypto-original.svg",
      },
    ],
    author: {
      id: "user-1",
      name: "69Kilian",
      avatarUrl: "/icons/user-placeholder.svg",
    },
    applications: [
      {
        id: "app-13",
        status: "ACCEPTED",
        applicant: {
          id: "user-14",
          name: "Ahmed Hassan",
          avatarUrl: "/icons/exemplebyronIcon.svg",
          email: "ahmed.hassan@email.com",
        },
        projectRole: {
          id: "role-12",
          title: "Security Engineer",
          description: "Implémenter les protocoles de chiffrement",
          techStacks: [
            {
              id: "28",
              name: "WebCrypto",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/webcrypto/webcrypto-original.svg",
            },
            {
              id: "29",
              name: "Signal Protocol",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/signal/signal-original.svg",
            },
          ],
          roleCount: 1,
        },
        appliedAt: new Date("2024-01-06T13:20:00Z"),
        decidedAt: new Date("2024-01-07T10:45:00Z"),
        motivationLetter:
          "Expert en sécurité informatique avec une forte expérience en cryptographie. J'ai contribué à plusieurs projets de messagerie sécurisée et je peux implémenter des protocoles robustes.",
        selectedKeyFeatures: [
          { feature: "Chiffrement de bout en bout" },
          { feature: "Messagerie sécurisée" },
        ],
        selectedProjectGoals: [
          { goal: "Protéger la vie privée des utilisateurs" },
          { goal: "Créer une messagerie fiable" },
        ],
      },
      {
        id: "app-14",
        status: "PENDING",
        applicant: {
          id: "user-15",
          name: "Isabella Silva",
          avatarUrl: "/icons/exemplebyronIcon.svg",
          email: "isabella.silva@email.com",
        },
        projectRole: {
          id: "role-13",
          title: "Go Developer",
          description: "Développer le backend en Go",
          techStacks: [
            {
              id: "26",
              name: "Go",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg",
            },
            {
              id: "30",
              name: "Gin",
              iconUrl:
                "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gin/gin-original.svg",
            },
          ],
          roleCount: 1,
        },
        appliedAt: new Date("2024-01-18T15:30:00Z"),
        motivationLetter:
          "Développeuse Go avec une passion pour la sécurité. J'ai une forte expérience en développement backend et je peux contribuer à créer une architecture robuste et performante.",
        selectedKeyFeatures: [
          { feature: "API REST sécurisée" },
          { feature: "Performance optimisée" },
        ],
        selectedProjectGoals: [
          { goal: "Protéger la vie privée des utilisateurs" },
          { goal: "Créer une messagerie fiable" },
        ],
      },
    ],
    teamMembers: [
      {
        id: "member-6",
        name: "Ahmed Hassan",
        avatarUrl: "/icons/exemplebyronIcon.svg",
        role: "Security Engineer",
        joinedAt: new Date("2024-01-07T10:45:00Z"),
        techStacks: [
          { id: "28", name: "WebCrypto" },
          { id: "29", name: "Signal Protocol" },
        ],
      },
    ],
  },
];
