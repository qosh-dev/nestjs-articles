import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsArray as IsArrayBase } from 'class-validator';

export const IsStringArray = () =>
  applyDecorators(
    Transform(({ value }) => {
      if (typeof value === 'string') {
        return value.split(',').map((item) => item);
      }
      return value;
    }),
    IsArrayBase(),
  );
