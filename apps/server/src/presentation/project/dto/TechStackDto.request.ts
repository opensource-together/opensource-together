import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for representing a technology stack
 * @class TechStackDto
 * @property {string} id - The unique identifier of the technology stack
 * @property {string} name - The name of the technology stack
 * @property {string} iconUrl - The URL of the technology stack's icon
 */
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
