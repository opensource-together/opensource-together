import { signInWithGitHub, useRedirectAfterGitHub } from "../services/authApi";

export default function useAuth() {
  const redirectAfterGitHub = useRedirectAfterGitHub();

  return {
    signInWithGitHub,
    redirectAfterGitHub,
  };
}
