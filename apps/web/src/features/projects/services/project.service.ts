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
 * Create a new project from store form data
 */
export const createProject = async (
  storeData: ProjectFormData
): Promise<Project> => {
  try {
    console.log("=== SERVICE: DONNÉES REÇUES DU STORE ===");
    console.log("Store data:", storeData);

    // Format external links - they are already in array format in the store
    const externalLinksArray = storeData.externalLinks.filter(
      (link) => link.url && link.url.trim() !== ""
    );

    // Format roles to match ProjectRole interface
    const formattedRoles = storeData.roles.map((role) => ({
      id: role.id || crypto.randomUUID(),
      title: role.title,
      description: role.description,
      techStacks: role.techStacks || [],
    }));

    // Format key features to match KeyFeature interface
    const formattedKeyFeatures = storeData.keyFeatures.map((feature) => ({
      id: feature.id || crypto.randomUUID(),
      title: feature.title,
    }));

    // Format project goals to match ProjectGoal interface
    const formattedProjectGoals = storeData.projectGoals.map((goal) => ({
      id: goal.id || crypto.randomUUID(),
      goal: goal.goal,
    }));

    // Create the full project data matching Project interface
    const projectData = {
      title: storeData.projectName,
      shortDescription: storeData.shortDescription,
      longDescription: "", // Could be added later
      image: storeData.image,
      status: "DRAFT" as const,
      techStacks: storeData.techStack || [],
      roles: formattedRoles,
      externalLinks: externalLinksArray,
      keyFeatures: formattedKeyFeatures,
      projectGoals: formattedProjectGoals,
      categories: storeData.categories || [],
      author: {
        id: "current-user", // This should come from auth context
        name: "Current User", // This should come from auth context
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Format for the validation schema (CreateProjectData)
    const createProjectData = {
      projectId: `project-${Date.now()}`,
      data: {
        title: projectData.title,
        description: projectData.shortDescription,
        longDescription: projectData.longDescription,
        status: projectData.status,
        techStacks: projectData.techStacks,
        roles: projectData.roles.map((role) => ({
          title: role.title,
          description: role.description,
          badges: [], // Required by schema but not used yet
          experienceBadge: undefined, // Optional in schema
        })),
        socialLinks: projectData.externalLinks,
        keyBenefits: projectData.keyFeatures.map((feature) => feature.title), // Schema expects keyBenefits
      },
    };

    console.log("=== SERVICE: DONNÉES FORMATÉES POUR VALIDATION ===");
    console.log("Create project data:", createProjectData);

    // Validate input data
    const validatedData = CreateProjectSchema.parse(createProjectData);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Create a new project with mock data
    const newProject: Project = {
      id: `project-${Date.now()}`, // Generate a unique ID
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
      externalLinks:
        validatedData.data.socialLinks?.map((link) => ({
          type: link.type,
          url: link.url,
        })) || [],
      keyFeatures: projectData.keyFeatures,
      projectGoals: projectData.projectGoals,
      categories: projectData.categories,
      author: projectData.author,
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
