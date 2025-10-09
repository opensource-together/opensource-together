import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { UserGitRepository } from "@/shared/types/git-repository.type";

import { Category, ExternalLink, TechStack } from "../types/project.type";

export type provider = "scratch" | "github" | "gitlab";

export interface ProjectFormData {
  method: provider;
  title: string;
  description: string;
  image: string;
  coverImages: File[];
  readme?: string;
  externalLinks: ExternalLink[];
  techStack: TechStack[];
  categories: Category[];
  selectedRepository: UserGitRepository | null;
}

interface ProjectCreateStore {
  formData: ProjectFormData;
  currentStep: number;
  hasHydrated: boolean;

  setMethod: (method: provider) => void;
  updateProjectInfo: (
    info: Partial<
      Pick<
        ProjectFormData,
        | "title"
        | "description"
        | "image"
        | "coverImages"
        | "readme"
        | "techStack"
        | "categories"
        | "externalLinks"
      >
    >
  ) => void;
  selectRepository: (repo: UserGitRepository) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetForm: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

const initialFormData: ProjectFormData = {
  method: "scratch",
  title: "",
  description: "",
  image: "",
  coverImages: [],
  readme: "",
  externalLinks: [],
  selectedRepository: null,
  techStack: [],
  categories: [],
};

export const useProjectCreateStore = create<ProjectCreateStore>()(
  devtools(
    persist(
      (set) => ({
        formData: initialFormData,
        currentStep: 0,
        hasHydrated: false,

        setMethod: (method) =>
          set((state) => ({
            formData: { ...state.formData, method },
            currentStep: 1,
          })),

        updateProjectInfo: (info) =>
          set((state) => ({ formData: { ...state.formData, ...info } })),

        selectRepository: (repo) => {
          set((state) => ({
            formData: {
              ...state.formData,
              selectedRepository: repo,
              title: "",
              description: "",
              image: "",
              coverImages: [],
              readme: "",
              externalLinks: [],
              techStack: [],
              categories: [],
            },
          }));
        },

        nextStep: () =>
          set((state) => ({ currentStep: state.currentStep + 1 })),

        previousStep: () =>
          set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),

        resetForm: () =>
          set({
            formData: initialFormData,
            currentStep: 0,
          }),

        setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      }),
      {
        name: "project-create-storage",
        partialize: (state) => ({
          formData: state.formData,
          currentStep: state.currentStep,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    ),
    {
      name: "project-create-store",
    }
  )
);
