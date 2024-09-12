import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ISignUp } from '../interface/sign-up.interface';

export class SignUpDto implements ISignUp {
  @ApiProperty({ example: 'Mesmer', description: 'Username' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'User password' })
  @Expose()
  @IsNotEmpty()
  password: string;
}
