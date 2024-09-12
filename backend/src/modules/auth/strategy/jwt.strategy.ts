import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Envs } from '../../../config/config.module';
import { UserService } from '../../user/user.service';
import { AuthError } from '../auth.common';
import { JWTStrategyValidatePayload } from '../auth.types';
import { CurrentUserModel } from '../models/current-user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    readonly configService: ConfigService,
    readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Envs.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JWTStrategyValidatePayload) {
    const user = await this.userService.findOne({ id: payload.id });
    if (!user) {
      throw new UnauthorizedException(AuthError.NOT_AUTHORIZED);
    }
    return plainToInstance(
      CurrentUserModel,
      user,
      {
        enableCircularCheck: true,
        excludeExtraneousValues: true,
      },
    );
  }
}
