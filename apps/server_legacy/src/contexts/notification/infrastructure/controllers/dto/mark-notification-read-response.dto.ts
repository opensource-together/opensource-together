export class MarkNotificationReadResponseDto {
  success: boolean;
  message: string;

  constructor(
    success: boolean = true,
    message: string = 'Notification marquée comme lue',
  ) {
    this.success = success;
    this.message = message;
  }

  static success(message?: string): MarkNotificationReadResponseDto {
    return new MarkNotificationReadResponseDto(
      true,
      message || 'Notification marquée comme lue',
    );
  }

  static error(message: string): MarkNotificationReadResponseDto {
    return new MarkNotificationReadResponseDto(false, message);
  }
}
