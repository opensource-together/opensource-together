export const authKeys = {
  currentUser: () => ["user", "me"] as const,
  repositories: () => [...authKeys.currentUser(), "repos"] as const,
  repositoryList: (params: object) =>
    [...authKeys.repositories(), params] as const,
};

export const authMutationKeys = {
  signIn: () => ["auth", "sign-in"] as const,
  linkAccount: () => ["auth", "link-account"] as const,
  unlinkAccount: () => ["auth", "unlink-account"] as const,
  logout: () => ["auth", "logout"] as const,
  deleteAccount: () => ["auth", "delete-account"] as const,
  completeOnboarding: () => ["auth", "complete-onboarding"] as const,
};
