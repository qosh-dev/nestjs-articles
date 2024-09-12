import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from '../cache.provider';

export function CacheInterceptor(
  namespace: string,
  contextFrom: 'body' | 'query' | 'param',
) {
  @Injectable()
  class Interceptor implements NestInterceptor {
    constructor(readonly cacheService: CacheService) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();

      const extra = request[contextFrom] as {
        [n in string]: string | number | boolean;
      };
      const key = this.cacheService.generateCacheableKey(namespace, [extra]);

      if (Object.keys(extra).length) {
        const cachedRecord = await this.cacheService.getOne(key);
        if (cachedRecord) {
          return of(cachedRecord);
        }
      }

      return next.handle().pipe(
        tap(async (body) => {
          if (!body) return body
          if (body.data) {
            let records = [];
            for (let record of body.data) {
              if (!record.id) continue;
              const key = this.cacheService.generateCacheableKey(namespace, [
                { id: record.id },
              ]);
              records.push({ key, data: record });
            }
            await this.cacheService.createMany(records);
          } else {
            await this.cacheService.create(key, body);
          }
        }),
      );
    }
  }

  return Interceptor;
}

export const CacheIt = (
  namespace: string,
  contextFrom: 'body' | 'query' | 'param',
) => applyDecorators(UseInterceptors(CacheInterceptor(namespace, contextFrom)));
