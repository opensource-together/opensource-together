import assert from "node:assert/strict";
import { test } from "node:test";

import { resolveTab } from "./resolve-tab";

const PROJECT_TABS = [
  "overview",
  "contributing",
  "open-issues",
  "pull-requests",
  "contributions",
] as const;

const PROFILE_TABS = [
  "overview",
  "projects",
  "pull-request",
  "saved-projects",
] as const;

const PUBLIC_PROFILE_TABS = ["overview", "projects", "pull-requests"] as const;

test("falls back to the default tab when the query value is missing", () => {
  assert.equal(resolveTab(null, "overview", PROJECT_TABS), "overview");
  assert.equal(resolveTab("", "overview", PROJECT_TABS), "overview");
});

test("keeps a valid tab for project, profile, and public profile pages", () => {
  assert.equal(
    resolveTab("open-issues", "overview", PROJECT_TABS),
    "open-issues"
  );
  assert.equal(
    resolveTab("saved-projects", "overview", PROFILE_TABS),
    "saved-projects"
  );
  assert.equal(
    resolveTab("pull-requests", "overview", PUBLIC_PROFILE_TABS),
    "pull-requests"
  );
});

test("falls back to overview when the query value is not an allowed tab", () => {
  assert.equal(resolveTab("unknown", "overview", PROJECT_TABS), "overview");
  assert.equal(
    resolveTab("pull-requests", "overview", PROFILE_TABS),
    "overview"
  );
  assert.equal(
    resolveTab("saved-projects", "overview", PUBLIC_PROFILE_TABS),
    "overview"
  );
});
