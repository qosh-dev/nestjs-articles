import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { CacheService } from '../cache.provider';

export function CacheInvalidateInterceptor(
  namespace: string,
  contextFrom: 'body' | 'query' | 'params',
) {
  @Injectable()
  class Interceptor implements NestInterceptor {
    constructor(readonly cacheService: CacheService) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest() as Request;
      const extra = request[contextFrom] as {
        [n in string]: string | number | boolean;
      };

      return next.handle().pipe(
        tap(async () => {
          const key = this.cacheService.generateCacheableKey(namespace, [
            extra,
          ]);
          await this.cacheService.deleteOne(key);
        }),
      );
    }
  }

  return Interceptor;
}

export const InvalidateCached = (
  namespace: string,
  contextFrom: 'body' | 'query' | 'params',
) =>
  applyDecorators(
    UseInterceptors(CacheInvalidateInterceptor(namespace, contextFrom)),
  );
