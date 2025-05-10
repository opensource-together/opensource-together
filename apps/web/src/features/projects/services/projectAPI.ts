import { Project } from "./createProjectAPI";

/**
 * Get project details by project ID
 */
export const getProjectDetails = async (
  projectId: string,
): Promise<Project> => {
  // In a real scenario, this would call the API
  // return get<Project>(`/projects/${projectId}`);
  // For now, return mock data
  return Promise.resolve(
    mockProjects.find((p) => p.id === projectId) || mockProjects[0],
  );
};

/**
 * Get all projects (for listing)
 */
export const getAllProjects = async (): Promise<Project[]> => {
  // In a real scenario, this would call the API
  // return get<Project[]>('/projects');

  // For now, return mock data
  return Promise.resolve(mockProjects);
};

// Mock data for development
const mockProjects: Project[] = [
  {
    id: "1",
    slug: "awesome-open-source",
    title: "Awesome Open Source",
    description:
      "A collaborative platform for open source enthusiasts to discover and contribute to exciting projects",
    longDescription:
      "Awesome Open Source is a platform designed to connect developers with open source projects. Our mission is to make open source contribution more accessible and enjoyable for everyone, from beginners to experienced developers. We believe in the power of collaboration and community-driven development.",
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
        title: "Back-end Developer",
        description:
          "We're hiring a Backend Developer to build robust, scalable server-side systems and APIs. You'll collaborate with cross-functional teams to deliver reliable backend systems using technologies like Node.js, MongoDB, and Express.",
        badges: [{ label: "MongoDB", color: "#00D5BE", bgColor: "#CBFBF1" }],
        experienceBadge: "3+ Years Experience",
      },
      {
        id: "2",
        title: "UX Designer",
        description:
          "We're looking for a UX Designer to craft intuitive, user-centered experiences across web and mobile platforms.\nYou'll collaborate with product and dev teams to turn insights into wireframes, prototypes, and seamless user journeys.",
        badges: [{ label: "Design", color: "#FDA5D5", bgColor: "#FDF2F8" }],
        experienceBadge: "2+ Years Experience",
      },
      {
        id: "3",
        title: "Front-end Developer",
        description:
          "We're looking for a Frontend Developer to build responsive, high-quality user interfaces using modern web technologies.\nYou'll be responsible for turning design concepts into fast, accessible, and interactive digital experiences.",
        badges: [{ label: "React", color: "#00BCFF", bgColor: "#DFF2FE" }],
        experienceBadge: "1+ Year Experience",
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
      "Join a vibrant community of passionate developers",
      "Work on a project that impacts thousands of developers daily",
      "Opportunity to grow your skills and network",
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
