import { IsNotEmpty, IsString } from 'class-validator';

export class TechStackDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  iconUrl: string;
}
