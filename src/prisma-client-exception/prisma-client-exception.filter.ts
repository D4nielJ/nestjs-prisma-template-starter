import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export default class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    switch (exception.code) {
      case 'P2002':
        const conflict = HttpStatus.CONFLICT;
        response.status(conflict).json({
          statusCode: conflict,
          message,
        });
        break;
      case 'P2025':
        const notFound = HttpStatus.NOT_FOUND;
        response.status(notFound).json({
          statusCode: notFound,
          message,
        });
      // TODO: Add more cases for other Prisma errors
      default:
        // Default 500 error
        super.catch(exception, host);
        break;
    }
  }
}
