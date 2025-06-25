import { TechStackDto } from '@/presentation/project/dto/TechStackDto.request';
import { Title } from '@/domain/project/title/title.vo';
import { Description } from '@/domain/project/description/description.vo';
import { Link } from '@/domain/project/link/link.vo';
import { Result } from '@/shared/result';
import { UpdateProjectRoleDto } from '@/presentation/projectRole/dto/UpdateProjectRoleDto.request';

export class UpdateProjectInputsDto {
  title?: Result<Title> | undefined;
  description?: Result<Description> | undefined;
  link?: Result<Link> | undefined;
  techStacks?: TechStackDto[] | undefined;
  projectRoles?: UpdateProjectRoleDto[] | undefined;
}
