import { IsBoolean } from 'class-validator';
import { CreateProjectRoleRequestDto } from './create-project-role.request.dto';

export class UpdateProjectRoleDto extends CreateProjectRoleRequestDto {
  @IsBoolean()
  isFilled: boolean;
}
