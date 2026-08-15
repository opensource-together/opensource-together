import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { after, before, beforeEach, test } from "node:test";
import { setupServer } from "msw/node";

import type { PullRequestsResponse } from "@/features/profile/types/profile.pull-request.type";
import type { Project } from "@/features/projects/types/project.type";
import { transformProjectForPublishedToggle } from "@/features/projects/validations/publish-toggle.validation";

import { db } from "./db.mock";
import { PROJECT_IDS, projectsResponse } from "./fixtures/projects.mock";
import { categories, techStacks } from "./fixtures/taxonomy.mock";
import { currentUser } from "./fixtures/user.mock";
import { handlers } from "./handlers.mock";
import { resetMockUploads } from "./uploads.mock";

const BASE_URL = "http://mock.ost.local";
const signedOut = { cookie: "mock_signed_out=1" };
const server = setupServer(...handlers);

before(() => server.listen({ onUnhandledRequest: "error" }));
after(() => server.close());
beforeEach(() => {
  server.resetHandlers();
  db.reset();
  resetMockUploads();
});

test("keeps seeded experiences compatible with the profile form", () => {
  for (const experience of currentUser.userExperiences ?? []) {
    assert.match(experience.startAt, /^\d{4}-\d{2}-\d{2}$/);
    if (experience.endAt) {
      assert.match(experience.endAt, /^\d{4}-\d{2}-\d{2}$/);
    }
  }
});

test("keeps the project catalogue valid and reasonably small", () => {
  assert.ok(projectsResponse.length >= 80);
  assert.equal(
    new Set(projectsResponse.map((project) => project.id)).size,
    projectsResponse.length
  );
  assert.equal(
    new Set(projectsResponse.map((project) => project.repoUrl)).size,
    projectsResponse.length
  );

  for (const project of projectsResponse) {
    assert.match(project.id ?? "", /^pjt_[a-f0-9]{32}$/);
    assert.ok(project.repoUrl?.startsWith("https://github.com/"));
    assert.ok(project.repositoryDetails.contributors.length <= 8);
    assert.ok(project.repositoryDetails.issues.length <= 6);
    assert.ok(project.repositoryDetails.pullRequests.length <= 6);
  }

  for (const category of categories) {
    assert.ok(
      projectsResponse.some((project) =>
        project.projectCategories.some((item) => item.id === category.id)
      )
    );
  }

  for (const techStack of techStacks) {
    assert.ok(
      projectsResponse.some((project) =>
        project.projectTechStacks.some((item) => item.id === techStack.id)
      )
    );
  }

  const snapshot = statSync(
    join(process.cwd(), "src/mocks/fixtures/projects.mock.json")
  );
  assert.ok(snapshot.size <= 5 * 1024 * 1024);

  for (const project of projectsResponse) {
    if (project.logoUrl?.startsWith("/")) {
      assert.ok(
        existsSync(join(process.cwd(), "public", project.logoUrl.slice(1)))
      );
    }

    for (const imageUrl of project.imagesUrls) {
      assert.ok(imageUrl.startsWith("/mocks/projects/"));
      assert.ok(existsSync(join(process.cwd(), "public", imageUrl.slice(1))));
    }
  }
});

test("serves the project catalogue through list and detail routes", async () => {
  const fixture = projectsResponse[0];
  assert.ok(fixture?.id);

  const listResponse = await fetch(`${BASE_URL}/projects?page=1&per_page=100`);
  const list = (await listResponse.json()) as { data: Project[] };
  const detailResponse = await fetch(`${BASE_URL}/projects/${fixture.id}`);
  const detail = (await detailResponse.json()) as { data: Project };

  assert.equal(listResponse.status, 200);
  assert.ok(list.data.some((project) => project.id === fixture.id));
  assert.equal(detailResponse.status, 200);
  assert.equal(detail.data.repoUrl, fixture.repoUrl);
  assert.ok(detail.data.repositoryDetails.contributors.length > 0);
});

test("returns pull requests in the provider envelope used by the UI", async () => {
  const response = await fetch(
    `${BASE_URL}/users/me/pull-requests?provider=github&state=merged`
  );
  const body = (await response.json()) as { data: PullRequestsResponse };

  assert.equal(response.status, 200);
  assert.equal(body.data.github?.data.length, 2);
  assert.equal(body.data.github?.data[0]?.repository, "libdc");
  assert.deepEqual(body.data.github?.data[0]?.branch, {
    from: "garmin-localtime",
    to: "Subsurface-DS9",
  });
  assert.equal(body.data.gitlab, null);
});

test("protects current-user projects and applies their published filter", async () => {
  const anonymous = await fetch(`${BASE_URL}/users/me/projects`, {
    headers: signedOut,
  });
  const mine = await fetch(`${BASE_URL}/users/me/projects`);
  const published = await fetch(`${BASE_URL}/users/me/projects?published=true`);
  const mineBody = (await mine.json()) as { data: Project[] };
  const body = (await published.json()) as { data: Project[] };

  assert.equal(anonymous.status, 401);
  assert.equal(mine.status, 200);
  assert.equal(published.status, 200);
  assert.equal(mineBody.data[0]?.id, PROJECT_IDS.mistralCommon);
  assert.deepEqual(
    mineBody.data.map((project) => project.id).sort(),
    [
      PROJECT_IDS.mistralCommon,
      PROJECT_IDS.polar,
      PROJECT_IDS.steelBrowser,
    ].sort()
  );
  assert.ok(body.data.length > 0);
  assert.ok(body.data.every((project) => project.published));
  assert.ok(body.data.every((project) => project.owner?.id === currentUser.id));
  assert.equal(body.data.length, 3);
  assert.ok(
    body.data.some((project) => project.id === PROJECT_IDS.mistralCommon)
  );
  assert.ok(body.data.some((project) => project.id === PROJECT_IDS.polar));
  assert.ok(
    body.data.some((project) => project.id === PROJECT_IDS.steelBrowser)
  );
});

test("persists project creation until the database is reset", async () => {
  const createdResponse = await fetch(`${BASE_URL}/projects`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title: "Contract test project" }),
  });
  const created = (await createdResponse.json()) as { data: Project };
  const mineResponse = await fetch(`${BASE_URL}/users/me/projects`);
  const mine = (await mineResponse.json()) as { data: Project[] };

  assert.equal(createdResponse.status, 201);
  assert.match(created.data.id ?? "", /^pjt_[0-9a-f]{32}$/);
  assert.ok(mine.data.some((project) => project.id === created.data.id));

  db.reset();
  assert.equal(db.projects.find(created.data.id ?? ""), undefined);
});

test("populates project relations after an update", async () => {
  const response = await fetch(`${BASE_URL}/projects/${PROJECT_IDS.polar}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      projectTechStacks: [techStacks[0]?.id, "tst_unknown"],
      projectCategories: [categories[0]?.id, "cat_unknown"],
    }),
  });
  const body = (await response.json()) as { data: Project };

  assert.equal(response.status, 200);
  assert.deepEqual(body.data.projectTechStacks, [techStacks[0]]);
  assert.deepEqual(body.data.projectCategories, [categories[0]]);
  assert.ok(body.data.projectTechStacks.every(Boolean));
  assert.ok(body.data.projectCategories.every(Boolean));
});

test("ignores stale null relations when toggling project visibility", () => {
  const project = structuredClone(db.projects.find(PROJECT_IDS.codex));
  assert.ok(project);
  project.projectTechStacks = [null] as unknown as Project["projectTechStacks"];
  project.projectCategories = [null] as unknown as Project["projectCategories"];

  const payload = transformProjectForPublishedToggle(project, true);

  assert.deepEqual(payload.projectTechStacks, []);
  assert.deepEqual(payload.projectCategories, []);
  assert.equal(payload.published, true);
});

test("matches bookmark duplicate and missing-state errors", async () => {
  const duplicate = await fetch(
    `${BASE_URL}/projects/${PROJECT_IDS.react}/bookmarks`,
    { method: "POST" }
  );
  const removed = await fetch(
    `${BASE_URL}/projects/${PROJECT_IDS.react}/bookmarks`,
    { method: "DELETE" }
  );
  const missing = await fetch(
    `${BASE_URL}/projects/${PROJECT_IDS.react}/bookmarks`,
    { method: "DELETE" }
  );

  assert.equal(duplicate.status, 400);
  assert.equal(removed.status, 204);
  assert.equal(missing.status, 400);
});

test("resets user mutations between tests", async () => {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Changed by a test" }),
  });

  assert.equal(response.status, 200);
  assert.equal(db.users.me().name, "Changed by a test");
  db.reset();
  assert.equal(db.users.me().name, currentUser.name);
});

test("normalizes profile relations and experiences after an update", async () => {
  const experiences = [
    {
      title: "Staff Engineer @ OST",
      startAt: "2026-01-01",
      endAt: null,
      url: "https://opensource-together.com",
    },
  ];
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      userTechStacks: [techStacks[0]?.id, "tst_unknown", techStacks[3]?.id],
      userCategories: [categories[1]?.id, "cat_unknown"],
      experiences,
    }),
  });
  const body = (await response.json()) as {
    data: typeof currentUser & Record<string, unknown>;
  };
  const refetchedResponse = await fetch(`${BASE_URL}/users/me`);
  const refetched = (await refetchedResponse.json()) as {
    data: typeof currentUser & Record<string, unknown>;
  };

  assert.equal(response.status, 200);
  assert.equal(refetchedResponse.status, 200);
  assert.deepEqual(refetched.data.userTechStacks, [
    techStacks[0],
    techStacks[3],
  ]);
  assert.deepEqual(refetched.data.userTechStacksIds, [
    techStacks[0]?.id,
    techStacks[3]?.id,
  ]);
  assert.deepEqual(refetched.data.userCategories, [categories[1]]);
  assert.deepEqual(refetched.data.userExperiences, experiences);
  assert.equal(refetched.data.experiences, undefined);
  assert.deepEqual(body.data, refetched.data);
});

test("stores and serves uploaded profile images for the mock session", async () => {
  const bytes = new Uint8Array([137, 80, 78, 71]);
  const formData = new FormData();
  formData.append(
    "file",
    new File([bytes], "banner.png", { type: "image/png" })
  );

  const response = await fetch(`${BASE_URL}/users/me/banner`, {
    method: "PATCH",
    body: formData,
  });
  const body = (await response.json()) as { data: typeof currentUser };
  const imageResponse = await fetch(body.data.banner ?? "");

  assert.equal(response.status, 200);
  assert.match(
    body.data.banner ?? "",
    /^http:\/\/mock\.ost\.local\/mock-uploads\//
  );
  assert.equal(imageResponse.status, 200);
  assert.equal(imageResponse.headers.get("content-type"), "image/png");
  assert.deepEqual(new Uint8Array(await imageResponse.arrayBuffer()), bytes);
});

test("stores uploaded project logos and covers", async () => {
  const projectId = PROJECT_IDS.mistralCommon;
  const logoData = new FormData();
  logoData.append(
    "file",
    new File([new Uint8Array([1, 2, 3])], "logo.webp", {
      type: "image/webp",
    })
  );
  const coverData = new FormData();
  coverData.append(
    "file",
    new File([new Uint8Array([4, 5, 6])], "cover.jpg", {
      type: "image/jpeg",
    })
  );

  const logoResponse = await fetch(`${BASE_URL}/projects/${projectId}/logo`, {
    method: "PATCH",
    body: logoData,
  });
  const coverResponse = await fetch(
    `${BASE_URL}/projects/${projectId}/images`,
    {
      method: "POST",
      body: coverData,
    }
  );
  const logoUrl = db.projects.find(projectId)?.logoUrl ?? "";
  const coverUrl = db.projects.find(projectId)?.imagesUrls.at(-1) ?? "";

  assert.equal(logoResponse.status, 200);
  assert.equal(coverResponse.status, 200);
  assert.match(logoUrl, /\/mock-uploads\//);
  assert.match(coverUrl, /\/mock-uploads\//);
  assert.equal(
    (await fetch(logoUrl)).headers.get("content-type"),
    "image/webp"
  );
  assert.equal(
    (await fetch(coverUrl)).headers.get("content-type"),
    "image/jpeg"
  );
});

test("allows an unowned seeded project to be claimed", async () => {
  assert.equal(db.projects.find(PROJECT_IDS.supabase)?.owner, null);

  const response = await fetch(
    `${BASE_URL}/projects/${PROJECT_IDS.supabase}/claims`,
    { method: "POST" }
  );
  const body = (await response.json()) as { data: Project };

  assert.equal(response.status, 200);
  assert.equal(body.data.owner?.id, currentUser.id);

  const duplicate = await fetch(
    `${BASE_URL}/projects/${PROJECT_IDS.supabase}/claims`,
    { method: "POST" }
  );
  assert.equal(duplicate.status, 400);
});

test("sign-out clears the session and opts out of automatic sign-in", async () => {
  const response = await fetch(`${BASE_URL}/api/auth/sign-out`, {
    method: "POST",
  });
  const cookies = response.headers.get("set-cookie") ?? "";

  assert.equal(response.status, 200);
  assert.match(cookies, /better-auth\.session_token=;/);
  assert.match(cookies, /mock_signed_out=1/);
});
