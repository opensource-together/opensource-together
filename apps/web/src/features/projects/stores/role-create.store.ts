import { create } from "zustand";

import { ProjectRole } from "../types/project.type";

interface RoleCreateState {
  // UI State
  isDialogOpen: boolean;

  // Form Data
  createdRole: ProjectRole | null;

  // Actions
  setDialogOpen: (open: boolean) => void;
  setCreatedRole: (role: ProjectRole | null) => void;
  resetStore: () => void;
}

export const useRoleCreateStore = create<RoleCreateState>((set) => ({
  // Initial state
  isDialogOpen: false,
  createdRole: null,

  // Actions
  setDialogOpen: (open) => set({ isDialogOpen: open }),
  setCreatedRole: (role) => set({ createdRole: role }),
  resetStore: () =>
    set({
      isDialogOpen: false,
      createdRole: null,
    }),
}));
