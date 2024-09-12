import { applyDecorators, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponse } from '../../../libs/open-api/decorators/api-response.decorator';
import { AuthError } from '../auth.common';
import { AuthGuard } from '../guards/auth.guard';

export function Authorized() {
  return applyDecorators(
    ApiResponse(HttpStatus.UNAUTHORIZED, AuthError.NOT_AUTHORIZED),
    ApiBearerAuth('JWT-auth'),
    UseGuards(AuthGuard),
  );
}
