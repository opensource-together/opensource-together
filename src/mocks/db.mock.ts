import type { Project } from "@/features/projects/types/project.type";

import { PROJECT_IDS, projectsResponse } from "./fixtures/projects.mock";
import { currentUser, users } from "./fixtures/user.mock";

const currentUserProjectIds = [
  PROJECT_IDS.mistralCommon,
  PROJECT_IDS.polar,
  PROJECT_IDS.steelBrowser,
];

function cloneProjects() {
  const records = structuredClone(projectsResponse);

  for (const id of currentUserProjectIds) {
    const project = records.find((candidate) => candidate.id === id);
    if (project) {
      project.owner = { id: currentUser.id, name: currentUser.name };
    }
  }

  const claimable = records.find(
    (project) => project.id === PROJECT_IDS.supabase
  );
  if (claimable) claimable.owner = null;

  const currentUserProjects = new Set(currentUserProjectIds);
  return [
    ...currentUserProjectIds.flatMap((id) =>
      records.filter((project) => project.id === id)
    ),
    ...records.filter((project) => !currentUserProjects.has(project.id ?? "")),
  ];
}
const cloneUsers = () => structuredClone(users);

let projects: Project[] = cloneProjects();
let userRecords = cloneUsers();
const bookmarked = new Set<string>([PROJECT_IDS.react]);

function getCurrentUser() {
  const user = userRecords.find((candidate) => candidate.id === currentUser.id);
  if (!user) throw new Error("Mock current user is missing from the seed data");
  return user;
}

export const db = {
  projects: {
    all: () => projects,
    published: () => projects.filter((p) => p.published),
    find: (id: string) => projects.find((p) => p.id === id),
    ownedBy: (userId: string) => projects.filter((p) => p.owner?.id === userId),
    insert: (project: Project) => {
      projects = [project, ...projects];
      return project;
    },
    update: (id: string, patch: Partial<Project>) => {
      const existing = projects.find((p) => p.id === id);
      if (!existing) return undefined;
      Object.assign(existing, patch, { updatedAt: new Date() });
      return existing;
    },
    remove: (id: string) => {
      const before = projects.length;
      projects = projects.filter((p) => p.id !== id);
      return projects.length < before;
    },
  },

  bookmarks: {
    ids: () => [...bookmarked],
    has: (id: string) => bookmarked.has(id),
    list: () => projects.filter((p) => p.id && bookmarked.has(p.id)),
    add: (id: string) => bookmarked.add(id),
    remove: (id: string) => bookmarked.delete(id),
  },

  users: {
    me: getCurrentUser,
    find: (id: string) =>
      id === "me" ? getCurrentUser() : userRecords.find((u) => u.id === id),
    update: (id: string, patch: Record<string, unknown>) => {
      const user = db.users.find(id);
      if (!user) return undefined;
      Object.assign(user, patch);
      return user;
    },
  },

  reset: () => {
    projects = cloneProjects();
    userRecords = cloneUsers();
    bookmarked.clear();
    bookmarked.add(PROJECT_IDS.react);
  },
};
