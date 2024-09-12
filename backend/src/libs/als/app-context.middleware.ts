import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';
import { IRequestContext, SystemHeaders } from './app-context.common';

export function AppContextMiddleware(als: AsyncLocalStorage<IRequestContext>) {
  return (req, res, next) => {
    const headers = req.headers;
    const requestId = headers[SystemHeaders.xRequestId] as string;
    const store = {
      [SystemHeaders.xRequestId]:
        !requestId! || requestId! === '' ? randomUUID() : requestId!,
    };
    req.headers[SystemHeaders.xRequestId] = store[SystemHeaders.xRequestId];
    return als.run(store as any, () => next());
  };
}
