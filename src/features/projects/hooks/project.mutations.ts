import {
  type QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { profileKeys } from "@/features/profile/hooks/profile.keys";

import {
  claimProject,
  createProject,
  deleteProject,
  deleteProjectImage,
  updateProject,
  updateProjectCover,
  updateProjectLogo,
  updateProjectPublishedStatus,
} from "../services/project.service";
import type { Project } from "../types/project.type";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "../validations/project.schema";
import {
  formatMissingFieldsMessage,
  validateProjectForPublishing,
} from "../validations/publish-toggle.validation";
import { projectKeys, projectMutationKeys } from "./project.keys";

export interface CreateProjectVariables {
  data: CreateProjectInput;
}

export interface UpdateProjectVariables {
  projectId: string;
  data: UpdateProjectInput;
}

export interface DeleteProjectVariables {
  projectId: string;
}

export interface ToggleProjectPublishedVariables {
  project: Project;
  published: boolean;
}

export interface UpdateProjectLogoVariables {
  projectId: string;
  file: File;
}

export interface AddProjectCoverVariables {
  projectId: string;
  file: File;
}

export interface DeleteProjectImageVariables {
  projectId: string;
  imageUrl: string;
}

export interface ClaimProjectVariables {
  projectId: string;
}

async function invalidateProjectLists(
  queryClient: QueryClient,
  ownerId?: string
) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
    queryClient.invalidateQueries({ queryKey: profileKeys.projects("me") }),
    ...(ownerId
      ? [
          queryClient.invalidateQueries({
            queryKey: profileKeys.projects(ownerId),
          }),
        ]
      : []),
  ]);
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: projectMutationKeys.create(),
    mutationFn: ({ data }: CreateProjectVariables) => createProject(data),
    onSuccess: async (project) => {
      await Promise.all([
        invalidateProjectLists(queryClient, project.owner?.id),
        ...(project.id
          ? [
              queryClient.invalidateQueries({
                queryKey: projectKeys.detail(project.id),
              }),
            ]
          : []),
      ]);
    },
  });
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: projectMutationKeys.update(),
    mutationFn: ({ projectId, data }: UpdateProjectVariables) =>
      updateProject(projectId, data),
    onSuccess: async (project, variables) => {
      const targetId = project.publicId || project.id || variables.projectId;

      await Promise.all([
        invalidateProjectLists(queryClient, project.owner?.id),
        queryClient.invalidateQueries({
          queryKey: projectKeys.detail(targetId),
        }),
      ]);
    },
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: projectMutationKeys.delete(),
    mutationFn: ({ projectId }: DeleteProjectVariables) =>
      deleteProject(projectId),
    onSuccess: async (_, variables) => {
      queryClient.removeQueries({
        queryKey: projectKeys.detail(variables.projectId),
      });
      await invalidateProjectLists(queryClient);
    },
  });
}

export function useToggleProjectPublishedMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: projectMutationKeys.togglePublished(),
    mutationFn: ({ project, published }: ToggleProjectPublishedVariables) => {
      if (published) {
        const validation = validateProjectForPublishing(project);
        if (!validation.isValid) {
          throw new Error(formatMissingFieldsMessage(validation.missingFields));
        }
      }

      return updateProjectPublishedStatus(project.id || "", project, published);
    },
    onSuccess: async (project, variables) => {
      const targetId =
        project.publicId || project.id || variables.project.id || "";

      await Promise.all([
        invalidateProjectLists(queryClient, variables.project.owner?.id),
        ...(targetId
          ? [
              queryClient.invalidateQueries({
                queryKey: projectKeys.detail(targetId),
              }),
            ]
          : []),
      ]);
    },
  });
}

export function useUpdateProjectLogoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: projectMutationKeys.updateLogo(),
    mutationFn: ({ projectId, file }: UpdateProjectLogoVariables) =>
      updateProjectLogo(projectId, file),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: projectKeys.detail(variables.projectId),
        }),
        invalidateProjectLists(queryClient),
      ]);
    },
  });
}

export function useAddProjectCoverMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: projectMutationKeys.addCover(),
    mutationFn: ({ projectId, file }: AddProjectCoverVariables) =>
      updateProjectCover(projectId, file),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: projectKeys.detail(variables.projectId),
        }),
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
      ]);
    },
  });
}

export function useDeleteProjectImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: projectMutationKeys.deleteImage(),
    mutationFn: ({ projectId, imageUrl }: DeleteProjectImageVariables) =>
      deleteProjectImage(projectId, imageUrl),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: projectKeys.detail(variables.projectId),
        }),
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
      ]);
    },
  });
}

export function useClaimProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: projectMutationKeys.claim(),
    mutationFn: ({ projectId }: ClaimProjectVariables) =>
      claimProject(projectId),
    onSuccess: async (project, variables) => {
      const targetId = project.publicId || project.id || variables.projectId;
      queryClient.setQueryData(projectKeys.detail(targetId), project);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: projectKeys.detail(targetId),
        }),
        invalidateProjectLists(queryClient),
      ]);
    },
  });
}
