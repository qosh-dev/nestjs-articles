import { Get, HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiResponse as ApiResponseBase } from '@nestjs/swagger';
import { Authorized } from '../auth/decorator/authorized.decorator';
import { CurrentUserModel } from '../auth/models/current-user.model';

export const ApiGetMyProfile = () =>
  applyDecorators(
    ApiResponseBase({
      status: HttpStatus.OK,
      description: 'Will return public user data',
      type: CurrentUserModel,
    }),
    Authorized(),
    Get('me'),
  );
