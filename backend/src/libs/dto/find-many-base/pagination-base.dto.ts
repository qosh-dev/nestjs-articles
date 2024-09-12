import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { IFindPaginationBase } from '../../../database/structs/types';

export class PaginationBaseDto implements IFindPaginationBase {
  @ApiProperty({
    description: 'Records page',
    required: false,
  })
  @Expose()
  @Transform((t) => {
    const v = Number(t.value);
    return !isNaN(v) ? v : 1;
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Records limit per page',
    required: false,
  })
  @Expose()
  @Transform((t) => {
    const v = Number(t.value);
    return !isNaN(v) ? v : 10;
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
