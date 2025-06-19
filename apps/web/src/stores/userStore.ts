import Session from "supertokens-web-js/recipe/session";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { Profile } from "@/features/profile/types/profileTypes";

// export interface User {
//   id: string;
//   username: string;
//   email: string;
//   avatarUrl: string;
//   bio: string;
//   githubUrl: string;
//   createdAt: string;
//   updatedAt: string;
// }

interface UserState {
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
}

interface UserActions {
  setUser: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  hydrate: () => Promise<void>;
}

export type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  devtools(
    (set, get) => ({
      // State
      profile: null,
      isAuthenticated: false,
      isLoading: true,
      hasHydrated: false,

      // Actions
      setProfile: (profile: Profile | null) =>
        set(
          {
            profile,
            isAuthenticated: !!profile,
            isLoading: false,
          },
          false,
          "setProfile"
        ),

      setLoading: (loading) => set({ isLoading: loading }, false, "setLoading"),

      logout: async () => {
        try {
          await Session.signOut();
          set(
            {
              profile: null,
              isAuthenticated: false,
              isLoading: false,
            },
            false,
            "logout"
          );
        } catch (error) {
          console.error("Erreur lors de la déconnexion:", error);
        }
      },

      checkSession: async () => {
        try {
          const sessionExists = await Session.doesSessionExist();

          if (sessionExists) {
            // Récupérer les données utilisateur depuis l'API
            const response = await fetch("http://localhost:4000/profile/me", {
              credentials: "include",
            });

            if (response.ok) {
              const userData = await response.json();
              console.log({ userData });
              set(
                {
                  profile: userData,
                  isAuthenticated: true,
                  isLoading: false,
                },
                false,
                "checkSession"
              );
              return true;
            }
          }

          set(
            {
              profile: null,
              isAuthenticated: false,
              isLoading: false,
            },
            false,
            "checkSession"
          );
          return false;
        } catch (error) {
          console.error("Erreur lors de la vérification de session:", error);
          set(
            {
              profile: null,
              isAuthenticated: false,
              isLoading: false,
            },
            false,
            "checkSession"
          );
          return false;
        }
      },

      hydrate: async () => {
        if (get().hasHydrated) return;

        set({ isLoading: true }, false, "hydrate");
        await get().checkSession();
        set({ hasHydrated: true }, false, "hydrate");
      },
    }),
    { name: "user-store" }
  )
);
