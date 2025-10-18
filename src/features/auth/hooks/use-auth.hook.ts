import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useToastMutation } from "@/shared/hooks/use-toast-mutation";

import {
  getCurrentUser,
  logout,
  signInWithProvider,
} from "../services/auth.service";

export default function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: currentUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", "me"],
    queryFn: getCurrentUser,
  });

  const signInMutation = useToastMutation<unknown, Error, string>({
    mutationFn: async (provider) => await signInWithProvider(provider),
    loadingMessage: "Logging in...",
    successMessage: "Logged in successfully!",
    errorMessage: "An error occurred while logging in",
  });

  const logoutMutation = useToastMutation({
    mutationFn: logout,
    loadingMessage: "Logging out...",
    successMessage: "Logged out successfully!",
    errorMessage: "An error occurred while logging out",
    options: {
      onSuccess: () => {
        queryClient.setQueryData(["users", "me"], null);
        router.push("/");
      },
    },
  });

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    isError,

    signInWithProvider: signInMutation.mutate,
    logout: logoutMutation.mutate,

    isSigningIn: signInMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
