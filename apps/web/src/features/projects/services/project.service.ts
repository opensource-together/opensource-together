import { mockProjects } from "../mocks/project.mock";
import { ProjectFormData } from "../stores/project-create.store";
import { Project } from "../types/project.type";
import {
  CreateProjectSchema,
  UpdateProjectData,
  UpdateProjectSchema,
} from "../validations/project.schema";

/**
 * Get the list of projects
 */
export const getProjects = async (): Promise<Project[]> => {
  try {
    return Promise.resolve(mockProjects);
  } catch (error) {
    console.error("Error while sending the request to the API:", error);
    throw error;
  }
};

/**
 * Get project details by project ID
 */
export const getProjectDetails = async (
  projectId: string
): Promise<Project> => {
  // In a real scenario, this would call the API
  // return get<Project>(`/projects/${projectId}`);
  // For now, return mock data
  return Promise.resolve(
    mockProjects.find((p) => p.id === projectId) || mockProjects[0]
  );
};

/**
 * Create a new project
 */
export const createProject = async (
  storeData: ProjectFormData
): Promise<Project> => {
  try {
    console.log("=== SERVICE: DONNÉES REÇUES DU STORE ===");
    console.log("Store data:", storeData);

    // Add IDs to items that don't have them
    const formattedRoles = storeData.roles.map((role) => ({
      ...role,
      id: role.id || crypto.randomUUID(),
    }));

    const formattedKeyFeatures = storeData.keyFeatures.map((feature) => ({
      ...feature,
      id: feature.id || crypto.randomUUID(),
    }));

    const formattedProjectGoals = storeData.projectGoals.map((goal) => ({
      ...goal,
      id: goal.id || crypto.randomUUID(),
    }));

    // Format for the validation schema (CreateProjectData)
    const createProjectData = {
      projectId: `project-${Date.now()}`,
      data: {
        title: storeData.projectName,
        description: storeData.shortDescription,
        longDescription: "", // Could be added later
        status: "DRAFT" as const,
        techStacks: storeData.techStack || [],
        roles: formattedRoles.map((role) => ({
          title: role.title,
          description: role.description,
          badges: [], // Required by schema but not used yet
          experienceBadge: undefined, // Optional in schema
        })),
        socialLinks: storeData.externalLinks || [],
        keyBenefits: formattedKeyFeatures.map((feature) => feature.title),
      },
    };

    console.log("=== SERVICE: DONNÉES FORMATÉES POUR VALIDATION ===");
    console.log("Create project data:", createProjectData);

    // Validate and create project
    const validatedData = CreateProjectSchema.parse(createProjectData);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay

    const newProject: Project = {
      id: `project-${Date.now()}`,
      slug: `project-${Date.now()}`,
      title: validatedData.data.title,
      shortDescription: validatedData.data.description,
      longDescription: validatedData.data.longDescription,
      status: validatedData.data.status,
      techStacks: validatedData.data.techStacks,
      roles:
        validatedData.data.roles?.map((role) => ({
          id: crypto.randomUUID(),
          title: role.title,
          description: role.description,
          techStacks: [],
        })) || [],
      externalLinks: validatedData.data.socialLinks || [],
      keyFeatures: formattedKeyFeatures,
      projectGoals: formattedProjectGoals,
      categories: storeData.categories || [],
      author: {
        id: "current-user",
        name: "Current User",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("=== SERVICE: PROJET CRÉÉ AVEC SUCCÈS ===");
    console.log("New project created:", newProject);

    return newProject;
  } catch (error) {
    console.error("Error while creating project from store:", error);
    throw error;
  }
};

/**
 * Update a project
 * @param params update project parameters containing data and projectId
 * @returns the updated project
 */
export const updateProject = async (
  params: UpdateProjectData
): Promise<Project> => {
  try {
    // Validate input parameters
    const validatedParams = UpdateProjectSchema.parse(params);
    const { data, projectId } = validatedParams;

    console.log(`Updating project ${projectId}:`, data);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Get existing project
    const existingProject = await getProjectDetails(projectId);

    // Merge existing data with new data
    const updatedProject: Project = {
      ...existingProject,
      title: data.title,
      shortDescription: data.description,
      longDescription: data.longDescription,
      status: data.status,
      techStacks: data.techStacks,
      roles:
        data.roles?.map((role) => ({
          id: crypto.randomUUID(),
          title: role.title,
          description: role.description,
          techStacks: [],
        })) || existingProject.roles,
      externalLinks:
        data.socialLinks?.map((link) => ({
          type: link.type,
          url: link.url,
        })) || existingProject.externalLinks,
      updatedAt: new Date(),
    };

    console.log("Project updated successfully:", updatedProject);
    return updatedProject;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};
