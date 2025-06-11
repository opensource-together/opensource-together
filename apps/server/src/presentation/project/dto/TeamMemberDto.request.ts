import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { TechStackDto } from './TechStackDto.request';

export class TeamMemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
