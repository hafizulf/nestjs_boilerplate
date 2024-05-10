import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { Response } from 'express';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        errors: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      const formattedErrors = {};
      for (const issue of exception.issues) {
        const { path, message } = issue;
        const field = path.join('.');

        formattedErrors[field] = formattedErrors[field] || [];
        formattedErrors[field].push(message);
      }

      response.status(400).json({
        message: 'Validation error',
        errors: formattedErrors,
      });
    } else {
      response.status(500).json({
        errors: exception.message,
      });
    }
  }
}
