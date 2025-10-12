import { TechStackType } from "@/shared/types/tech-stack.type";

import { Owner } from "../../projects/types/project.type";

export interface MyProjectType {
  id: string;
  title: string;
  description: string;
  projectTechStacks: TechStackType[];
  owner: Owner;
  logoUrl?: string;
  status: string;
  teamMembers: TeamMemberType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMemberType {
  id: string;
  name: string;
  avatarUrl: string | null;
  joinedAt: Date;
  techStacks?: TechStackType[];
}
