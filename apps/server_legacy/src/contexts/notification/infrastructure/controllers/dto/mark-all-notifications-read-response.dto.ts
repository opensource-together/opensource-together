export class MarkAllNotificationsReadResponseDto {
  success: boolean;
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
