import { ApiProperty } from '@nestjs/swagger';

export class MarkAllNotificationsReadResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Toutes les notifications marquées comme lues' })
  message: string;

  constructor(
    success: boolean = true,
    message: string = 'Toutes les notifications marquées comme lues',
  ) {
    this.success = success;
    this.message = message;
  }

  static success(message?: string): MarkAllNotificationsReadResponseDto {
    return new MarkAllNotificationsReadResponseDto(
      true,
      message || 'Toutes les notifications marquées comme lues',
    );
  }

  static error(message: string): MarkAllNotificationsReadResponseDto {
    return new MarkAllNotificationsReadResponseDto(false, message);
  }
}




