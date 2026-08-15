import { HttpResponse, http } from "msw";

import type {
  PullRequestProviderData,
  PullRequestsResponse,
  UserPullRequest,
} from "@/features/profile/types/profile.pull-request.type";
import type { Project } from "@/features/projects/types/project.type";

import { db } from "./db.mock";
import { projectsResponse } from "./fixtures/projects.mock";
import { categories, techStacks } from "./fixtures/taxonomy.mock";
import { pullRequests, userRepositories } from "./fixtures/user.mock";
import { mockPublicId } from "./public-id.mock";
import {
  isAuthenticated,
  SESSION_COOKIE,
  SIGNED_OUT_COOKIE,
} from "./session.mock";
import { findMockUpload, storeMockImage } from "./uploads.mock";

const timestamp = () => new Date().toISOString();

const ok = <T>(data: T, status = 200) =>
  HttpResponse.json({ data, timestamp: timestamp() }, { status });

const paginated = <T>(items: T[], page: number, size: number) =>
  HttpResponse.json({
    data: items.slice((page - 1) * size, page * size),
    pagination: {
      total: items.length,
      lastPage: Math.max(1, Math.ceil(items.length / size)),
      currentPage: page,
      size,
    },
    timestamp: timestamp(),
  });

const fail = (status: number, error: string) =>
  HttpResponse.json(
    { error, statusCode: status, timestamp: timestamp() },
    { status }
  );

const invalid = (errors: { field: string; message: string }[]) =>
  HttpResponse.json(
    { errors, statusCode: 400, timestamp: timestamp() },
    { status: 400 }
  );

const unauthorized = () => fail(401, "Unauthorized");

const api = (path: string) => `*${path}`;

function pagination(url: URL) {
  return {
    page: Number(url.searchParams.get("page") ?? 1) || 1,
    size: Number(url.searchParams.get("per_page") ?? 20) || 20,
  };
}

function multi(url: URL, key: string): string[] {
  const values = url.searchParams.getAll(key);
  return values.flatMap((v) => v.split(",")).filter(Boolean);
}

function withBookmarkState(project: Project): Project {
  return {
    ...project,
    isBookmarked: !!project.id && db.bookmarks.has(project.id),
  };
}

function providerPage(
  items: UserPullRequest[],
  page: number,
  size: number
): PullRequestProviderData {
  const start = (page - 1) * size;
  return {
    data: items.slice(start, start + size),
    pagination: {
      hasNextPage: start + size < items.length,
      hasPreviousPage: page > 1,
    },
  };
}

function canManage(project: Project): boolean {
  return project.owner?.id === db.users.me().id;
}

function relationIds(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;

  return value.flatMap((item) => {
    if (typeof item === "string") return [item];
    if (
      item &&
      typeof item === "object" &&
      "id" in item &&
      typeof item.id === "string"
    ) {
      return [item.id];
    }
    return [];
  });
}

function normalizeProfileUpdate(body: Record<string, unknown>) {
  const { experiences, userCategories, userTechStacks, ...profileFields } =
    body;
  const techStackIds = relationIds(userTechStacks);
  const categoryIds = relationIds(userCategories);
  const resolvedTechStacks = techStackIds?.flatMap((id) => {
    const stack = techStacks.find((item) => item.id === id);
    return stack ? [stack] : [];
  });
  const resolvedCategories = categoryIds?.flatMap((id) => {
    const category = categories.find((item) => item.id === id);
    return category ? [category] : [];
  });

  return {
    ...profileFields,
    ...(resolvedTechStacks
      ? {
          userTechStacks: resolvedTechStacks,
          userTechStacksIds: resolvedTechStacks.map((stack) => stack.id),
        }
      : {}),
    ...(resolvedCategories
      ? {
          userCategories: resolvedCategories,
        }
      : {}),
    ...(Array.isArray(experiences) ? { userExperiences: experiences } : {}),
  };
}

export const handlers = [
  http.get(api("/mock-uploads/:id"), ({ params }) => {
    const upload = findMockUpload(String(params.id));
    if (!upload) return fail(404, "Uploaded image not found");

    return new HttpResponse(upload.bytes.slice(), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": upload.contentType,
      },
    });
  }),

  http.get(api("/api/auth/get-session"), ({ request }) => {
    const currentUser = db.users.me();
    return isAuthenticated(request)
      ? HttpResponse.json({
          session: {
            userId: currentUser.id,
            expiresAt: "2030-01-01T00:00:00.000Z",
          },
          user: {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            image: currentUser.image,
          },
        })
      : HttpResponse.json(null);
  }),

  http.post(api("/api/auth/sign-out"), () => {
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
    );
    headers.append(
      "Set-Cookie",
      `${SIGNED_OUT_COOKIE}=1; Path=/; Max-Age=31536000; SameSite=Lax`
    );
    return HttpResponse.json({ success: true }, { headers });
  }),

  http.get(api("/categories"), () => ok(categories)),
  http.get(api("/techstacks"), () => ok(techStacks)),

  http.get(api("/users/me/repos"), ({ request }) => {
    if (!isAuthenticated(request)) return unauthorized();
    const url = new URL(request.url);
    const provider = url.searchParams.get("provider") ?? "github";
    return ok({
      github:
        provider === "github"
          ? {
              data: userRepositories,
              pagination: { hasNextPage: false, hasPreviousPage: false },
            }
          : null,
      gitlab:
        provider === "gitlab"
          ? {
              data: [],
              pagination: { hasNextPage: false, hasPreviousPage: false },
            }
          : null,
    });
  }),

  http.get(api("/users/me/bookmarks"), ({ request }) => {
    if (!isAuthenticated(request)) return unauthorized();
    const { page, size } = pagination(new URL(request.url));
    return paginated(db.bookmarks.list().map(withBookmarkState), page, size);
  }),

  http.get(api("/users/:userId/pull-requests"), ({ params, request }) => {
    if (params.userId === "me" && !isAuthenticated(request))
      return unauthorized();
    const url = new URL(request.url);
    const { page, size } = pagination(url);
    const provider = url.searchParams.get("provider");
    const state = url.searchParams.get("state");
    const filtered = pullRequests.filter((pullRequest) => {
      if (!state || state === "all") return true;
      if (state === "merged") return !!pullRequest.merged_at;
      return pullRequest.state.toLowerCase() === state;
    });
    const response: PullRequestsResponse = {
      github: provider === "gitlab" ? null : providerPage(filtered, page, size),
      gitlab: provider === "gitlab" ? providerPage([], page, size) : null,
    };
    return ok(response);
  }),

  http.get(api("/users/:userId/projects"), ({ params, request }) => {
    if (params.userId === "me" && !isAuthenticated(request))
      return unauthorized();
    const user = db.users.find(String(params.userId));
    if (!user) return fail(404, "User not found");
    const url = new URL(request.url);
    const { page, size } = pagination(url);
    const published = url.searchParams.get("published");
    let projects = db.projects.ownedBy(user.id);
    if (published !== null) {
      projects = projects.filter(
        (project) => project.published === (published === "true")
      );
    }
    return paginated(projects.map(withBookmarkState), page, size);
  }),

  http.get(api("/users/:id"), ({ params, request }) => {
    if (params.id === "me" && !isAuthenticated(request)) return unauthorized();
    const user = db.users.find(String(params.id));
    return user ? ok(user) : fail(404, "User not found");
  }),

  http.patch(api("/users/:id"), async ({ params, request }) => {
    if (!isAuthenticated(request)) return unauthorized();
    const userId = String(params.id);
    if (userId !== "me" && userId !== db.users.me().id) return unauthorized();
    const body = (await request.json()) as Record<string, unknown>;
    const user = db.users.update(userId, normalizeProfileUpdate(body));
    return user ? ok(user) : fail(404, "User not found");
  }),

  http.patch(api("/users/:id/logo"), async ({ params, request }) => {
    if (!isAuthenticated(request)) return unauthorized();
    const userId = String(params.id);
    if (userId !== "me" && userId !== db.users.me().id) return unauthorized();
    const upload = await storeMockImage(request);
    if (!upload.success) return fail(upload.status, upload.error);
    const user = db.users.update(userId, {
      image: upload.url,
    });
    return user ? ok(user) : fail(404, "User not found");
  }),

  http.patch(api("/users/:id/banner"), async ({ params, request }) => {
    if (!isAuthenticated(request)) return unauthorized();
    const userId = String(params.id);
    if (userId !== "me" && userId !== db.users.me().id) return unauthorized();
    const upload = await storeMockImage(request);
    if (!upload.success) return fail(upload.status, upload.error);
    const user = db.users.update(userId, {
      banner: upload.url,
    });
    return user ? ok(user) : fail(404, "User not found");
  }),

  http.get(api("/projects"), ({ request }) => {
    const url = new URL(request.url);
    const { page, size } = pagination(url);

    let results = db.projects.all();

    const published = url.searchParams.get("published");
    if (published !== null)
      results = results.filter((p) => p.published === (published === "true"));

    const trending = url.searchParams.get("trending");
    if (trending !== null)
      results = results.filter((p) => p.trending === (trending === "true"));

    const stacks = multi(url, "techStacks");
    if (stacks.length) {
      results = results.filter((p) =>
        p.projectTechStacks?.some(
          (t) => stacks.includes(t.id) || stacks.includes(t.name)
        )
      );
    }

    const cats = multi(url, "categories");
    if (cats.length) {
      results = results.filter((p) =>
        p.projectCategories?.some(
          (c) => cats.includes(c.id) || cats.includes(c.name)
        )
      );
    }

    const orderBy = url.searchParams.get("orderBy");
    const direction = url.searchParams.get("orderDirection") === "asc" ? 1 : -1;
    if (orderBy) {
      results = [...results].sort((a, b) => {
        if (orderBy === "title")
          return a.title.localeCompare(b.title) * direction;
        if (orderBy === "trending")
          return (Number(b.trending) - Number(a.trending)) * -direction;
        return (
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
          direction
        );
      });
    }

    return paginated(results.map(withBookmarkState), page, size);
  }),

  http.post(api("/projects"), async ({ request }) => {
    if (!isAuthenticated(request)) return unauthorized();
    const body = (await request.json()) as Record<string, unknown>;

    if (!body.title || typeof body.title !== "string") {
      return invalid([
        { field: "title", message: "title should not be empty" },
      ]);
    }

    const template = projectsResponse[0];
    if (!template) return fail(500, "Mock project catalogue is empty");
    const created: Project = {
      ...template,
      id: mockPublicId("pjt", Date.now()),
      title: String(body.title),
      description: String(body.description ?? ""),
      repoUrl: (body.repoUrl as string) ?? null,
      githubUrl: (body.githubUrl as string) ?? null,
      gitlabUrl: (body.gitlabUrl as string) ?? null,
      discordUrl: (body.discordUrl as string) ?? null,
      twitterUrl: (body.twitterUrl as string) ?? null,
      linkedinUrl: (body.linkedinUrl as string) ?? null,
      websiteUrl: (body.websiteUrl as string) ?? null,
      provider: (body.provider as Project["provider"]) ?? "GITHUB",
      logoUrl: null,
      imagesUrls: [],
      published: false,
      trending: false,
      projectTechStacks: techStacks.filter((t) =>
        (body.projectTechStacks as string[] | undefined)?.includes(t.id)
      ),
      projectCategories: categories.filter((c) =>
        (body.projectCategories as string[] | undefined)?.includes(c.id)
      ),
      owner: { id: db.users.me().id, name: db.users.me().name },
      isBookmarked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return ok(db.projects.insert(created), 201);
  }),

  http.get(api("/projects/:id/repository-summary"), ({ params }) => {
    const project = db.projects.find(String(params.id));
    return project
      ? ok(project.repositoryDetails)
      : fail(404, "Project not found");
  }),

  http.get(api("/projects/:id/issues/:issueNumber"), ({ params }) => {
    const project = db.projects.find(String(params.id));
    if (!project) return fail(404, "Project not found");

    const number = Number(params.issueNumber);
    const issue = project.repositoryDetails?.issues?.find(
      (i) => i.number === number
    );
    if (!issue) return fail(404, "Issue not found");

    return ok({
      ...issue,
      body:
        issue.body ??
        "### Context\n\nThis issue body is served by the MSW mock backend.\n\n- [ ] reproduce\n- [ ] fix\n- [ ] add a test\n",
    });
  }),

  http.get(api("/projects/:id/issues"), ({ params }) => {
    const project = db.projects.find(String(params.id));
    return project
      ? ok(project.repositoryDetails?.issues ?? [])
      : fail(404, "Project not found");
  }),

  http.post(api("/projects/:id/bookmarks"), ({ params, request }) => {
    if (!isAuthenticated(request)) return unauthorized();
    const project = db.projects.find(String(params.id));
    if (!project) return fail(404, "Project not found");
    if (db.bookmarks.has(String(params.id)))
      return fail(400, "Project already bookmarked");
    db.bookmarks.add(String(params.id));
    return ok(withBookmarkState(project));
  }),

  http.delete(api("/projects/:id/bookmarks"), ({ params, request }) => {
    if (!isAuthenticated(request)) return unauthorized();
    if (!db.projects.find(String(params.id)))
      return fail(404, "Project not found");
    if (!db.bookmarks.has(String(params.id)))
      return fail(400, "Project is not bookmarked");
    db.bookmarks.remove(String(params.id));
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(api("/projects/:id/claims"), ({ params, request }) => {
    if (!isAuthenticated(request)) return unauthorized();
    const existing = db.projects.find(String(params.id));
    if (!existing) return fail(404, "Project not found");
    if (existing.owner) return fail(400, "Project already has an owner");
    const project = db.projects.update(String(params.id), {
      owner: { id: db.users.me().id, name: db.users.me().name },
    });
    return project ? ok(project) : fail(404, "Project not found");
  }),

  http.patch(api("/projects/:id/logo"), async ({ params, request }) => {
    if (!isAuthenticated(request)) return unauthorized();
    const existing = db.projects.find(String(params.id));
    if (!existing) return fail(404, "Project not found");
    if (!canManage(existing)) return unauthorized();
    const upload = await storeMockImage(request);
    if (!upload.success) return fail(upload.status, upload.error);
    const project = db.projects.update(String(params.id), {
      logoUrl: upload.url,
    });
    return project ? ok(project) : fail(404, "Project not found");
  }),

  http.post(api("/projects/:id/images"), async ({ params, request }) => {
    if (!isAuthenticated(request)) return unauthorized();
    const project = db.projects.find(String(params.id));
    if (!project) return fail(404, "Project not found");
    if (!canManage(project)) return unauthorized();
    const upload = await storeMockImage(request);
    if (!upload.success) return fail(upload.status, upload.error);
    const updated = db.projects.update(String(params.id), {
      imagesUrls: [...project.imagesUrls, upload.url],
    });
    return ok(updated);
  }),

  http.delete(api("/projects/:id/images"), async ({ params, request }) => {
    if (!isAuthenticated(request)) return unauthorized();
    const project = db.projects.find(String(params.id));
    if (!project) return fail(404, "Project not found");
    if (!canManage(project)) return unauthorized();
    const { url } = (await request.json()) as { url: string };
    const updated = db.projects.update(String(params.id), {
      imagesUrls: project.imagesUrls.filter((i) => i !== url),
    });
    return ok(updated);
  }),

  http.patch(api("/projects/:id"), async ({ params, request }) => {
    if (!isAuthenticated(request)) return unauthorized();
    const existing = db.projects.find(String(params.id));
    if (!existing) return fail(404, "Project not found");
    if (!canManage(existing)) return unauthorized();
    const body = (await request.json()) as Record<string, unknown>;
    const patch = { ...body } as Partial<Project>;

    const requestedTechStacks = body.projectTechStacks;
    if (Array.isArray(requestedTechStacks)) {
      patch.projectTechStacks = techStacks.filter((techStack) =>
        requestedTechStacks.includes(techStack.id)
      );
    }
    const requestedCategories = body.projectCategories;
    if (Array.isArray(requestedCategories)) {
      patch.projectCategories = categories.filter((category) =>
        requestedCategories.includes(category.id)
      );
    }

    const project = db.projects.update(String(params.id), patch);
    return project
      ? ok(withBookmarkState(project))
      : fail(404, "Project not found");
  }),

  http.delete(api("/projects/:id"), ({ params, request }) => {
    if (!isAuthenticated(request)) return unauthorized();
    const project = db.projects.find(String(params.id));
    if (!project) return fail(404, "Project not found");
    if (!canManage(project)) return unauthorized();
    return db.projects.remove(String(params.id))
      ? new HttpResponse(null, { status: 204 })
      : fail(404, "Project not found");
  }),

  http.get(api("/projects/:id"), ({ params }) => {
    const project = db.projects.find(String(params.id));
    return project
      ? ok(withBookmarkState(project))
      : fail(404, "Project not found");
  }),
];
