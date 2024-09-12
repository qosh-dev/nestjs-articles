import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class IdDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsUUID()
  @Expose()
  id: string;
}
