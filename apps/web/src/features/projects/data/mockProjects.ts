import { Project } from "../types/ProjectTypes";

export const mockProjects: Project[] = [
  {
    id: "1",
    slug: "awesome-open-source",
    title: "Awesome Open Source",
    description:
      "Une plateforme collaborative pour les amateurs d'open source pour découvrir et contribuer à des projets excitants",
    longDescription:
      "Awesome Open Source est une plateforme conçue pour connecter les développeurs aux projets open source. Notre mission est de rendre la contribution open source plus accessible et agréable pour tous, des débutants aux développeurs expérimentés. Nous croyons dans la puissance de la collaboration et du développement communautaire.",
    status: "PUBLISHED",
    techStacks: [
      { id: "1", name: "React", iconUrl: "/icons/react.svg" },
      { id: "2", name: "Node.js", iconUrl: "/icons/nodejs.svg" },
      { id: "3", name: "MongoDB", iconUrl: "/icons/mongodb.svg" },
    ],
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-06-10T00:00:00Z",
    roles: [
      {
        id: "1",
        title: "Developeur Backend",
        description:
          "Nous recrutons un Developeur Backend pour construire des systèmes et API robustes et évolutifs côté serveur. Vous collaborerez avec des équipes interfonctionnelles pour livrer des systèmes backends fiables en utilisant des technologies comme Node.js, MongoDB et Express.",
        badges: [{ label: "MongoDB", color: "#00D5BE", bgColor: "#CBFBF1" }],
        experienceBadge: "+3 Ans d'expérience",
      },
      {
        id: "2",
        title: "Designer UX",
        description:
          "Nous recrutons un Designer UX pour créer des expériences utilisateur intuitives et centrées sur l'utilisateur sur les plateformes web et mobiles. Vous collaborerez avec les équipes de produit et de développement pour transformer les insights en wireframes, prototypes et parcours utilisateur fluides.",
        badges: [{ label: "Design", color: "#FDA5D5", bgColor: "#FDF2F8" }],
        experienceBadge: "+2 Ans d'expérience",
      },
      {
        id: "3",
        title: "Developeur Frontend",
        description:
          "Nous recrutons un Developeur Frontend pour construire des interfaces utilisateur réactives et de haute qualité en utilisant les technologies web modernes. Vous serez responsable de la transformation des concepts de design en expériences numériques rapides, accessibles et interactives.",
        badges: [{ label: "React", color: "#00BCFF", bgColor: "#DFF2FE" }],
        experienceBadge: "+1 An d'expérience",
      },
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/awesome-open-source" },
      { type: "website", url: "https://awesome-open-source.org" },
      { type: "discord", url: "https://discord.gg/awesome-open-source" },
    ],
    communityStats: {
      contributors: 42,
      stars: 256,
      forks: 78,
    },
    keyBenefits: [
      "Rejoignez une communauté active de développeurs passionnés",
      "Travailler sur un projet qui impacte quotidiennement des milliers de développeurs",
      "Opportunité de grandir et de se connecter avec des personnes talentueuses",
    ],
  },
  {
    id: "2",
    slug: "eco-tracker",
    title: "Eco Tracker",
    description:
      "An app that helps users track and reduce their carbon footprint through daily lifestyle choices",
    longDescription:
      "Eco Tracker is an innovative solution designed to help individuals and organizations monitor and reduce their environmental impact. Through intuitive interfaces and data-driven insights, we empower users to make more sustainable choices in their daily lives.",
    status: "PUBLISHED",
    techStacks: [
      { id: "1", name: "React Native", iconUrl: "/icons/react.svg" },
      { id: "4", name: "Firebase", iconUrl: "/icons/firebase.svg" },
      { id: "5", name: "TypeScript", iconUrl: "/icons/typescript.svg" },
    ],
    createdAt: "2023-03-22T00:00:00Z",
    updatedAt: "2023-07-05T00:00:00Z",
    roles: [
      {
        id: "4",
        title: "Mobile Developer",
        description:
          "We're seeking a Mobile Developer experienced with React Native to help build our cross-platform app. You'll work on creating smooth, responsive interfaces and integrating with backend services.",
        badges: [
          { label: "React Native", color: "#00BCFF", bgColor: "#DFF2FE" },
        ],
      },
      {
        id: "5",
        title: "Data Scientist",
        description:
          "We're looking for a Data Scientist to help analyze environmental impact data and create algorithms for personalized sustainability recommendations.",
        badges: [{ label: "Python", color: "#4B8BBE", bgColor: "#F0F8FF" }],
      },
    ],
    socialLinks: [
      { type: "github", url: "https://github.com/eco-tracker" },
      { type: "website", url: "https://eco-tracker.app" },
      { type: "twitter", url: "https://twitter.com/ecotracker" },
    ],
    communityStats: {
      contributors: 18,
      stars: 125,
      forks: 34,
    },
    keyBenefits: [
      "Make a real impact on climate change through technology",
      "Work with a diverse team of environmentalists and developers",
      "Learn about sustainability while building valuable tech skills",
    ],
  },
];
