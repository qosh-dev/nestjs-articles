import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { AuthError } from '../auth.common';

export class RefreshGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const token = req.headers['token'];
      if (!token)
        throw new HttpException(
          AuthError.NO_TOKEN_ACCEPTED,
          HttpStatus.BAD_REQUEST,
        );
      jwt.verify(token, process.env.JWT_REFRESH);
      return true;
    } catch (e) {
      throw new HttpException(AuthError.INVALID_TOKEN, HttpStatus.FORBIDDEN);
    }
  }
}
