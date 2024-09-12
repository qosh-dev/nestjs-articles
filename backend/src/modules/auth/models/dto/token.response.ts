import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty({
    name: 'access_token',
    example: 'some.jwt.here',
    description: 'Lifetime 12h',
  })
  accessToken: string;

  @ApiProperty({
    name: 'refresh_token',
    example: 'some.jwt.here',
    description: 'Lifetime 24h',
  })
  refreshToken: string;
}
