import { create } from "zustand";

import { ProjectRole } from "../types/project.type";

interface RoleEditState {
  // UI State
  isDialogOpen: boolean;

  // Form Data
  editingRole: ProjectRole | null;
  updatedRole: ProjectRole | null;

  // Actions
  setDialogOpen: (open: boolean) => void;
  setEditingRole: (role: ProjectRole | null) => void;
  setUpdatedRole: (role: ProjectRole | null) => void;
  resetStore: () => void;
}

export const useRoleEditStore = create<RoleEditState>((set) => ({
  // Initial state
  isDialogOpen: false,
  editingRole: null,
  updatedRole: null,

  // Actions
  setDialogOpen: (open) => set({ isDialogOpen: open }),
  setEditingRole: (role) => set({ editingRole: role }),
  setUpdatedRole: (role) => set({ updatedRole: role }),
  resetStore: () =>
    set({
      isDialogOpen: false,
      editingRole: null,
      updatedRole: null,
    }),
}));
