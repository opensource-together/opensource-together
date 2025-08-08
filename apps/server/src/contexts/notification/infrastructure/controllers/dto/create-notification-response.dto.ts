export class CreateNotificationResponseDto {
  status: string;
  message: string;
  success?: boolean;

  constructor(
    status: string = 'sent',
    message: string = 'Notification créée et envoyée avec succès',
    success: boolean = true,
  ) {
    this.status = status;
    this.message = message;
    this.success = success;
  }

  static success(): CreateNotificationResponseDto {
    return new CreateNotificationResponseDto();
  }

  static error(message: string): CreateNotificationResponseDto {
    return new CreateNotificationResponseDto('error', message, false);
  }
}
