import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { ProjectRole } from "../types/project-role.type";
import {
  Category,
  ExternalLink,
  GithubRepoType,
  KeyFeature,
  ProjectGoal,
  TechStack,
} from "../types/project.type";

export type ProjectCreateMethod = "scratch" | "github";

export interface ProjectFormData {
  method: ProjectCreateMethod;
  // Data for scratch method
  title: string;
  shortDescription: string;
  image: string;
  coverImages: File[]; // Array of cover image files (1 to 4)
  // status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  readme?: string;
  externalLinks: ExternalLink[];
  keyFeatures: KeyFeature[];
  projectGoals: ProjectGoal[];
  techStack: TechStack[];
  categories: Category[];
  selectedRepository: GithubRepoType | null;
  roles: ProjectRole[];
}

interface ProjectCreateStore {
  // State
  formData: ProjectFormData;
  currentStep: number;
  hasHydrated: boolean;

  // Actions
  setMethod: (method: ProjectCreateMethod) => void;
  updateProjectInfo: (
    info: Partial<
      Pick<
        ProjectFormData,
        | "title"
        | "shortDescription"
        | "image"
        | "coverImages"
        // | "status"
        | "readme"
        | "keyFeatures"
        | "projectGoals"
        | "techStack"
        | "categories"
        | "roles"
        | "externalLinks"
      >
    >
  ) => void;
  selectRepository: (repo: GithubRepoType) => void;
  updateRoles: (roles: ProjectFormData["roles"]) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetForm: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

const initialFormData: ProjectFormData = {
  method: "scratch",
  title: "",
  shortDescription: "",
  image: "",
  coverImages: [],
  // status: "DRAFT",
  readme: "",
  externalLinks: [],
  keyFeatures: [],
  projectGoals: [],
  selectedRepository: null,
  techStack: [],
  categories: [],
  roles: [],
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

        selectRepository: (repo) =>
          set((state) => ({
            formData: {
              ...state.formData,
              selectedRepository: repo,
              readme: repo.readme || "",
            },
          })),

        updateRoles: (roles) =>
          set((state) => ({ formData: { ...state.formData, roles } })),

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
