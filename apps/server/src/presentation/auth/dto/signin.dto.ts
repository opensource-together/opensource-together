import { IsNotEmpty, IsArray } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsArray()
  formFields: {
    id: string;
    value: string;
  }[];
}
