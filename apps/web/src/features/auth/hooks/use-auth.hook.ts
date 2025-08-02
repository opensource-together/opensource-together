import { useSession } from "@/lib/auth-client";

import {
  logout,
  signInWithEmail,
  signInWithGitHub,
  signInWithGoogle,
  signUpWithEmail,
} from "../services/auth.service";

const useAuth = () => {
  const { data: session, isPending, error, refetch } = useSession();

  return {
    session,
    isPending,
    error,
    refetch,
    isAuthenticated: !!session,
    user: session?.user,
    signInWithEmail,
    signUpWithEmail,
    signInWithGitHub,
    signInWithGoogle,
    logout,
  };
};

export default useAuth;
