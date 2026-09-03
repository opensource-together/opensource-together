import { API_BASE_URL, FRONTEND_URL } from "@/config/config";
import type { Project } from "@/features/projects/types/project.type";
import { getEdgeCache } from "@/shared/lib/cloudflare-edge-cache";

interface PaginatedProjectsResponse {
  data: Project[];
  pagination?: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

interface SitemapEntry {
  loc: string;
  lastModified: Date;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
}

const PER_PAGE = 100;
// Hard cap so a huge catalogue can never make the sitemap crawl unbounded.
const MAX_PAGES = 20;
const CACHE_TTL_SECONDS = 60 * 60;
const FETCH_TIMEOUT_MS = 10_000;

function escapeXml(value: string): string {
  return value.replace(
    /[<>&'"]/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[char] ?? char
  );
}

async function fetchPage(
  page: number
): Promise<PaginatedProjectsResponse | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/projects?published=true&trending=true&per_page=${PER_PAGE}&page=${page}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch trending projects for sitemap (page ${page}): ${response.status}`
      );
      return null;
    }

    return (await response.json()) as PaginatedProjectsResponse;
  } catch (error) {
    console.error(
      `Error fetching trending projects for sitemap (page ${page}):`,
      error
    );
    return null;
  }
}

async function getTrendingProjects(): Promise<Project[]> {
  const firstPage = await fetchPage(1);
  if (!firstPage) return [];

  const projects = [...firstPage.data];

  const lastPage = firstPage.pagination
    ? Math.min(firstPage.pagination.lastPage, MAX_PAGES)
    : 1;

  if (lastPage > 1) {
    // Fetch the remaining pages concurrently instead of one-by-one.
    const remainingPages = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) => fetchPage(index + 2))
    );
    for (const page of remainingPages) {
      if (page) projects.push(...page.data);
    }
  }

  return projects;
}

function staticEntries(): SitemapEntry[] {
  return [
    {
      loc: FRONTEND_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      loc: `${FRONTEND_URL}/learn`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      loc: `${FRONTEND_URL}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      loc: `${FRONTEND_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];
}

function buildXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) =>
      [
        "  <url>",
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        `    <lastmod>${entry.lastModified.toISOString()}</lastmod>`,
        `    <changefreq>${entry.changeFrequency}</changefreq>`,
        `    <priority>${entry.priority.toFixed(1)}</priority>`,
        "  </url>",
      ].join("\n")
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function generateSitemapXml(): Promise<string> {
  const projects = await getTrendingProjects();

  const projectEntries: SitemapEntry[] = projects
    .filter(
      (project) => project.publicId && project.published && project.trending
    )
    .map((project) => ({
      loc: `${FRONTEND_URL}/projects/${project.publicId}`,
      lastModified: project.updatedAt
        ? new Date(project.updatedAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

  return buildXml([...staticEntries(), ...projectEntries]);
}

// Always execute at request time: the result is cached at the Cloudflare edge
// (caches.default) with a 1h TTL, so this costs at most one API crawl per
// data center per hour. A static prerender here would freeze the sitemap at
// build time.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cache = getEdgeCache();

  try {
    if (cache) {
      const hit = await cache.match(request.url);
      if (hit) {
        return new Response(hit.body, { headers: hit.headers });
      }
    }

    const xml = await generateSitemapXml();
    const headers = {
      "Content-Type": "application/xml",
      "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
    };

    if (cache) {
      // Cache the generated XML at the edge so crawlers don't re-crawl the API.
      await cache.put(request.url, new Response(xml, { headers }));
    }

    return new Response(xml, { headers });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
