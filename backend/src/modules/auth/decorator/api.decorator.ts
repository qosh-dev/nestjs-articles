import { Get, HttpStatus, Post, applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse as ApiResponseBase,
} from '@nestjs/swagger';
import { ApiResponse } from '../../../libs/open-api/decorators/api-response.decorator';
import { AuthError } from '../auth.common';
import { SignInDto } from '../models/dto/sign-in.dto';
import { SignUpDto } from '../models/dto/sign-up.dto';
import { TokenResponse } from '../models/dto/token.response';
import { HasRefresh } from './refresh.decorator';

export const ApiPostSignUp = () =>
  applyDecorators(
    ApiResponseBase({
      status: HttpStatus.CREATED,
      description: 'Will return access token',
      type: TokenResponse,
    }),
    ApiResponse(HttpStatus.BAD_REQUEST, AuthError.INVALID_PAYLOAD),
    ApiBody({ type: SignUpDto, required: true }),
    Post('/signup'),
  );

export const ApiPostSignIn = () =>
  applyDecorators(
    ApiResponseBase({
      status: HttpStatus.OK,
      description: 'Will return access token',
      type: TokenResponse,
    }),
    ApiResponse(HttpStatus.UNAUTHORIZED, AuthError.NOT_AUTHORIZED),
    ApiBody({ type: SignInDto, required: true }),
    Post('/signin'),
  );

export const ApiGetRefreshUpdate = () =>
  applyDecorators(
    ApiOperation({
      description: 'Refresh user access_token',
      summary: 'Refresh user access_token via refresh token.',
    }),
    ApiHeader({
      name: 'token',
      example: 'some.refresh_token.here',
      description:
        'Set an refresh_token to this header, to successfully update user tokens. Remember, refresh_token lifetime is only an 24h',
    }),
    ApiResponseBase({
      status: HttpStatus.OK,
      type: TokenResponse,
      description: 'Success',
    }),
    ApiResponse(HttpStatus.BAD_REQUEST, AuthError.NO_TOKEN_ACCEPTED),
    HasRefresh(),
    Get('refresh'),
  );
