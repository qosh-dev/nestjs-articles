import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { Envs } from '../../config/config.module';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthError } from './auth.common';
import { JWTPayload } from './auth.types';
import { TokenResponse } from './models/dto/token.response';
import { ISignIn } from './models/interface/sign-in.interface';
import { ISignUp } from './models/interface/sign-up.interface';

@Injectable()
export class AuthService {
  constructor(public userService: UserService) {}

  async signUp(payload: ISignUp): Promise<TokenResponse> {
    let isUserExist = await this.userService.repo.existBy({
      username: payload.username,
    });

    if (isUserExist) {
      throw new HttpException(
        AuthError.USER_ALREADY_EXIST,
        HttpStatus.CONFLICT,
      );
    }

    const user = await this.userService.createOne(payload);
    const tokenPayload = this.createTokenPayload(user);
    const token = this.generateTokenPair(tokenPayload);
    return token;
  }

  async signIn(payload: ISignIn): Promise<TokenResponse> {
    const user = await this.userService.findOne({
      username: payload.username,
    });

    if (!user) {
      throw new UnauthorizedException(AuthError.NOT_AUTHORIZED);
    }

    const isPasswordMatch = await this.comparePassword(
      user.password,
      payload.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException(AuthError.NOT_AUTHORIZED);
    }

    const tokenPayload = this.createTokenPayload(user);
    const token = this.generateTokenPair(tokenPayload);

    return token;
  }

  public async refreshTokens(token: string) {
    const payload = await this.encryptRefreshToken(token);

    const user = await this.userService.findOne({
      id: payload.id,
    });

    if (!user) {
      throw new HttpException(AuthError.INVALID_TOKEN, HttpStatus.FORBIDDEN);
    }

    const tokens = await this.generateTokenPair(user);

    return tokens;
  }

  // -------------------------------------------------------


  async encryptRefreshToken(token: string) {
    const payload = jwt.verify(token, Envs.JWT_REFRESH) as unknown as {
      data: JWTPayload;
    };

    return payload.data;
  }
  
  private createTokenPayload(user: UserEntity): JWTPayload {
    return { id: user.id };
  }

  async generateTokenPair(
    data: {
      id: string;
    },
    lifetime = { refresh: '8d', access: '1w' },
  ) {
    const accessPayload = {
      id: data.id,
    };

    const refreshPayload = {
      id: data.id,
    };

    const accessToken = jwt.sign({ data: accessPayload }, Envs.JWT_SECRET, {
      expiresIn: lifetime.access,
    });

    const refreshToken = jwt.sign({ data: refreshPayload }, Envs.JWT_REFRESH, {
      expiresIn: lifetime.refresh,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async comparePassword(hashedPassword: string, withPassword: string) {
    return await bcrypt.compare(withPassword, hashedPassword);
  }


}
