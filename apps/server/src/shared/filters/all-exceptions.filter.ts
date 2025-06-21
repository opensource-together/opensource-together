import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof Error) {
      if (exception.message.includes('Getting userInfo failed with 401')) {
        console.warn(
          `[Supertokens] Suppressed internal error: ${exception.message}`,
        );
        return;
      }
    }
    super.catch(exception, host);
  }
}
