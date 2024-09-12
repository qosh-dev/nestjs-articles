import { RequestMethod } from '@nestjs/common';
import { MiddlewareConfigProxy } from '@nestjs/common/interfaces';
import { AsyncLocalStorage } from 'async_hooks';
import { ServerResponse } from 'http';
import { Params } from 'nestjs-pino';
import * as path from 'path';
import pino, { DestinationStream } from 'pino';
import { Options } from 'pino-http';
import { NodeEnv } from 'src/config/config-validation';
import { Envs } from 'src/config/config.module';
import { IRequestContext, SystemHeaders } from '../als/app-context.common';
import { TransportType } from './logger.type';

export class LoggerParams implements Params {
  pinoHttp?: Options | DestinationStream | [Options, DestinationStream];
  exclude?: Parameters<MiddlewareConfigProxy['exclude']>;

  static provide(als: AsyncLocalStorage<IRequestContext>) {
    return new LoggerParams(als);
  }

  constructor(readonly als: AsyncLocalStorage<IRequestContext>) {
    this.exclude = [{ path: '/favicon.ico', method: RequestMethod.GET }];
    this.pinoHttp = {
      enabled: true,
      redact: {
        paths: [
          'password',
          'reqBody.password',
          'user.password',
          'reqBody.user.password',
        ],
      },
      hooks: {
        logMethod: this.logMethod,
      },
      transport: {
        targets: this.transportTargets(),
      },
      mixin: () => this.customizeLog(),
      customProps: () => this.customizeLog(),
    };
  }

  private logMethod(
    _inputArgs: Parameters<pino.LogFn>,
    method: pino.LogFn,
    level: number,
  ) {
    let inputArgs = _inputArgs as any;
    const context = (inputArgs[0] as any).context;
    const exceptedContexts = [
      'RouterExplorer',
      'RoutesResolver',
      'InstanceLoader',
    ];
    if (exceptedContexts.includes(context)) return;
    const logData = inputArgs[0] as any as any;
    const res = logData?.res as ServerResponse;
    const req = res?.req as any as Request;

    req?.body && (inputArgs[0]['x-req'] = { body: req?.body });

    if (res && req) {
      const isNotOk = res.statusCode < 200 && res.statusCode >= 300;

      if (isNotOk) {
        let resError = logData.err || {};
        inputArgs[0] = {
          ...inputArgs[0],
          res: res,
          err: resError,
          responseTime: logData.responseTime,
        };
      }
    }
    return method.apply(this, inputArgs);
  }

  private customizeLog() {
    const store = this.als.getStore();
    return {
      [SystemHeaders.xRequestId]: store?.[SystemHeaders.xRequestId],
      [SystemHeaders.userId]: store?.[SystemHeaders.userId],
    };
  }

  private transportTargets() {
    let logsDirectory: string = path.join(__dirname, '../../..', 'logs/');

    const transportFormatted: TransportType[] = [];

    if (Envs.NODE_ENV === NodeEnv.production) {
      transportFormatted.push({
        target: 'pino/file',
        options: {
          destination: logsDirectory + `app.log`,
          translateTime: "yyyy-mm-dd'T'HH:MM:ss.l'Z'",
          mkdir: true,
        },
      });
    }

    if (Envs.NODE_ENV === NodeEnv.development) {
      transportFormatted.push({
        target: 'pino-pretty',
        options: {
          name: 'terminal',
          colorize: true,
          singleLine: true,
        },
      });
    }

    return transportFormatted;
  }
}
