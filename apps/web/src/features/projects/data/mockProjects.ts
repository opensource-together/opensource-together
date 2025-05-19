import { Project } from "../types/ProjectTypes";

export const mockProjects: Project[] = [
  {
    id: "1",
    slug: "leetgrind",
    title: "LeetGrind",
    image: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Fwww.leetgrindbot.com%2F",
    description: "Un bot Discord pour pratiquer LeetCode chaque jour et progresser en algorithme dans une ambiance motivante",
    longDescription: "LeetGrind est un bot Discord qui propose un challenge LeetCode aléatoire chaque jour à une communauté active de développeurs. Avec un système de classement, un canal dédié à l'entraide et une interface ludique, LeetGrind aide les développeurs à coder de façon régulière, à progresser ensemble et à retrouver la motivation au quotidien.",
    status: "PUBLISHED",
    techStacks: [
      { id: "1", name: "TypeScript", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
      { id: "3", name: "Nest.js", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg" },
      { id: "3", name: "Discord API", iconUrl: "https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png" },
      { id: "4", name: "PostgreSQL", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" }
    ],
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2025-05-15T00:00:00Z",
    roles: [
      {
        id: "1",
        title: "Développeur·se Backend",
        description: "Nous recherchons un·e développeur·se Nest.js pour ajouter des fonctionnalités au bot LeetGrind : Multi-serveur, API publique, intégration Discord...",
        badges: [
          { label: "Nest.js", color: "#43853D", bgColor: "#E6F4EA" },
          { label: "PostgreSQL", color: "#336791", bgColor: "#EDF2FA" }
        ]
      },
      {
        id: "2",
        title: "Développeur·se Frontend",
        description: "Aidez-nous à créer un dashboard web (Next.js) pour suivre les classements, les statistiques des challenges et la personnalisation du bot.",
        badges: [
          { label: "Next.js", color: "#000000", bgColor: "#F3F3F3" },
          { label: "React", color: "#61DAFB", bgColor: "#E0F7FA" }
        ]
      }
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/LeetGrindBot" },
      { type: "website", url: "https://leetgrindbot.com/" },
      { type: "twitter", url: "https://x.com/y2_dev" }
    ],
    communityStats: {
      contributors: 4,
      stars: 8,
      forks: 0
    },
    keyBenefits: [
      "Progresse chaque jour en algorithmie dans une ambiance bienveillante",
      "Travaille sur un projet open-source utile pour des centaines de développeurs",
      "Découvre les coulisses du développement d'un bot Discord communautaire"
    ]
  },
  {
    id: "2",
    slug: "devcord",
    title: "DevCord",
    image: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Fdocs.devcord.app%2Fintroduction",
    description: "Le bot ultime pour les développeurs, directement intégré à Discord et Slack",
    longDescription: "DevCord est un bot conçu pour booster la productivité des développeurs grâce à des commandes simples et puissantes intégrées à Discord et Slack. Qu'il s'agisse de formater du code, de générer des tâches cron, de convertir des formats ou de valider des regex, DevCord est votre copilote de développement. 100% gratuit, rapide et pensé pour les équipes modernes, avec une documentation claire et complète.",
    status: "PUBLISHED",
    techStacks: [
      { id: "1", name: "Go", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg" },
      { id: "2", name: "Discord API", iconUrl: "https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png" },
      { id: "3", name: "Slack API", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/slack/slack-original.svg" },
      { id: "4", name: "Docker", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg" }
    ],
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-05-15T00:00:00Z",
    roles: [
      {
        id: "1",
        title: "Développeur·se Backend Go",
        description: "Aidez-nous à améliorer le cœur du bot : parsing intelligent, génération dynamique de commandes, gestion des formats, et plus encore. Une bonne connaissance de Go est attendue.",
        badges: [
          { label: "Golang", color: "#00ADD8", bgColor: "#E0F7FA" },
          { label: "REST API", color: "#3E3E3E", bgColor: "#F0F0F0" }
        ]
      },
      {
        id: "2",
        title: "Contributeur·rice Documentation",
        description: "Participez à la rédaction de la documentation officielle (https://docs.devcord.app) pour rendre DevCord encore plus accessible à la communauté.",
        badges: [
          { label: "Markdown", color: "#000000", bgColor: "#F2F2F2" },
          { label: "Rédaction technique", color: "#673AB7", bgColor: "#EEE7F9" }
        ]
      }
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/devcord-bot/devcord" },
      { type: "website", url: "https://docs.devcord.app/introduction" },
      { type: "twitter", url: "https://x.com/theotruvelot" }
    ],
    communityStats: {
      contributors: 1,
      stars: 52,
      forks: 10
    },
    keyBenefits: [
      "Automatisez vos tâches courantes sans quitter Discord ou Slack",
      "Gagnez du temps avec des commandes puissantes prêtes à l'emploi",
      "Contribuez à un outil open-source utilisé par des équipes tech"
    ]
  },
  {
    id: "3",
    slug: "liltea",
    title: "Liltea.me",
    image: "https://media.discordapp.net/attachments/1313066773083459595/1313066775444983908/Lil_tea_tasse_fond_4x.jpg?ex=682c443a&is=682af2ba&hm=cb84ead9ca01d87a31cb26390a0c239f1c660bbcf0343b5a29f92a4e873ee601&=&format=webp&width=1744&height=1744",
    description: "Crée ton profil bio stylé, rapide et animé — comme guns.lol, mais avec ta touche",
    longDescription: "Liltea est une plateforme de biographie moderne qui te permet de centraliser tous tes liens importants (réseaux sociaux, projets, contenus) sur une page élégante et responsive. Liltea offre une expérience fluide, rapide et personnalisable, propulsée par une stack moderne. Idéal pour les créateurs, développeurs, streamers ou freelances qui souhaitent partager leur univers en un seul lien.",
    status: "PUBLISHED",
    techStacks: [
      { id: "1", name: "Next.js", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" },
      { id: "2", name: "TypeScript", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
      { id: "3", name: "Tailwind CSS", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
      { id: "4", name: "Fastify", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastify/fastify-original.svg" }
    ],
    createdAt: "2025-04-10T00:00:00Z",
    updatedAt: "2025-05-19T00:00:00Z",
    roles: [
      {
        id: "1",
        title: "Développeur·se Fullstack",
        description: "Participe au développement de Liltea avec Next.js, Fastify et TailwindCSS. Ton rôle inclara la création de composants UI, la gestion des APIs et l'optimisation des performances.",
        badges: [
          { label: "Next.js", color: "#000000", bgColor: "#F3F3F3" },
          { label: "Fastify", color: "#000000", bgColor: "#F3F3F3" }
        ]
      },
      {
        id: "2",
        title: "Designer UI/UX",
        description: "Aide-nous à concevoir des interfaces élégantes et intuitives pour les pages de profil. Une sensibilité pour les designs minimalistes et responsives est un plus.",
        badges: [
          { label: "Figma", color: "#A259FF", bgColor: "#F3F0FF" },
          { label: "Design System", color: "#FF6B6B", bgColor: "#FFECEC" }
        ]
      }
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/liltea-dev/liltea" },
      { type: "website", url: "https://liltea.app" },
      { type: "twitter", url: "https://twitter.com/lilteaapp" }
    ],
    communityStats: {
      contributors: 4,
      stars: 37,
      forks: 5
    },
    keyBenefits: [
      "Crée une page bio moderne et rapide en quelques clics",
      "Personnalise ton profil avec des thèmes et composants élégants",
      "Open-source et propulsé par une stack technique de pointe"
    ]
  },
  {
    id: "4",
    slug: "g9s",
    title: "g9s",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg",
    description: "Un outil terminal open source pour monitorer vos serveurs, inspiré de k9s",
    longDescription: "g9s est une suite d'outils en ligne de commande pour visualiser, analyser et interagir avec vos serveurs et containers. Le projet est composé de trois modules : un serveur central qui collecte et expose les données, un agent qui remonte les infos système, et une interface terminal (TUI) élégante à la k9s. Le tout est développé en Go, orchestré via Docker et Kubernetes, et entièrement open source.",
    status: "PUBLISHED",
    techStacks: [
      { id: "1", name: "Go", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg" },
      { id: "2", name: "Docker", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg" },
      { id: "3", name: "Kubernetes", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg" }
    ],
    createdAt: "2025-05-19T00:00:00Z",
    updatedAt: "2025-05-19T00:00:00Z",
    roles: [
      {
        id: "1",
        title: "Développeur·se Backend Go",
        description: "Travaille sur l'API, la gestion des agents et le stockage des métriques serveur. Bonne connaissance de Go, REST, et des performances système requise.",
        badges: [
          { label: "Go", color: "#00ADD8", bgColor: "#E0F7FA" },
          { label: "Docker", color: "#0db7ed", bgColor: "#e7f7fc" }
        ]
      },
      {
        id: "2",
        title: "Contributeur·rice TUI (CLI)",
        description: "Développe l'interface en terminal façon k9s/vim. Connaissances appréciées en curses/tcell et design UX dans le terminal.",
        badges: [
          { label: "Terminal UI", color: "#444", bgColor: "#EEE" },
          { label: "Tcell", color: "#008080", bgColor: "#E0F2F1" }
        ]
      }
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/g9s-dev/g9s" },
      { type: "website", url: "https://g9s.io" },
      { type: "twitter", url: "https://twitter.com/g9scli" }
    ],
    communityStats: {
      contributors: 3,
      stars: 15,
      forks: 2
    },
    keyBenefits: [
      "Surveillez vos serveurs comme un pro, en mode terminal pur",
      "Installation simple : agent léger, serveur centralisé, TUI personnalisable",
      "Pensé pour être open-source, modulaire et auto-hébergé"
    ]
  }
];
