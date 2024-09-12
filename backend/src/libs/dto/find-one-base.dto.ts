import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';
import { IFindOneBase } from '../interfaces/find-one-base.interface';

export class FindOneBaseDto implements IFindOneBase {
  @ApiProperty({
    example: 'b0beabbd-a32b-407d-a9ee-0f6cd2d1a4ab',
    description: 'Record id',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsUUID()
  id?: string;
}
