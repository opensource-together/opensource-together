import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { ProjectRole } from "../types/project-role.type";
import {
  Category,
  ExternalLink,
  KeyFeature,
  ProjectGoal,
  TechStack,
} from "../types/project.type";

export type ProjectCreateMethod = "github" | "scratch";

export interface ProjectFormData {
  method: ProjectCreateMethod | null;
  // Data for scratch method
  title: string;
  shortDescription: string;
  image: string;
  // status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  externalLinks: ExternalLink[];
  keyFeatures: KeyFeature[];
  projectGoals: ProjectGoal[];
  techStack: TechStack[];
  categories: Category[];
  readme?: string;
  // Data for github method
  selectedRepository: {
    name: string;
    date: string;
  } | null;
  // Common data for roles configuration
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
        // | "status"
        | "keyFeatures"
        | "projectGoals"
        | "techStack"
        | "categories"
        | "roles"
        | "externalLinks"
        | "readme"
      >
    >
  ) => void;
  selectRepository: (repo: { name: string; date: string }) => void;
  updateRoles: (roles: ProjectFormData["roles"]) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetForm: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

const initialFormData: ProjectFormData = {
  method: null,
  title: "",
  shortDescription: "",
  image: "",
  // status: "DRAFT",
  externalLinks: [],
  keyFeatures: [],
  projectGoals: [],
  selectedRepository: null,
  techStack: [],
  categories: [],
  roles: [],
  readme: "",
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
            formData: { ...state.formData, selectedRepository: repo },
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
