import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CancelApplicationRequestDto {
  @IsNotEmpty()
  @IsBoolean()
  cancel: boolean;
}
