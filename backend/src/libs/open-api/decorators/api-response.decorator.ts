import { HttpStatus } from '@nestjs/common';
import { ApiResponse as ApiResponseBase } from '@nestjs/swagger';
import * as lodash from 'lodash';

export const ApiResponse = (
  statusCode: HttpStatus,
  ...description: string[]
) => {
  const status = HttpStatus[statusCode]
    .split('_')
    .map((s) => lodash.capitalize(s))
    .join(' ');
  if (!description.length) {
    description = [HttpStatus[statusCode]];
  }
  return ApiResponseBase({
    status: statusCode,
    description: description.join(' | '),
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
        error: {
          type: 'string',
        },
        statusCode: {
          type: 'number',
        },
      },
      example: {
        message: description[0],
        error: status,
        statusCode: statusCode,
      },
    },
  });
};
