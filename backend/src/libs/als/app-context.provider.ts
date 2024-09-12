import { NestExpressApplication } from '@nestjs/platform-express';
import { AsyncLocalStorage } from 'async_hooks';
import { IRequestContext } from './app-context.common';
import { AppContextInterceptor } from './app-context.interceptor';
import { AppContextMiddleware } from './app-context.middleware';

export class AppContextProvider {
  static provide(app: NestExpressApplication) {
    const als = app.get<AsyncLocalStorage<IRequestContext>>(AsyncLocalStorage);
    app.use(AppContextMiddleware(als));
    app.useGlobalInterceptors(new AppContextInterceptor(als));
  }
}
