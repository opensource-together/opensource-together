import { IsNotEmpty, IsString } from 'class-validator';

export class TechStackDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
