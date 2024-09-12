import { Global, Module } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AsyncLocalStorage } from 'async_hooks';
import {
  Logger,
  LoggerErrorInterceptor,
  LoggerModule as PinoLoggerModule,
} from 'nestjs-pino';
import { AppContextModule } from '../als/app-context.module';
import { LoggerParams } from './logger.config';

@Global()
@Module({
  imports: [
    AppContextModule,
    PinoLoggerModule.forRootAsync({
      imports: [AppContextModule],
      inject: [AsyncLocalStorage],
      useFactory: LoggerParams.provide,
    }),
  ],
})
export class LoggerModule {
  static provide(app: NestExpressApplication) {
    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());
  }
}

