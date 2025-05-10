import { IsNotEmpty, IsArray } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsArray()
  formFields: {
    id: string;
    value: string;
  }[];
}
