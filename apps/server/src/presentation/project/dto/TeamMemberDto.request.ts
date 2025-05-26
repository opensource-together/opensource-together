import { IsNotEmpty, IsString } from 'class-validator';

export class TeamMemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
