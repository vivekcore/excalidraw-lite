import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@repo/db/prismaClient';
import {AppError} from '@repo/db/error'
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error encountered:", err);

  let statusCode = 500;
  let message = 'Something went wrong. Please try again later.';
  let details: unknown = undefined;

  // 1. Your own operational errors (NotFoundError, ValidationError, etc.)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  }

  // 2. Prisma known request errors (P2xxx codes)
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const field = (err.meta?.target as string[])?.join(', ') || 'field';
        statusCode = 409;
        message = `A record with this ${field} already exists.`;
        break;
      }
      case 'P2025':
        statusCode = 404;
        message = (err.meta?.cause as string) || 'Record not found.';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Invalid reference — related record does not exist.';
        break;
      case 'P2014':
        statusCode = 400;
        message = 'This change would violate a required relation.';
        break;
      default:
        statusCode = 400;
        message = `Database request error (${err.code}).`;
    }
  }

  // 3. Prisma validation error (bad query args, wrong types, etc.)
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data sent to the database. Please check your input.';
  }

  // 4. Prisma can't reach the database
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 503;
    message = 'Unable to connect to the database. Please try again later.';
  }

  // 5. Prisma engine crashed
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500;
    message = 'A critical database error occurred.';
  }

  // 6. Fallback: any other error (unexpected bugs, third-party throws, etc.)
  else if (err instanceof Error) {
    message = err.message || message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details !== undefined && { details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};