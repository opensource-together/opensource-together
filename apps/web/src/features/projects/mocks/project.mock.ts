import { Project } from "../types/project.type";

export const mockProjects: Project[] = [
  {
    id: "1",
    slug: "leetgrind",
    title: "LeetGrind",
    categories: [
      { id: "1", name: "Discord" },
      { id: "2", name: "Bot" },
      { id: "3", name: "Open Source" },
    ],
    projectStats: {
      contributors: [
        {
          login: "Byron M",
          avatar_url: "/icons/exemplebyronIcon.svg",
          html_url: "https://github.com/Byron M",
          contributions: 3,
        },
        {
          login: "Killian C",
          avatar_url: "/icons/killiancodes-icon.jpg",
          html_url: "https://github.com/Killian C",
          contributions: 2,
        },
        {
          login: "P2aco Dev",
          avatar_url: "/icons/p2aco-icon.png",
          html_url: "https://github.com/P2aco Dev",
          contributions: 1,
        },
      ],
    },
    image:
      "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Fwww.leetgrindbot.com%2F",

    author: {
      ownerId: "1",
      name: "y2_dev",
      avatarUrl:
        "https://pbs.twimg.com/profile_images/1799769138413391872/USSwdetq_400x400.jpg",
    },
    shortDescription:
      "Un bot Discord pour pratiquer LeetCode chaque jour et progresser en algo.",
    longDescription:
      "LeetGrind est un bot Discord qui propose un challenge LeetCode aléatoire chaque jour à une communauté active de développeurs. Avec un système de classement, un canal dédié à l'entraide et une interface ludique, LeetGrind aide les développeurs à coder de façon régulière, à progresser ensemble et à retrouver la motivation au quotidien.",
    status: "PUBLISHED",
    techStacks: [
      {
        id: "3",
        name: "Nest.js",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg",
      },
      {
        id: "5",
        name: "Next.js",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
      },
      {
        id: "6",
        name: "Tailwind CSS",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
      },
      {
        id: "1",
        name: "TypeScript",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      },
      {
        id: "4",
        name: "PostgreSQL",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
      },
      {
        id: "3",
        name: "Discord API",
        iconUrl:
          "https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png",
      },
    ],
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2025-05-15"),
    projectRoles: [
      {
        id: "1",
        projectId: "1",
        title: "Développeur·se Frontend",
        description:
          "Aidez-nous à créer un dashboard web (Next.js) pour suivre les classements, les statistiques des challenges et la personnalisation du bot.",
        techStacks: [
          { id: "1", name: "Next.js" },
          { id: "2", name: "React" },
        ],
      },
      {
        id: "2",
        projectId: "1",
        title: "UI/UX Designer",
        description:
          "Aidez-nous à créer un dashboard web (Next.js) pour suivre les classements, les statistiques des challenges et la personnalisation du bot.",
        techStacks: [
          { id: "1", name: "Next.js" },
          { id: "2", name: "React" },
        ],
      },
      {
        id: "3",
        projectId: "1",
        title: "Développeur·se Backend",
        description:
          "Nous recherchons un·e développeur·se Nest.js pour ajouter des fonctionnalités au bot LeetGrind : Multi-serveur, API publique, intégration Discord...",
        techStacks: [
          { id: "1", name: "Nest.js" },
          { id: "2", name: "PostgreSQL" },
        ],
      },
    ],
    externalLinks: [
      { type: "github", url: "https://github.com/LeetGrindBot" },
      { type: "website", url: "https://leetgrindbot.com/" },
      { type: "twitter", url: "https://x.com/y2_dev" },
    ],

    keyFeatures: [
      { id: "1", feature: "Défis LeetCode quotidiens automatisés" },
      { id: "2", feature: "Système de classement compétitif" },
      { id: "3", feature: "Canal d'entraide communautaire" },
      { id: "4", feature: "Interface Discord intuitive" },
      { id: "5", feature: "Suivi des progrès personnalisé" },
    ],
    projectGoals: [
      {
        id: "1",
        goal: "Aider 1000+ développeurs à améliorer leurs compétences en algorithmie",
      },
      {
        id: "2",
        goal: "Créer une communauté active et bienveillante autour de la programmation",
      },
      {
        id: "3",
        goal: "Développer des fonctionnalités avancées de gamification",
      },
      { id: "4", goal: "Intégrer des statistiques détaillées de progression" },
    ],
  },
  {
    id: "7",
    slug: "gitify",
    title: "Gitify",
    projectStats: {
      contributors: [
        {
          login: "Byron M",
          avatar_url: "/icons/exemplebyronIcon.svg",
          html_url: "https://github.com/Byron M",
          contributions: 3,
        },
        {
          login: "Killian C",
          avatar_url: "/icons/killiancodes-icon.jpg",
          html_url: "https://github.com/Killian C",
          contributions: 2,
        },
        {
          login: "P2aco Dev",
          avatar_url: "/icons/p2aco-icon.png",
          html_url: "https://github.com/P2aco Dev",
          contributions: 1,
        },
      ],
    },
    image: "/icons/gitifyIcon.png",
    categories: [
      { id: "1", name: "GitHub" },
      { id: "2", name: "Open Source" },
      { id: "3", name: "Challenges" },
    ],
    author: {
      ownerId: "1",
      name: "69Killian",
      avatarUrl: "/icons/killiancodes-icon.jpg",
    },
    shortDescription:
      "Réalise des challenges en contribuant à des projets open source.",
    longDescription:
      "Gitify est une application pour réaliser des challenges et gagner des techStacks en contribuant à des projets open source. Elle permet de suivre les notifications, les messages et les demandes de pull request de vos projets GitHub.",
    status: "PUBLISHED",
    techStacks: [
      {
        id: "2",
        name: "Next.js",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
      },
      {
        id: "1",
        name: "TypeScript",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      },
      {
        id: "3",
        name: "Tailwind CSS",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
      },
      {
        id: "4",
        name: "PostgreSQL",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
      },
    ],
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2025-05-15"),
    projectRoles: [
      {
        id: "1",
        projectId: "7",
        title: "Développeur·se Frontend",
        description:
          "Aidez-nous à créer un dashboard web (Next.js) pour suivre les classements, les statistiques des challenges et la personnalisation du bot.",
        techStacks: [
          { id: "1", name: "Next.js" },
          { id: "2", name: "React" },
        ],
      },
      {
        id: "2",
        projectId: "7",
        title: "Développeur·se Backend",
        description:
          "Nous recherchons un·e développeur·se Next.js pour ajouter des fonctionnalités au bot LeetGrind : Multi-serveur, API publique, intégration Discord...",
        techStacks: [
          { id: "1", name: "Next.js" },
          { id: "2", name: "PostgreSQL" },
        ],
      },
    ],
    externalLinks: [
      { type: "github", url: "https://github.com/69killian/Gitify" },
      {
        type: "website",
        url: "https://warmhearted-imagine-949567.framer.app/",
      },
      { type: "twitter", url: "https://x.com/y2_dev" },
    ],

    keyFeatures: [
      { id: "1", feature: "Système de challenges open source" },
      { id: "2", feature: "techStacks de progression personnalisés" },
      { id: "3", feature: "Notifications GitHub intégrées" },
      { id: "4", feature: "Suivi des pull requests" },
      { id: "5", feature: "Interface moderne et intuitive" },
    ],
    projectGoals: [
      { id: "1", goal: "Gamifier la contribution à l'open source" },
      { id: "2", goal: "Créer une communauté de contributeurs actifs" },
      { id: "3", goal: "Simplifier la découverte de projets open source" },
      { id: "4", goal: "Encourager les développeurs débutants à contribuer" },
    ],
  },
  {
    id: "2",
    slug: "devcord",
    title: "DevCord",
    categories: [
      { id: "1", name: "Discord" },
      { id: "2", name: "Bot" },
      { id: "3", name: "Open Source" },
    ],
    projectStats: {
      contributors: [
        {
          login: "Lhourquin",
          avatar_url: "https://avatars.githubusercontent.com/u/45101981?v=4",
          html_url: "https://github.com/Lhourquin",
          contributions: 3,
        },
        {
          login: "Killian C",
          avatar_url: "/icons/killiancodes-icon.jpg",
          html_url: "https://github.com/Killian C",
          contributions: 2,
        },
        {
          login: "P2aco Dev",
          avatar_url: "/icons/p2aco-icon.png",
          html_url: "https://github.com/P2aco Dev",
          contributions: 1,
        },
      ],
    },
    image:
      "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Fdocs.devcord.app%2Fintroduction",
    author: {
      ownerId: "1",
      name: "p2aco",
      avatarUrl: "/icons/p2aco-icon.png",
    },
    shortDescription:
      "Le bot ultime pour les développeurs, directement intégré à Discord et Slack.",
    longDescription:
      "DevCord est un bot conçu pour booster la productivité des développeurs grâce à des commandes simples et puissantes intégrées à Discord et Slack. Qu'il s'agisse de formater du code, de générer des tâches cron, de convertir des formats ou de valider des regex, DevCord est votre copilote de développement. 100% gratuit, rapide et pensé pour les équipes modernes, avec une documentation claire et complète.",
    status: "PUBLISHED",
    techStacks: [
      {
        id: "1",
        name: "Go",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg",
      },
      {
        id: "5",
        name: "Next.js",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
      },
      {
        id: "4",
        name: "PostgreSQL",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
      },
      {
        id: "3",
        name: "Discord API",
        iconUrl:
          "https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png",
      },
      {
        id: "3",
        name: "Slack API",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/slack/slack-original.svg",
      },
    ],
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-05-15"),
    projectRoles: [
      {
        id: "1",
        projectId: "2",
        title: "Contributeur·rice Documentation",
        description:
          "Participez à la rédaction de la documentation officielle (https://docs.devcord.app) pour rendre DevCord encore plus accessible à la communauté.",
        techStacks: [
          { id: "1", name: "Markdown" },
          { id: "2", name: "Rédaction technique" },
        ],
      },
      {
        id: "2",
        projectId: "2",
        title: "Développeur·se Backend",
        description:
          "Aidez-nous à améliorer le cœur du bot : parsing intelligent, génération dynamique de commandes, gestion des formats, et plus encore. Une bonne connaissance de Go est attendue.",
        techStacks: [
          { id: "1", name: "Golang" },
          { id: "2", name: "REST API" },
        ],
      },
    ],
    externalLinks: [
      { type: "github", url: "https://github.com/devcord-bot/devcord" },
      { type: "website", url: "https://docs.devcord.app/introduction" },
      { type: "twitter", url: "https://x.com/theotruvelot" },
    ],

    keyFeatures: [
      { id: "1", feature: "Commandes de formatage de code intégrées" },
      { id: "5", feature: "Support Discord et Slack" },
    ],
    projectGoals: [
      {
        id: "1",
        goal: "Devenir l'outil de référence pour les développeurs sur Discord/Slack",
      },
      { id: "2", goal: "Intégrer plus de 50 commandes utilitaires" },
      { id: "3", goal: "Supporter 10+ plateformes de communication" },
      { id: "4", goal: "Créer une API publique pour les développeurs" },
    ],
  },
  {
    id: "6",
    slug: "codesnippet",
    title: "CodeSnippet",
    image: "/icons/codesnippet-icon.png",
    categories: [
      { id: "1", name: "IDE" },
      { id: "2", name: "Open Source" },
      { id: "3", name: "Snippets" },
    ],
    author: {
      ownerId: "1",
      name: "Spectre",
      avatarUrl:
        "https://pbs.twimg.com/profile_images/1922394540058517504/LeIKSyDr_400x400.jpg",
    },
    shortDescription:
      "Stockez, organisez et découvrez des snippets de code avec facilité.",
    longDescription:
      "CodeSnippet révolutionne la gestion du code pour les développeurs. Notre plateforme vous permet de stocker, organiser et découvrir facilement des snippets de code. Le Hub communautaire vous offre la possibilité de partager et d'explorer des snippets créés par d'autres développeurs. Simplifiez votre flux de travail et apprenez des autres—votre code, toujours à portée de main.",
    status: "PUBLISHED",
    techStacks: [
      {
        id: "2",
        name: "Next.js",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
      },
      {
        id: "1",
        name: "TypeScript",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      },
      {
        id: "3",
        name: "Tailwind CSS",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
      },
      {
        id: "5",
        name: "Node.js",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
      },
      {
        id: "4",
        name: "PostgreSQL",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
      },
    ],
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2025-05-15"),
    projectRoles: [
      {
        id: "1",
        projectId: "6",
        title: "UI/UX Designer",
        description:
          "Conçois l'interface utilisateur de CodeSnippet et améliore l'expérience de développement des composants.",
        techStacks: [
          { id: "1", name: "Figma" },
          { id: "2", name: "Design System" },
        ],
      },
      {
        id: "2",
        projectId: "6",
        title: "Développeur·se Backend",
        description:
          "Développe l'API et le système de stockage des snippets, avec un focus sur la performance et la scalabilité.",
        techStacks: [
          { id: "3", name: "PostgreSQL" },
          { id: "4", name: "API REST" },
        ],
      },
    ],
    externalLinks: [
      { type: "github", url: "https://github.com/codesnippet/codesnippet" },
      { type: "website", url: "code-snippet-mocha.vercel.app" },
      { type: "twitter", url: "https://twitter.com/codesnippet" },
    ],
    projectStats: {
      contributors: [
        { login: "y2_dev", avatar_url: "", html_url: "", contributions: 5 },
      ],
      stars: 42,
      forks: 8,
      lastCommit: {
        date: new Date("2024-01-01T00:00:00Z").toISOString(),
        message: "Initial commit",
        sha: "1234567890",
        url: "https://github.com/LeetGrindBot/LeetGrindBot/commit/1234567890",
        author: { login: "y2_dev", avatar_url: "", html_url: "" },
      },
    },
    keyFeatures: [
      { id: "1", feature: "Stockage et organisation de snippets" },
      { id: "2", feature: "Hub communautaire de partage" },
      { id: "3", feature: "Recherche avancée par tags et langages" },
      { id: "4", feature: "Intégration IDE via extensions" },
      { id: "5", feature: "Système de notation et commentaires" },
    ],
    projectGoals: [
      { id: "1", goal: "Devenir la référence pour le stockage de snippets" },
      { id: "2", goal: "Construire une communauté de 10k+ développeurs" },
      { id: "3", goal: "Intégrer tous les IDEs populaires" },
      { id: "4", goal: "Créer un marketplace de snippets premium" },
    ],
  },
  {
    id: "5",
    slug: "nextsandbox",
    title: "NextSandbox",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
    author: {
      ownerId: "1",
      name: "Byron Love",
      avatarUrl: "exemplebyronIcon.svg",
    },
    shortDescription:
      "Une alternative légère et intégrée à Storybook, spécialement optimisée pour Next.js, permettant de visualiser, tester et documenter facilement vos composants UI.",
    longDescription:
      "NextSandbox est une solution moderne pour le développement et la documentation de composants UI dans l'écosystème Next.js. Elle offre une alternative plus légère et mieux intégrée que Storybook, avec des fonctionnalités spécifiques pour Next.js comme le support natif des Server Components, l'optimisation des images, et l'intégration avec le système de routing.",
    status: "PUBLISHED",
    techStacks: [
      {
        id: "1",
        name: "Next.js",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
      },
      {
        id: "2",
        name: "TypeScript",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      },
      {
        id: "3",
        name: "Tailwind CSS",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
      },
      {
        id: "4",
        name: "Node.js",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
      },
      {
        id: "5",
        name: "npm",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg",
      },
    ],
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2025-05-15"),
    projectRoles: [
      {
        id: "1",
        projectId: "5",
        title: "Développeur·se Core",
        description:
          "Participe au développement du cœur de NextSandbox : système de rendu des composants, hot-reload, et intégration avec Next.js.",
        techStacks: [
          { id: "1", name: "Next.js" },
          { id: "2", name: "TypeScript" },
        ],
      },
      {
        id: "2",
        projectId: "5",
        title: "Designer UI/UX",
        description:
          "Conçois l'interface utilisateur de NextSandbox et améliore l'expérience de développement des composants.",
        techStacks: [
          { id: "3", name: "React" },
          { id: "4", name: "Tailwind" },
        ],
      },
    ],
    externalLinks: [
      { type: "github", url: "https://github.com/nextsandbox/nextsandbox" },
      { type: "website", url: "https://nextsandbox.dev" },
      { type: "twitter", url: "https://twitter.com/nextsandbox" },
    ],
    categories: [
      { id: "1", name: "Next.js" },
      { id: "2", name: "Open Source" },
      { id: "3", name: "UI/UX" },
    ],
    projectStats: {
      contributors: [
        { login: "y2_dev", avatar_url: "", html_url: "", contributions: 3 },
      ],
      stars: 28,
      forks: 5,
      lastCommit: {
        date: new Date("2024-01-01T00:00:00Z").toISOString(),
        message: "Initial commit",
        sha: "1234567890",
        url: "https://github.com/LeetGrindBot/LeetGrindBot/commit/1234567890",
        author: { login: "y2_dev", avatar_url: "", html_url: "" },
      },
    },
    keyFeatures: [
      { id: "1", feature: "Alternative légère à Storybook" },
      { id: "2", feature: "Support natif des Server Components" },
      { id: "3", feature: "Optimisation des images Next.js" },
      { id: "4", feature: "Hot-reload intelligent" },
      { id: "5", feature: "Intégration routing Next.js" },
    ],
    projectGoals: [
      {
        id: "1",
        goal: "Devenir l'alternative de référence à Storybook pour Next.js",
      },
      { id: "2", goal: "Atteindre 10k+ téléchargements mensuels" },
      { id: "3", goal: "Supporter toutes les fonctionnalités Next.js" },
      { id: "4", goal: "Créer un écosystème de plugins" },
    ],
  },

  {
    id: "4",
    slug: "g9s",
    title: "g9s",
    categories: [
      { id: "1", name: "Go" },
      { id: "2", name: "Open Source" },
      { id: "3", name: "Monitoring" },
    ],
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg",
    author: {
      ownerId: "1",
      name: "p2aco",
      avatarUrl: "/icons/p2aco-icon.png",
    },
    shortDescription:
      "Un outil terminal open source pour monitorer vos serveurs et containers en temps réel, inspiré de k9s avec une interface intuitive et des fonctionnalités avancées",
    longDescription:
      "g9s est une suite d'outils en ligne de commande pour visualiser, analyser et interagir avec vos serveurs et containers. Le projet est composé de trois modules : un serveur central qui collecte et expose les données, un agent qui remonte les infos système, et une interface terminal (TUI) élégante à la k9s. Le tout est développé en Go, orchestré via Docker et Kubernetes, et entièrement open source.",
    status: "PUBLISHED",
    techStacks: [
      {
        id: "1",
        name: "Go",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg",
      },
      {
        id: "2",
        name: "Docker",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg",
      },
      {
        id: "3",
        name: "Kubernetes",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg",
      },
    ],
    createdAt: new Date("2025-05-19"),
    updatedAt: new Date("2025-05-19"),
    projectRoles: [
      {
        id: "1",
        projectId: "4",
        title: "Développeur·se Backend Go",
        description:
          "Travaille sur l'API, la gestion des agents et le stockage des métriques serveur. Bonne connaissance de Go, REST, et des performances système requise.",
        techStacks: [
          { id: "1", name: "Go" },
          { id: "2", name: "Docker" },
        ],
      },
      {
        id: "2",
        projectId: "4",
        title: "Contributeur·rice TUI (CLI)",
        description:
          "Développe l'interface en terminal façon k9s/vim. Connaissances appréciées en curses/tcell et design UX dans le terminal.",
        techStacks: [
          { id: "3", name: "Terminal UI" },
          { id: "4", name: "Tcell" },
        ],
      },
    ],
    externalLinks: [
      { type: "github", url: "https://github.com/69killian/Gitify" },
      {
        type: "website",
        url: "https://warmhearted-imagine-949567.framer.app/",
      },
      { type: "twitter", url: "https://twitter.com/g9scli" },
    ],
    projectStats: {
      contributors: [
        { login: "y2_dev", avatar_url: "", html_url: "", contributions: 3 },
      ],
      stars: 15,
      forks: 2,
      lastCommit: {
        date: new Date("2024-01-01T00:00:00Z").toISOString(),
        message: "Initial commit",
        sha: "1234567890",
        url: "https://github.com/LeetGrindBot/LeetGrindBot/commit/1234567890",
        author: { login: "y2_dev", avatar_url: "", html_url: "" },
      },
    },
    keyFeatures: [
      { id: "1", feature: "Interface terminal façon k9s" },
      { id: "2", feature: "Monitoring temps réel des conteneurs" },
      { id: "3", feature: "Architecture modulaire (serveur/agent/TUI)" },
      { id: "4", feature: "Métriques système détaillées" },
      { id: "5", feature: "Auto-hébergement et open source" },
    ],
    projectGoals: [
      {
        id: "1",
        goal: "Devenir l'alternative open source à Datadog pour les équipes DevOps",
      },
      { id: "2", goal: "Supporter Kubernetes et Docker nativement" },
      { id: "3", goal: "Créer une communauté d'utilisateurs DevOps" },
      { id: "4", goal: "Intégrer des alertes intelligentes" },
    ],
  },
  {
    id: "8",
    slug: "sherpa",
    title: "Sherpa",
    categories: [
      { id: "1", name: "Go" },
      { id: "2", name: "Open Source" },
      { id: "3", name: "Secrets" },
    ],
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg",
    author: {
      ownerId: "1",
      name: "Olyxz16",
      avatarUrl:
        "https://media.discordapp.net/attachments/1337829619629424711/1374073158629593211/Sans_titre.png?ex=682cb8da&is=682b675a&hm=3208e6ba63ac6ea8b76686536217505cdddac1972dd760c6523dbea8d85da3d3&=&format=webp&quality=lossless&width=1080&height=1080",
    },
    shortDescription:
      "Un outil de transfert de variable d'environnement sécurisé et collaboratif, permettant de partager facilement vos configurations entre équipes",
    longDescription:
      "Sherpa est un outil permettant de transférer ses variables d'environnement de manière sécurisé, pour soi ou pour son équipe. Avec un système de chiffrement zero-trust, on assure la sécurité des données transférées",
    status: "PUBLISHED",
    techStacks: [
      {
        id: "1",
        name: "Golang",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg",
      },
      {
        id: "2",
        name: "VueJS",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg",
      },
      {
        id: "3",
        name: "PostgreSQL",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
      },
      {
        id: "4",
        name: "Docker",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg",
      },
    ],
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2025-05-15"),
    projectRoles: [
      {
        id: "1",
        projectId: "8",
        title: "Développeur·se Backend",
        description:
          "Nous recherchons un·e développeur·se Golang pour ajouter des fonctionnalités à Sherpa : Chiffrement, gestion des équipes ...",
        techStacks: [
          { id: "1", name: "Golang" },
          { id: "2", name: "PostgreSQL" },
        ],
      },
      {
        id: "2",
        projectId: "8",
        title: "Développeur·se Frontend",
        description:
          "Aidez-nous à créer un dashboard web (Next.js) pour suivre les classements, les statistiques des challenges et la personnalisation du bot.",
        techStacks: [
          { id: "3", name: "VueJS" },
          { id: "4", name: "Next.js" },
          { id: "5", name: "Tailwind" },
        ],
      },
    ],
    externalLinks: [
      { type: "github", url: "https://github.com/Olyxz16/sherpa" },
      { type: "twitter", url: "https://x.com/Ox16__" },
    ],
    projectStats: {
      contributors: [
        { login: "y2_dev", avatar_url: "", html_url: "", contributions: 2 },
      ],
      stars: 6,
      forks: 0,
      lastCommit: {
        date: new Date("2024-01-01T00:00:00Z").toISOString(),
        message: "Initial commit",
        sha: "1234567890",
        url: "https://github.com/LeetGrindBot/LeetGrindBot/commit/1234567890",
        author: { login: "y2_dev", avatar_url: "", html_url: "" },
      },
    },
    keyFeatures: [
      { id: "1", feature: "Chiffrement zero-trust des données" },
      { id: "2", feature: "Partage collaboratif en équipe" },
      { id: "3", feature: "Interface CLI et web intuitive" },
      { id: "4", feature: "Gestion des environnements multiples" },
      { id: "5", feature: "Synchronisation automatique" },
    ],
    projectGoals: [
      {
        id: "1",
        goal: "Simplifier la gestion des secrets pour les développeurs",
      },
      { id: "2", goal: "Assurer une sécurité maximale des données sensibles" },
      {
        id: "3",
        goal: "Créer une alternative open source aux outils propriétaires",
      },
      { id: "4", goal: "Intégrer les principaux outils de CI/CD" },
    ],
  },
  {
    id: "3",
    slug: "liltea",
    title: "Liltea.me",
    categories: [
      { id: "1", name: "Next.js" },
      { id: "2", name: "Open Source" },
      { id: "3", name: "Bio" },
    ],
    image:
      "https://pbs.twimg.com/profile_images/1865742929723064320/p6I7UUXh_400x400.jpg",
    author: {
      ownerId: "1",
      name: "Shyybi",
      avatarUrl: "/icons/shyybi-icon.png",
    },
    shortDescription:
      "Crée ton profil bio stylé, rapide et animé — comme guns.lol, mais avec ta touche. Une plateforme moderne pour centraliser tous tes liens importants sur une page élégante et responsive",
    longDescription:
      "Liltea est une plateforme de biographie moderne qui te permet de centraliser tous tes liens importants (réseaux sociaux, projets, contenus) sur une page élégante et responsive. Liltea offre une expérience fluide, rapide et personnalisable, propulsée par une stack moderne. Idéal pour les créateurs, développeurs, streamers ou freelances qui souhaitent partager leur univers en un seul lien.",
    status: "PUBLISHED",
    techStacks: [
      {
        id: "1",
        name: "Next.js",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
      },
      {
        id: "2",
        name: "TypeScript",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      },
      {
        id: "3",
        name: "Tailwind CSS",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
      },
      {
        id: "4",
        name: "Fastify",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastify/fastify-original.svg",
      },
    ],
    createdAt: new Date("2025-04-10"),
    updatedAt: new Date("2025-05-19"),
    projectRoles: [
      {
        id: "1",
        projectId: "3",
        title: "Développeur·se Fullstack",
        description:
          "Participe au développement de Liltea avec Next.js, Fastify et TailwindCSS. Ton rôle inclara la création de composants UI, la gestion des APIs et l'optimisation des performances.",
        techStacks: [
          { id: "1", name: "Next.js" },
          { id: "2", name: "Fastify" },
        ],
      },
      {
        id: "2",
        projectId: "3",
        title: "Designer UI/UX",
        description:
          "Aide-nous à concevoir des interfaces élégantes et intuitives pour les pages de profil. Une sensibilité pour les designs minimalistes et responsives est un plus.",
        techStacks: [
          { id: "3", name: "Figma" },
          { id: "4", name: "Design System" },
        ],
      },
    ],
    externalLinks: [
      { type: "github", url: "https://github.com/liltea-dev/liltea" },
      { type: "website", url: "https://liltea.app" },
      { type: "twitter", url: "https://twitter.com/lilteaapp" },
    ],
    projectStats: {
      contributors: [
        { login: "y2_dev", avatar_url: "", html_url: "", contributions: 4 },
      ],
      stars: 37,
      forks: 5,
      lastCommit: {
        date: new Date("2024-01-01T00:00:00Z").toISOString(),
        message: "Initial commit",
        sha: "1234567890",
        url: "https://github.com/LeetGrindBot/LeetGrindBot/commit/1234567890",
        author: { login: "y2_dev", avatar_url: "", html_url: "" },
      },
    },
    keyFeatures: [
      { id: "1", feature: "Pages bio stylées et animées" },
      { id: "2", feature: "Thèmes personnalisables" },
      { id: "3", feature: "Centralisation de tous tes liens" },
      { id: "4", feature: "Design responsive optimisé" },
      { id: "5", feature: "Analyses de trafic intégrées" },
    ],
    projectGoals: [
      { id: "1", goal: "Devenir l'alternative moderne à Linktree" },
      { id: "2", goal: "Atteindre 100k+ utilisateurs actifs" },
      { id: "3", goal: "Créer un marketplace de thèmes communautaires" },
      { id: "4", goal: "Intégrer des fonctionnalités e-commerce" },
    ],
  },
  {
    id: "9",
    slug: "devspace",
    title: "DevSpace",
    categories: [
      { id: "1", name: "Go" },
      { id: "2", name: "Open Source" },
      { id: "3", name: "Monitoring" },
    ],
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg",
    author: {
      ownerId: "1",
      name: "Sarah Miller",
      avatarUrl: "exemplebyronIcon.svg",
    },
    shortDescription:
      "Une plateforme de développement cloud qui simplifie la configuration et le partage d'environnements de développement.",
    longDescription:
      "DevSpace permet aux équipes de développement de créer, partager et gérer des environnements de développement dans le cloud. Il automatise la configuration des environnements, facilite le partage entre développeurs et assure la cohérence entre les environnements de développement et de production.",
    status: "PUBLISHED",
    techStacks: [
      {
        id: "1",
        name: "Go",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg",
      },
      {
        id: "2",
        name: "Docker",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg",
      },
      {
        id: "3",
        name: "Kubernetes",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg",
      },
    ],
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2025-05-15"),
    projectRoles: [
      {
        id: "1",
        projectId: "9",
        title: "Développeur·se Backend Go ",
        description:
          "Développe le cœur de la plateforme en Go, avec un focus sur la gestion des conteneurs et l'orchestration.",
        techStacks: [
          { id: "1", name: "Go" },
          { id: "2", name: "Docker" },
        ],
      },
      {
        id: "2",
        projectId: "9",
        title: "DevOps Engineer",
        description:
          "Gère l'infrastructure cloud et l'automatisation des déploiements.",
        techStacks: [
          { id: "3", name: "Kubernetes" },
          { id: "4", name: "CI/CD" },
        ],
      },
    ],
    externalLinks: [
      { type: "github", url: "https://github.com/devspace-platform" },
      { type: "website", url: "https://devspace.cloud" },
      { type: "twitter", url: "https://twitter.com/devspace_cloud" },
    ],
    projectStats: {
      contributors: [
        { login: "y2_dev", avatar_url: "", html_url: "", contributions: 8 },
      ],
      stars: 156,
      forks: 23,
      lastCommit: {
        date: new Date("2024-01-01T00:00:00Z").toISOString(),
        message: "Initial commit",
        sha: "1234567890",
        url: "https://github.com/LeetGrindBot/LeetGrindBot/commit/1234567890",
        author: { login: "y2_dev", avatar_url: "", html_url: "" },
      },
    },
    keyFeatures: [
      { id: "1", feature: "Environnements cloud instantanés" },
      { id: "2", feature: "Configuration automatisée" },
      { id: "3", feature: "Partage d'environnements en équipe" },
      { id: "4", feature: "Intégration Docker/Kubernetes" },
      { id: "5", feature: "Templates prêts à l'emploi" },
    ],
    projectGoals: [
      {
        id: "1",
        goal: "Révolutionner le setup des environnements de développement",
      },
      { id: "2", goal: "Supporter 50+ stacks techniques populaires" },
      { id: "3", goal: "Créer une marketplace de templates" },
      { id: "4", goal: "Atteindre 10k+ développeurs utilisateurs" },
    ],
  },
  {
    id: "10",
    slug: "techdocs",
    title: "TechDocs",
    categories: [
      { id: "1", name: "Next.js" },
      { id: "2", name: "Open Source" },
      { id: "3", name: "Documentation" },
    ],
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/markdown/markdown-original.svg",
    author: {
      ownerId: "1",
      name: "Emma Wilson",
      avatarUrl: "exemplebyronIcon.svg",
    },
    shortDescription:
      "Une plateforme de documentation technique collaborative avec support Markdown et intégration Git.",
    longDescription:
      "TechDocs est une plateforme moderne pour la documentation technique qui permet aux équipes de créer, maintenir et partager leur documentation de manière collaborative. Elle offre une interface intuitive pour l'édition Markdown, la versioning avec Git, et l'intégration avec les outils de développement existants.",
    status: "PUBLISHED",
    techStacks: [
      {
        id: "1",
        name: "Next.js",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
      },
      {
        id: "2",
        name: "TypeScript",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      },
      {
        id: "3",
        name: "PostgreSQL",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
      },
    ],
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2025-05-15"),
    projectRoles: [
      {
        id: "1",
        projectId: "10",
        title: "Développeur·se Fullstack",
        description:
          "Développe les fonctionnalités de la plateforme, de l'éditeur Markdown à l'intégration Git.",
        techStacks: [
          { id: "1", name: "Next.js" },
          { id: "2", name: "TypeScript" },
        ],
      },
      {
        id: "2",
        projectId: "10",
        title: "Développeur·se Backend",
        description:
          "Gère le stockage et la versioning de la documentation, avec un focus sur la performance.",
        techStacks: [
          { id: "3", name: "PostgreSQL" },
          { id: "4", name: "Git" },
        ],
      },
    ],
    externalLinks: [
      { type: "github", url: "https://github.com/techdocs-platform" },
      { type: "website", url: "https://techdocs.dev" },
      { type: "twitter", url: "https://twitter.com/techdocs_platform" },
    ],
    projectStats: {
      contributors: [
        { login: "y2_dev", avatar_url: "", html_url: "", contributions: 5 },
      ],
      stars: 112,
      forks: 18,
      lastCommit: {
        date: new Date("2024-01-01T00:00:00Z").toISOString(),
        message: "Initial commit",
        sha: "1234567890",
        url: "https://github.com/LeetGrindBot/LeetGrindBot/commit/1234567890",
        author: { login: "y2_dev", avatar_url: "", html_url: "" },
      },
    },
    keyFeatures: [
      { id: "1", feature: "Éditeur Markdown collaboratif" },
      { id: "2", feature: "Versioning Git natif" },
      { id: "3", feature: "Templates de documentation" },
      { id: "4", feature: "Recherche avancée" },
      { id: "5", feature: "Intégration outils développement" },
    ],
    projectGoals: [
      { id: "1", goal: "Devenir la référence pour la documentation technique" },
      { id: "2", goal: "Intégrer tous les principaux outils de développement" },
      { id: "3", goal: "Créer une communauté de rédacteurs techniques" },
      { id: "4", goal: "Atteindre 50k+ documents créés" },
    ],
  },
];
