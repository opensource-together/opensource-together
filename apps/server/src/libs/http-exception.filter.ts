import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';

interface ExceptionResponseObject {
  message?: string;
  code?: string;
  statusCode?: number;

  [key: string]: any;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger = new Logger()) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error(exception);

    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

      const exceptionResponse =
        exception.getResponse() as ExceptionResponseObject;

      message = exceptionResponse.message || message;
      const code = exceptionResponse.code;
      delete exceptionResponse.message;
      delete exceptionResponse.statusCode;

      response.json({
        httpStatus: status,
        error: {
          message: message,
          code: code,
          extra:
            process.env.NODE_ENV === 'production'
              ? undefined
              : { ...exceptionResponse },
        },
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR);
      response.json({ error: { message: message } });
    }
  }
}
