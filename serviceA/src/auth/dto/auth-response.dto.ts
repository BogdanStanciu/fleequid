import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthResponseDto {
  @IsString()
  @ApiProperty()
  access_token: string;
}
