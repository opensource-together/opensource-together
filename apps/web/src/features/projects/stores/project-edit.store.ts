import { create } from "zustand";

import {
  Category,
  KeyFeature,
  ProjectGoal,
  TechStack,
} from "../types/project.type";

export interface ProjectEditFormData {
  // Basic project info (from edit mode)
  title: string;
  description: string;
  longDescription: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";

  // Advanced fields (from edit mode)
  keyFeatures: KeyFeature[];
  projectGoals: ProjectGoal[];

  // Sidebar fields
  techStacks: TechStack[];
  categories: Category[];
  externalLinks: {
    github: string;
    discord: string;
    twitter: string;
    linkedin: string;
    website: string;
  };
}

interface ProjectEditState {
  // UI State
  isEditing: boolean;
  isDirty: boolean;

  // Form Data
  formData: ProjectEditFormData | null;
  originalProject: any | null; // Store original project for comparison

  // Actions
  setIsEditing: (editing: boolean) => void;
  setFormData: (data: Partial<ProjectEditFormData>) => void;
  updateField: (field: keyof ProjectEditFormData, value: any) => void;
  setOriginalProject: (project: any) => void;
  resetForm: () => void;
  setIsDirty: (dirty: boolean) => void;
}

export const useProjectEditStore = create<ProjectEditState>((set, get) => ({
  // Initial state
  isEditing: false,
  isDirty: false,
  formData: null,
  originalProject: null,

  // Actions
  setIsEditing: (editing) => set({ isEditing: editing }),

  setFormData: (data) =>
    set((state) => ({
      formData: state.formData
        ? { ...state.formData, ...data }
        : (data as ProjectEditFormData),
      isDirty: true,
    })),

  updateField: (field, value) =>
    set((state) => ({
      formData: state.formData ? { ...state.formData, [field]: value } : null,
      isDirty: true,
    })),

  setOriginalProject: (project) => set({ originalProject: project }),

  setIsDirty: (dirty) => set({ isDirty: dirty }),

  resetForm: () =>
    set({
      isEditing: false,
      isDirty: false,
      formData: null,
      originalProject: null,
    }),
}));
