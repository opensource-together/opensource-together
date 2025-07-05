import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class TechStackDto {
  @IsNotEmpty()
  @IsString()
  @IsArray()
  ids: string[];
}
