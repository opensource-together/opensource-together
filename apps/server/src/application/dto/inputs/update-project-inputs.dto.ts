import { TechStackDto } from '@/contexts/project/infrastructure/controllers/dto/TechStackDto.request';
import { Title } from '@/contexts/project/domain/title/title.vo';
import { Description } from '@/contexts/project/domain/description/description.vo';
import { Link } from '@/contexts/project/domain/link/link.vo';
import { Result } from '@/shared/result';
import { UpdateProjectRoleDto } from '@/presentation/projectRole/dto/UpdateProjectRoleDto.request';

export class UpdateProjectInputsDto {
  title?: Result<Title> | undefined;
  description?: Result<Description> | undefined;
  link?: Result<Link> | undefined;
  techStacks?: TechStackDto[] | undefined;
  projectRoles?: UpdateProjectRoleDto[] | undefined;
}
