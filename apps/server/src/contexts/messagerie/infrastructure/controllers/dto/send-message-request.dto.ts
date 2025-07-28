import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';
import { MessageType } from '../../../domain/message.entity';

export class SendMessageRequestDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(MessageType)
  @IsOptional()
  messageType?: MessageType;

  @IsString()
  @IsOptional()
  replyToId?: string;
}

export class CreateRoomRequestDto {
  @IsArray()
  @IsString({ each: true })
  participants: string[];

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class MarkMessageReadRequestDto {
  @IsString()
  @IsNotEmpty()
  messageId: string;
}
