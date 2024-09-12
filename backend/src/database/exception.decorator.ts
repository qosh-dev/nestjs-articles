import {
  applyDecorators,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommonError } from 'src/libs/common/common.error';
import { EntityPropertyNotFoundError, QueryFailedError } from 'typeorm';
import { DatabaseError } from './database.common';

function DatabaseExceptionDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;
  const logger = new Logger('Database');

  descriptor.value = async function (...args: any[]) {
    try {
      const res = await originalMethod.apply(this, args);
      return res;
    } catch (error) {
      handleError(error, logger);
    }
  };
}

function handleError(error: any, logger: Logger) {
  if (error.message.startsWith('invalid input syntax for type uuid')) {
    throw new BadRequestException(DatabaseError.INVALID_IDENTIFIER_TYPE);
  }

  if (error instanceof EntityPropertyNotFoundError) {
    logger.error(error.message, error.stack);
    throw new InternalServerErrorException(CommonError.INTERNAL_SERVER_ERROR);
  }

  if (error instanceof QueryFailedError) {
    if (error.driverError.code === '23505') {
      throw new BadRequestException(DatabaseError.DUBLICATE_RECORD);
    }

    throw new BadRequestException();
  }

  if (error instanceof UnprocessableEntityException) {
    throw new BadRequestException(DatabaseError.INVALID_FILTER);
  }

  logger.error(error.message, error.stack);
}

// ------------------------------------------------------------------

export const DatabaseException = () =>
  applyDecorators(DatabaseExceptionDecorator);
