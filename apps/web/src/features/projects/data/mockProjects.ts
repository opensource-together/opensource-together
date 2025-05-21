import codesnippetIcon from "@/components/shared/icons/codesnippet-icon.png";
import exemplebyronIcon from "@/components/shared/icons/exemplebyronIcon.svg";
import gitifyIcon from "@/components/shared/icons/gitifyIcon.png";
import killianIcon from "@/components/shared/icons/killiancodes-icon.jpg";
import p2acoIcon from "@/components/shared/icons/p2aco-icon.png";
import ppY2 from "@/components/shared/icons/pp-y2.jpg";
import shyybiIcon from "@/components/shared/icons/shyybi-icon.png";
import { Project } from "../types/projectTypes";

export const mockProjects: Project[] = [
  {
    id: "1",
    slug: "leetgrind",
    title: "LeetGrind",
    image:
      "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Fwww.leetgrindbot.com%2F",
    authorName: "y2_dev",
    authorImage: ppY2.src,
    description:
      "Un bot Discord pour pratiquer LeetCode chaque jour et progresser en algorithme dans une ambiance motivante",
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
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2025-05-15T00:00:00Z",
    roles: [
      {
        id: "1",
        title: "Développeur·se Backend",
        description:
          "Nous recherchons un·e développeur·se Nest.js pour ajouter des fonctionnalités au bot LeetGrind : Multi-serveur, API publique, intégration Discord...",
        badges: [
          { label: "Nest.js", color: "#43853D", bgColor: "#E6F4EA" },
          { label: "PostgreSQL", color: "#336791", bgColor: "#EDF2FA" },
        ],
      },
      {
        id: "2",
        title: "Développeur·se Frontend",
        description:
          "Aidez-nous à créer un dashboard web (Next.js) pour suivre les classements, les statistiques des challenges et la personnalisation du bot.",
        badges: [
          { label: "Next.js", color: "#000000", bgColor: "#F3F3F3" },
          { label: "React", color: "#61DAFB", bgColor: "#E0F7FA" },
        ],
      },
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/LeetGrindBot" },
      { type: "website", url: "https://leetgrindbot.com/" },
      { type: "twitter", url: "https://x.com/y2_dev" },
    ],
    communityStats: {
      contributors: 4,
      stars: 8,
      forks: 0,
    },
    keyBenefits: [
      "Progresse chaque jour en algorithmie dans une ambiance bienveillante",
      "Travaille sur un projet open-source utile pour des centaines de développeurs",
      "Découvre les coulisses du développement d'un bot Discord communautaire",
    ],
  },
  {
    id: "7",
    slug: "gitify",
    title: "Gitify",
    image: gitifyIcon.src,
    authorName: "69Killian",
    authorImage: killianIcon.src,
    description:
      "Contribue, Développe, réalise des challenges et gagne des badges en contribuant à des projets open source. Une plateforme gamifiée pour encourager la participation à l'open source",
    longDescription:
      "Gitify est une application pour réaliser des challenges et gagner des badges en contribuant à des projets open source. Elle permet de suivre les notifications, les messages et les demandes de pull request de vos projets GitHub.",
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
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2025-05-15T00:00:00Z",
    roles: [
      {
        id: "1",
        title: "Développeur·se Backend",
        description:
          "Nous recherchons un·e développeur·se Next.js pour ajouter des fonctionnalités au bot LeetGrind : Multi-serveur, API publique, intégration Discord...",
        badges: [
          { label: "Next.js", color: "#43853D", bgColor: "#E6F4EA" },
          { label: "PostgreSQL", color: "#336791", bgColor: "#EDF2FA" },
        ],
      },
      {
        id: "2",
        title: "Développeur·se Frontend",
        description:
          "Aidez-nous à créer un dashboard web (Next.js) pour suivre les classements, les statistiques des challenges et la personnalisation du bot.",
        badges: [
          { label: "Next.js", color: "#000000", bgColor: "#F3F3F3" },
          { label: "React", color: "#61DAFB", bgColor: "#E0F7FA" },
        ],
      },
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/69killian/Gitify" },
      {
        type: "website",
        url: "https://warmhearted-imagine-949567.framer.app/",
      },
      { type: "twitter", url: "https://x.com/y2_dev" },
    ],
    communityStats: {
      contributors: 4,
      stars: 52,
      forks: 0,
    },
    keyBenefits: [
      "Progresse en contribuant à des projets open source",
      "Gagne des badges tout en apprenant et pratiquant sur des projets concrets",
      "Découvre les coulisses du développement d'un bot Discord communautaire",
    ],
  },
  {
    id: "2",
    slug: "devcord",
    title: "DevCord",
    image:
      "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Fdocs.devcord.app%2Fintroduction",
    authorName: "p2aco",
    authorImage: p2acoIcon.src,
    description:
      "Le bot ultime pour les développeurs, directement intégré à Discord et Slack. Boostez votre productivité avec des commandes intelligentes pour formater du code, générer des tâches cron et plus encore.",
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
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-05-15T00:00:00Z",
    roles: [
      {
        id: "1",
        title: "Développeur·se Backend Go",
        description:
          "Aidez-nous à améliorer le cœur du bot : parsing intelligent, génération dynamique de commandes, gestion des formats, et plus encore. Une bonne connaissance de Go est attendue.",
        badges: [
          { label: "Golang", color: "#00ADD8", bgColor: "#E0F7FA" },
          { label: "REST API", color: "#3E3E3E", bgColor: "#F0F0F0" },
        ],
      },
      {
        id: "2",
        title: "Contributeur·rice Documentation",
        description:
          "Participez à la rédaction de la documentation officielle (https://docs.devcord.app) pour rendre DevCord encore plus accessible à la communauté.",
        badges: [
          { label: "Markdown", color: "#000000", bgColor: "#F2F2F2" },
          {
            label: "Rédaction technique",
            color: "#673AB7",
            bgColor: "#EEE7F9",
          },
        ],
      },
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/devcord-bot/devcord" },
      { type: "website", url: "https://docs.devcord.app/introduction" },
      { type: "twitter", url: "https://x.com/theotruvelot" },
    ],
    communityStats: {
      contributors: 1,
      stars: 52,
      forks: 10,
    },
    keyBenefits: [
      "Automatisez vos tâches courantes sans quitter Discord ou Slack",
      "Gagnez du temps avec des commandes puissantes prêtes à l'emploi",
      "Contribuez à un outil open-source utilisé par des équipes tech",
    ],
  },
  {
    id: "6",
    slug: "codesnippet",
    title: "CodeSnippet",
    image: codesnippetIcon.src,
    authorName: "Spectre",
    authorImage:
      "https://pbs.twimg.com/profile_images/1922394540058517504/LeIKSyDr_400x400.jpg",
    description:
      "Transformez votre façon de gérer le code. Stockez, organisez et découvrez des snippets avec facilité.",
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
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2025-05-15T00:00:00Z",
    roles: [
      {
        id: "1",
        title: "Développeur·se Fullstack",
        description:
          "Participe au développement de CodeSnippet : système de gestion des snippets, éditeur de code en temps réel, et intégration avec les éditeurs populaires.",
        badges: [
          { label: "Next.js", color: "#000000", bgColor: "#F3F3F3" },
          { label: "TypeScript", color: "#3178C6", bgColor: "#E6F4FF" },
        ],
      },
      {
        id: "2",
        title: "Développeur·se Backend",
        description:
          "Développe l'API et le système de stockage des snippets, avec un focus sur la performance et la scalabilité.",
        badges: [
          { label: "PostgreSQL", color: "#336791", bgColor: "#EDF2FA" },
          { label: "API REST", color: "#FF6B6B", bgColor: "#FFF0F0" },
        ],
      },
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/codesnippet/codesnippet" },
      { type: "website", url: "code-snippet-mocha.vercel.app" },
      { type: "twitter", url: "https://twitter.com/codesnippet" },
    ],
    communityStats: {
      contributors: 5,
      stars: 42,
      forks: 8,
    },
    keyBenefits: [
      "Gérez vos snippets de code de manière efficace et organisée",
      "Partagez et découvrez des snippets créés par la communauté",
      "Intégrez CodeSnippet dans votre workflow de développement",
    ],
  },
  {
    id: "3",
    slug: "liltea",
    title: "Liltea.me",
    image:
      "https://media.discordapp.net/attachments/1313066773083459595/1313066775444983908/Lil_tea_tasse_fond_4x.jpg?ex=682c443a&is=682af2ba&hm=cb84ead9ca01d87a31cb26390a0c239f1c660bbcf0343b5a29f92a4e873ee601&=&format=webp&width=1744&height=1744",
    authorName: "Shyybi",
    authorImage: shyybiIcon.src,
    description:
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
    createdAt: "2025-04-10T00:00:00Z",
    updatedAt: "2025-05-19T00:00:00Z",
    roles: [
      {
        id: "1",
        title: "Développeur·se Fullstack",
        description:
          "Participe au développement de Liltea avec Next.js, Fastify et TailwindCSS. Ton rôle inclara la création de composants UI, la gestion des APIs et l'optimisation des performances.",
        badges: [
          { label: "Next.js", color: "#000000", bgColor: "#F3F3F3" },
          { label: "Fastify", color: "#000000", bgColor: "#F3F3F3" },
        ],
      },
      {
        id: "2",
        title: "Designer UI/UX",
        description:
          "Aide-nous à concevoir des interfaces élégantes et intuitives pour les pages de profil. Une sensibilité pour les designs minimalistes et responsives est un plus.",
        badges: [
          { label: "Figma", color: "#A259FF", bgColor: "#F3F0FF" },
          { label: "Design System", color: "#FF6B6B", bgColor: "#FFECEC" },
        ],
      },
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/liltea-dev/liltea" },
      { type: "website", url: "https://liltea.app" },
      { type: "twitter", url: "https://twitter.com/lilteaapp" },
    ],
    communityStats: {
      contributors: 4,
      stars: 37,
      forks: 5,
    },
    keyBenefits: [
      "Crée une page bio moderne et rapide en quelques clics",
      "Personnalise ton profil avec des thèmes et composants élégants",
      "Open-source et propulsé par une stack technique de pointe",
    ],
  },
  {
    id: "4",
    slug: "g9s",
    title: "g9s",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg",
    authorName: "p2aco",
    authorImage: p2acoIcon.src,
    description:
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
    createdAt: "2025-05-19T00:00:00Z",
    updatedAt: "2025-05-19T00:00:00Z",
    roles: [
      {
        id: "1",
        title: "Développeur·se Backend Go",
        description:
          "Travaille sur l'API, la gestion des agents et le stockage des métriques serveur. Bonne connaissance de Go, REST, et des performances système requise.",
        badges: [
          { label: "Go", color: "#00ADD8", bgColor: "#E0F7FA" },
          { label: "Docker", color: "#0db7ed", bgColor: "#e7f7fc" },
        ],
      },
      {
        id: "2",
        title: "Contributeur·rice TUI (CLI)",
        description:
          "Développe l'interface en terminal façon k9s/vim. Connaissances appréciées en curses/tcell et design UX dans le terminal.",
        badges: [
          { label: "Terminal UI", color: "#444", bgColor: "#EEE" },
          { label: "Tcell", color: "#008080", bgColor: "#E0F2F1" },
        ],
      },
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/69killian/Gitify" },
      {
        type: "website",
        url: "https://warmhearted-imagine-949567.framer.app/",
      },
      { type: "twitter", url: "https://twitter.com/g9scli" },
    ],
    communityStats: {
      contributors: 3,
      stars: 15,
      forks: 2,
    },
    keyBenefits: [
      "Surveillez vos serveurs comme un pro, en mode terminal pur",
      "Installation simple : agent léger, serveur centralisé, TUI personnalisable",
      "Pensé pour être open-source, modulaire et auto-hébergé",
    ],
  },
  {
    id: "5",
    slug: "nextsandbox",
    title: "NextSandbox",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
    authorName: "Lucas Martin",
    authorImage: exemplebyronIcon.src,
    description:
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
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2025-05-15T00:00:00Z",
    roles: [
      {
        id: "1",
        title: "Développeur·se Core",
        description:
          "Participe au développement du cœur de NextSandbox : système de rendu des composants, hot-reload, et intégration avec Next.js.",
        badges: [
          { label: "Next.js", color: "#000000", bgColor: "#F3F3F3" },
          { label: "TypeScript", color: "#3178C6", bgColor: "#E6F4FF" },
        ],
      },
      {
        id: "2",
        title: "Développeur·se UI/UX",
        description:
          "Conçois l'interface utilisateur de NextSandbox et améliore l'expérience de développement des composants.",
        badges: [
          { label: "React", color: "#61DAFB", bgColor: "#E0F7FA" },
          { label: "Tailwind", color: "#06B6D4", bgColor: "#E0F7FA" },
        ],
      },
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/nextsandbox/nextsandbox" },
      { type: "website", url: "https://nextsandbox.dev" },
      { type: "twitter", url: "https://twitter.com/nextsandbox" },
    ],
    communityStats: {
      contributors: 3,
      stars: 28,
      forks: 5,
    },
    keyBenefits: [
      "Développe des composants UI plus rapidement avec un outil optimisé pour Next.js",
      "Documente et teste tes composants dans un environnement dédié",
      "Contribue à un outil qui simplifie le développement frontend",
    ],
  },

  {
    id: "8",
    slug: "sherpa",
    title: "Sherpa",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg",
    authorName: "Olyxz16",
    authorImage:
      "https://media.discordapp.net/attachments/1337829619629424711/1374073158629593211/Sans_titre.png?ex=682cb8da&is=682b675a&hm=3208e6ba63ac6ea8b76686536217505cdddac1972dd760c6523dbea8d85da3d3&=&format=webp&quality=lossless&width=1080&height=1080",
    description:
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
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2025-05-15T00:00:00Z",
    roles: [
      {
        id: "1",
        title: "Développeur·se Backend",
        description:
          "Nous recherchons un·e développeur·se Golang pour ajouter des fonctionnalités à Sherpa : Chiffrement, gestion des équipes ...",
        badges: [
          { label: "Golang", color: "#43853D", bgColor: "#E6F4EA" },
          { label: "PostgreSQL", color: "#336791", bgColor: "#EDF2FA" },
        ],
      },
      {
        id: "2",
        title: "Développeur·se Frontend",
        description:
          "Aidez-nous à créer un dashboard web (Next.js) pour suivre les classements, les statistiques des challenges et la personnalisation du bot.",
        badges: [{ label: "VueJS", color: "#000000", bgColor: "#F3F3F3" }],
      },
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/Olyxz16/sherpa" },
      { type: "twitter", url: "https://x.com/Ox16__" },
    ],
    communityStats: {
      contributors: 2,
      stars: 6,
      forks: 0,
    },
    keyBenefits: [
      "Gérer ses environnement de développements facilement",
      "Transférer ses variables de manière sécurisée",
    ],
  },
  {
    id: "9",
    slug: "devspace",
    title: "DevSpace",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg",
    authorName: "Sarah Miller",
    authorImage: exemplebyronIcon.src,
    description:
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
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2025-05-15T00:00:00Z",
    roles: [
      {
        id: "1",
        title: "Développeur·se Backend",
        description:
          "Développe le cœur de la plateforme en Go, avec un focus sur la gestion des conteneurs et l'orchestration.",
        badges: [
          { label: "Go", color: "#00ADD8", bgColor: "#E0F7FA" },
          { label: "Docker", color: "#0db7ed", bgColor: "#e7f7fc" },
        ],
      },
      {
        id: "2",
        title: "DevOps Engineer",
        description:
          "Gère l'infrastructure cloud et l'automatisation des déploiements.",
        badges: [
          { label: "Kubernetes", color: "#326CE5", bgColor: "#EDF2FF" },
          { label: "CI/CD", color: "#FF6B6B", bgColor: "#FFECEC" },
        ],
      },
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/devspace-platform" },
      { type: "website", url: "https://devspace.cloud" },
      { type: "twitter", url: "https://twitter.com/devspace_cloud" },
    ],
    communityStats: {
      contributors: 8,
      stars: 156,
      forks: 23,
    },
    keyBenefits: [
      "Environnements de développement cloud prêts à l'emploi",
      "Configuration automatique et cohérente des environnements",
      "Collaboration simplifiée entre développeurs",
    ],
  },
  {
    id: "10",
    slug: "techdocs",
    title: "TechDocs",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/markdown/markdown-original.svg",
    authorName: "Emma Wilson",
    authorImage: exemplebyronIcon.src,
    description:
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
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2025-05-15T00:00:00Z",
    roles: [
      {
        id: "1",
        title: "Développeur·se Fullstack",
        description:
          "Développe les fonctionnalités de la plateforme, de l'éditeur Markdown à l'intégration Git.",
        badges: [
          { label: "Next.js", color: "#000000", bgColor: "#F3F3F3" },
          { label: "TypeScript", color: "#3178C6", bgColor: "#E6F4FF" },
        ],
      },
      {
        id: "2",
        title: "Développeur·se Backend",
        description:
          "Gère le stockage et la versioning de la documentation, avec un focus sur la performance.",
        badges: [
          { label: "PostgreSQL", color: "#336791", bgColor: "#EDF2FA" },
          { label: "Git", color: "#F05032", bgColor: "#FFECEC" },
        ],
      },
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/techdocs-platform" },
      { type: "website", url: "https://techdocs.dev" },
      { type: "twitter", url: "https://twitter.com/techdocs_platform" },
    ],
    communityStats: {
      contributors: 5,
      stars: 112,
      forks: 18,
    },
    keyBenefits: [
      "Documentation technique collaborative en temps réel",
      "Versioning Git intégré pour le suivi des changements",
      "Interface intuitive pour l'édition Markdown",
    ],
  },
];
