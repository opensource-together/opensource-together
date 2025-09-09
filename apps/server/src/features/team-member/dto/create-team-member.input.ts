import { ProjectRole } from "@prisma/client";

export class CreateTeamMemberInputDto {
  userId: string;
  projectId: string;
  projectRole: ProjectRole[];
}
