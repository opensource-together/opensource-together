import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsArray,
  IsIn,
} from 'class-validator';

export class CreateNotificationRequestDto {
  @IsString()
  @IsNotEmpty()
  object: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsObject()
  @IsNotEmpty()
  payload: Record<string, unknown>;

  @IsArray()
  @IsOptional()
  @IsIn(['realtime', 'email'], { each: true })
  channels?: ('realtime' | 'email')[];
}
