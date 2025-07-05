import { ComboboxOption } from "@/shared/components/ui/combobox";

export interface TechStackItem {
  id: string;
  name: string;
  iconUrl: string;
}

export interface TechStackOption extends ComboboxOption {
  iconUrl: string;
}

const TECH_STACK_OPTIONS: TechStackOption[] = [
  {
    id: "react",
    name: "React",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  },
  {
    id: "nextjs",
    name: "Next.js",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  },
  {
    id: "angular",
    name: "Angular",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg",
  },
  {
    id: "vuejs",
    name: "Vue.js",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg",
  },
  {
    id: "nodejs",
    name: "Node.js",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  },
  {
    id: "express",
    name: "Express",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
  },
  {
    id: "nestjs",
    name: "Nest.js",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg",
  },
  {
    id: "fastify",
    name: "Fastify",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastify/fastify-original.svg",
  },
  {
    id: "typescript",
    name: "TypeScript",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  },
  {
    id: "go",
    name: "Go",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  },
  {
    id: "mysql",
    name: "MySQL",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  },
  {
    id: "redis",
    name: "Redis",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg",
  },
  {
    id: "tailwindcss",
    name: "Tailwind CSS",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    id: "docker",
    name: "Docker",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg",
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg",
  },
  {
    id: "aws",
    name: "AWS",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  },
  {
    id: "gcp",
    name: "GCP",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg",
  },
  {
    id: "azure",
    name: "Azure",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftazure/microsoftazure-original.svg",
  },
  {
    id: "npm",
    name: "npm",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg",
  },
  {
    id: "slack",
    name: "Slack",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/slack/slack-original.svg",
  },
  {
    id: "discord",
    name: "Discord API",
    iconUrl:
      "https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png",
  },
  {
    id: "markdown",
    name: "Markdown",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/markdown/markdown-original.svg",
  },
  {
    id: "figma",
    name: "Figma",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
  },
  {
    id: "python",
    name: "Python",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  },
  {
    id: "java",
    name: "Java",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  },
  {
    id: "csharp",
    name: "C#",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
  },
  {
    id: "php",
    name: "PHP",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
  },
  {
    id: "ruby",
    name: "Ruby",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg",
  },
  {
    id: "rust",
    name: "Rust",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg",
  },
  {
    id: "flutter",
    name: "Flutter",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg",
  },
  {
    id: "svelte",
    name: "Svelte",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg",
  },
];

/**
 * Hook to get the tech stack options
 * @returns {Object} - An object containing the tech stack options, getTechStackById, and getTechStacksByIds
 */
export function useTechStack() {
  const getTechStackOptions = () => TECH_STACK_OPTIONS;

  const getTechStackById = (id: string): TechStackItem | null => {
    const option = TECH_STACK_OPTIONS.find((tech) => tech.id === id);
    if (!option) return null;

    return {
      id: option.id,
      name: option.name,
      iconUrl: option.iconUrl,
    };
  };

  const getTechStacksByIds = (ids: string[]): TechStackItem[] => {
    return ids
      .map((id) => getTechStackById(id))
      .filter((tech): tech is TechStackItem => tech !== null);
  };

  return {
    techStackOptions: getTechStackOptions(),
    getTechStackById,
    getTechStacksByIds,
  };
}
