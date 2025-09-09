import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsArray,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationRequestDto {
  @ApiProperty({
    description: "L'objet de la notification",
    example: 'Nouveau projet',
  })
  @IsString()
  @IsNotEmpty()
  object: string;

  @ApiProperty({
    description: "ID de l'utilisateur destinataire",
    example: 'user-123',
  })
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty({
    description: 'Type de notification',
    example: 'project.created',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Données spécifiques de la notification',
    example: { projectId: 'proj-123', message: 'Votre projet a été créé' },
  })
  @IsObject()
  @IsNotEmpty()
  payload: Record<string, unknown>;

  @ApiProperty({
    description: "Canaux d'envoi (optionnel)",
    example: ['realtime', 'email'],
    isArray: true,
    enum: ['realtime', 'email'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsIn(['realtime', 'email'], { each: true })
  channels?: ('realtime' | 'email')[];
}

