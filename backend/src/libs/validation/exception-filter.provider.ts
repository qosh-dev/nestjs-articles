import {
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationError } from 'class-validator';

export class ExceptionFilter {
  static logger: Logger = new Logger(ExceptionFilter.name);

  static provide(app: NestExpressApplication) {
    app.useGlobalPipes(ExceptionFilter.validationPipe());

    process.on('uncaughtException', (error) => {
      ExceptionFilter.logger.error(error.message, error.stack);
      process.exit(1);
    });
  }

  //--------------------------------------------------------------------

  static validationPipe() {
    return new ValidationPipe({
      transform: true,
      exceptionFactory(errors: ValidationError[]) {
        const error = errors[0];
        if (!error.constraints) {
          return new UnprocessableEntityException();
        }
        const message = error.constraints[Object.keys(error.constraints)[0]];
        return new UnprocessableEntityException(message);
      },
    });
  }
}
