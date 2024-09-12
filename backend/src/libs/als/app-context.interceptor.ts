import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IRequestContext, SystemHeaders } from './app-context.common';

@Injectable()
export class AppContextInterceptor implements NestInterceptor {
  constructor(readonly als: AsyncLocalStorage<IRequestContext>) {}
  intercept(execContext: ExecutionContext, next: CallHandler): Observable<any> {
    const existStore: Partial<IRequestContext> = this.als?.getStore() ?? {};
    const contextType = execContext.getType() as string;
    let requestId = existStore?.[SystemHeaders.xRequestId] ?? '';
    let employeId: string;

    if (contextType === 'http') {
      const request = execContext.switchToHttp().getRequest();
      const headers = request.headers;
      requestId = headers[SystemHeaders.xRequestId] as string;
      employeId = request.currentEmployee?.id;
    }

    if (!requestId || requestId! === '') {
      requestId = randomUUID();
    }

    const store: IRequestContext = {
      ...existStore,
      [SystemHeaders.xRequestId]: requestId,
      [SystemHeaders.userId]: employeId,
    };
    return this.als.run(store, () =>
      next.handle().pipe(
        catchError((err) => {
          this.setResponseHeaders(store, execContext);
          return throwError(err);
        }),
        map((data) => {
          this.setResponseHeaders(store, execContext);
          return data;
        }),
      ),
    );
  }

  private setResponseHeaders(
    store: IRequestContext,
    execContext: ExecutionContext,
  ) {
    const requestId = store[SystemHeaders.xRequestId];
    const employeeId = store[SystemHeaders.userId];
    const res = execContext.switchToHttp().getResponse();
    requestId && res.setHeader(SystemHeaders.xRequestId, requestId);
    // employeeId && res.setHeader(SystemHeaders.employeeId, employeeId);
  }
}
