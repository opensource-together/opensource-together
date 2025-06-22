import Session from "supertokens-web-js/recipe/session";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { fetchAuthenticatedUserProfile } from "@/features/profile/services/profileApi";
import { Profile } from "@/features/profile/types/profileTypes";

interface UserState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
}

interface UserActions {
  setUser: (user: Profile | null) => void;
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
      user: null,
      isAuthenticated: false,
      isLoading: true,
      hasHydrated: false,

      // Actions
      setUser: (user: Profile | null) =>
        set(
          {
            user,
            isAuthenticated: !!user,
            isLoading: false,
          },
          false,
          "setUser"
        ),

      setLoading: (loading) => set({ isLoading: loading }, false, "setLoading"),

      logout: async () => {
        try {
          await Session.signOut();
          set(
            {
              user: null,
              isAuthenticated: false,
              isLoading: false,
            },
            false,
            "logout"
          );
        } catch (error) {
          console.error("Error during logout:", error);
        }
      },

      checkSession: async () => {
        try {
          set({ isLoading: true }, false, "checkSession");

          const sessionExists = await Session.doesSessionExist();

          if (sessionExists) {
            const userData = await fetchAuthenticatedUserProfile();

            if (userData) {
              set(
                {
                  user: userData,
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
              user: null,
              isAuthenticated: false,
              isLoading: false,
            },
            false,
            "checkSession"
          );
          return false;
        } catch (error) {
          console.error("Error checking session:", error);
          set(
            {
              user: null,
              isAuthenticated: false,
              isLoading: false,
            },
            false,
            "checkSession"
          );
          return false;
        } finally {
          set({ isLoading: false }, false, "checkSession");
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
