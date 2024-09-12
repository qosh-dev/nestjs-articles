export enum SystemHeaders {
  xRequestId = 'x-request-id',
  userId = 'x-user-id',
}

export interface IRequestContext {
  [SystemHeaders.xRequestId]: string;
  [SystemHeaders.userId]: string;
}
