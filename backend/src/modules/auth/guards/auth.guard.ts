import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import * as jwt from 'jsonwebtoken';
import { BaseEntity } from '../../../database/structs/entity';
import {
  IRequestContext,
  SystemHeaders,
} from '../../../libs/als/app-context.common';
import { UserService } from '../../../modules/user/user.service';
import { CurrentUserModel } from '../models/current-user.model';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name);

  constructor(
    private readonly userService: UserService,
    private readonly als: AsyncLocalStorage<IRequestContext>,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers['authorization'];

      if (!authHeader) {
        throw new UnauthorizedException();
      }

      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException();
      }

      const res = jwt.verify(token, process.env.JWT_SECRET);
      const userId = res['data']['id'] as BaseEntity['id'];
      const user = await this.userService.findOne({ id: userId });

      if (!user) {
        throw new UnauthorizedException();
      }

      req.currentUser = CurrentUserModel.serialize(user);
      const store = {
        ...(this.als.getStore() ?? {}),
        [SystemHeaders.userId]: userId,
      } as IRequestContext;

      return this.als.run(store, () => true);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
