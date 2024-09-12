import { Logger } from '@nestjs/common';
import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Envs } from './config/config.module';
import { AppContextProvider } from './libs/als/app-context.provider';
import { LoggerModule } from './libs/logger/logger.module';
import { OpenApiProvider } from './libs/open-api/open-api.provider';
import { ExceptionFilter } from './libs/validation/exception-filter.provider';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

  const corsPolicy: CorsOptions | CorsOptionsDelegate<any> = {
    origin: Envs.API_CORS_ORIGIN,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'Origin',
      'Accept',
      'tz'
    ],
  };
  app.setGlobalPrefix(Envs.API_PREFIX);
  app.enableCors(corsPolicy);
  const logger = new Logger('Application');

  AppContextProvider.provide(app);
  LoggerModule.provide(app);
  OpenApiProvider.provide(app);
  ExceptionFilter.provide(app);

  await app.listen(Envs.API_PORT);
  logger.log(`App port: ${Envs.API_PORT}`);
}
bootstrap();
