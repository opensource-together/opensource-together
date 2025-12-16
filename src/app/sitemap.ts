import type { MetadataRoute } from "next";

import { API_BASE_URL, FRONTEND_URL } from "@/config/config";

import type { Project } from "@/features/projects/types/project.type";

interface PaginatedProjectsResponse {
  data: Project[];
  pagination?: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

async function getTrendingProjects(): Promise<Project[]> {
  try {
    const projects: Project[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const response = await fetch(
        `${API_BASE_URL}/projects?published=true&trending=true&per_page=100&page=${currentPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          next: { revalidate: 3600 },
        }
      );

      if (!response.ok) {
        console.error(
          `Failed to fetch trending projects for sitemap: ${response.status}`
        );
        break;
      }

      const data: PaginatedProjectsResponse = await response.json();
      projects.push(...data.data);

      if (data.pagination) {
        hasMorePages = currentPage < data.pagination.lastPage;
        currentPage++;
      } else {
        hasMorePages = false;
      }
    }

    return projects;
  } catch (error) {
    console.error("Error fetching trending projects for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: FRONTEND_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${FRONTEND_URL}/oss-guide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${FRONTEND_URL}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${FRONTEND_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];

  const projects = await getTrendingProjects();

  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter(
      (project) => project.publicId && project.published && project.trending
    )
    .map((project) => ({
      url: `${FRONTEND_URL}/projects/${project.publicId}`,
      lastModified: project.updatedAt
        ? new Date(project.updatedAt)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

  return [...staticRoutes, ...projectRoutes];
}
