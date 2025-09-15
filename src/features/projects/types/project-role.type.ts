import { TechStack } from "./project.type";

export interface ProjectRole {
  id: string;
  projectId?: string;
  title: string;
  description: string;
  techStacks: TechStack[];
  roleCount?: number;
}
