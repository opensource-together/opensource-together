export const profileKeys = {
  all: ["user"] as const,
  detail: (userId: string) => [...profileKeys.all, userId] as const,
  projects: (userId: string) =>
    [...profileKeys.detail(userId), "projects"] as const,
  projectList: (userId: string, params: object) =>
    [...profileKeys.projects(userId), params] as const,
  bookmarks: () => [...profileKeys.detail("me"), "bookmarks"] as const,
  bookmarkList: (params: object) =>
    [...profileKeys.bookmarks(), params] as const,
  pullRequests: (userId: string) =>
    [...profileKeys.detail(userId), "pullrequests"] as const,
  pullRequestList: (userId: string, params: object) =>
    [...profileKeys.pullRequests(userId), params] as const,
};

export const profileMutationKeys = {
  update: () => ["profile", "update"] as const,
  updateLogo: () => ["profile", "update-logo"] as const,
  updateBanner: () => ["profile", "update-banner"] as const,
};
