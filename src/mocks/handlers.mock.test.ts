import assert from "node:assert/strict";
import { statSync } from "node:fs";
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

const BASE_URL = "http://mock.ost.local";
const signedOut = { cookie: "mock_signed_out=1" };
const server = setupServer(...handlers);

before(() => server.listen({ onUnhandledRequest: "error" }));
after(() => server.close());
beforeEach(() => {
  server.resetHandlers();
  db.reset();
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
    `${BASE_URL}/users/me/pull-requests?provider=github&state=open`
  );
  const body = (await response.json()) as { data: PullRequestsResponse };

  assert.equal(response.status, 200);
  assert.equal(body.data.github?.data.length, 1);
  assert.equal(
    body.data.github?.data[0]?.repository,
    "steel-dev/steel-browser"
  );
  assert.deepEqual(body.data.github?.data[0]?.branch, {
    from: "fix/double-navigation",
    to: "main",
  });
  assert.equal(body.data.gitlab, null);
});

test("protects current-user projects and applies their published filter", async () => {
  const anonymous = await fetch(`${BASE_URL}/users/me/projects`, {
    headers: signedOut,
  });
  const published = await fetch(`${BASE_URL}/users/me/projects?published=true`);
  const body = (await published.json()) as { data: Project[] };

  assert.equal(anonymous.status, 401);
  assert.equal(published.status, 200);
  assert.ok(body.data.length > 0);
  assert.ok(body.data.every((project) => project.published));
  assert.ok(body.data.every((project) => project.owner?.id === currentUser.id));
  assert.ok(body.data.some((project) => project.id === PROJECT_IDS.supabase));
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
  const response = await fetch(`${BASE_URL}/projects/${PROJECT_IDS.svelte}`, {
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
  const project = structuredClone(db.projects.find(PROJECT_IDS.svelte));
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

test("sign-out clears the session and opts out of automatic sign-in", async () => {
  const response = await fetch(`${BASE_URL}/api/auth/sign-out`, {
    method: "POST",
  });
  const cookies = response.headers.get("set-cookie") ?? "";

  assert.equal(response.status, 200);
  assert.match(cookies, /better-auth\.session_token=;/);
  assert.match(cookies, /mock_signed_out=1/);
});
