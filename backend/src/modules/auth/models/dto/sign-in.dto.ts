import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ISignIn } from '../interface/sign-in.interface';

export class SignInDto implements ISignIn {
  @ApiProperty({ example: 'Mesmer', description: 'Username' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'User password' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;
}
