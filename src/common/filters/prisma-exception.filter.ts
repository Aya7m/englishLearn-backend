import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    if (exception.code === 'P2002') {
      return response.status(HttpStatus.CONFLICT).json({
        message: 'Unique field already exists',
      });
    }

    return response.status(HttpStatus.BAD_REQUEST).json({
      message: 'Database error',
      code: exception.code,
      meta: exception.meta,
    });
  }
}
