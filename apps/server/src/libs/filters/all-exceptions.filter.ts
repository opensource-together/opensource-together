import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly Logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof Error) {
      if (exception.message.includes('Getting userInfo failed with 401')) {
        this.Logger.warn(
          `Suppressed internal error: ${exception.message}`,
          'BETTER_AUTH',
        );
        return;
      }
    }
    super.catch(exception, host);
  }
}
