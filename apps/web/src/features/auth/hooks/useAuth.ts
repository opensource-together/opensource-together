import { redirectAfterGitHub, signInWithGitHub } from "../services/authApi";

interface AuthHook {
  signInWithGitHub: () => Promise<void>;
  redirectAfterGitHub: () => Promise<void>;
}

export default function useAuth(): AuthHook {
  return {
    signInWithGitHub,
    redirectAfterGitHub,
  };
}
