import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsOptional } from 'class-validator';
import { randomUUID } from 'crypto';
import { TransformStringArray } from '../validation/transformers/transform-string-array.decorator';
import { IsNotEmptyArray } from '../validation/validators/is-not-empty-array.decorator';
import { IsUuidArray } from '../validation/validators/is-uuid-array.decorator';

export abstract class IdsDtoOptional {
  @ApiProperty({
    description: 'Record ids(if specify other filters will be ignored)',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @Expose()
  @TransformStringArray()
  @IsUuidArray()
  ids?: string[];
}

export class IdsDto implements IIds {
  @ApiProperty({
    isArray: true,
    required: true,
    example: [randomUUID()],
  })
  @IsDefined()
  @Expose()
  @TransformStringArray()
  @IsUuidArray()
  @IsNotEmptyArray()
  ids: string[];
}

export interface IIds {
  ids: string[];
}
