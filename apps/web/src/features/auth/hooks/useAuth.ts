import { redirectAfterGitHub, signInWithGitHub } from "../services/authApi";

export default function useAuth() {
  return {
    signInWithGitHub,
    redirectAfterGitHub,
  };
}
