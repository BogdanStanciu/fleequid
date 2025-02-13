import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    type: AuthResponseDto,
    description:
      'Authenticate a user by username and password, returning a JWT if valid.',
    example: {
      access_token: '#######',
    },
  })
  @ApiBody({
    type: AuthCredentialsDto,
  })
  @Post('login')
  async login(
    @Body() authCredentials: AuthCredentialsDto,
  ): Promise<AuthResponseDto> {
    return this.authService.login(authCredentials);
  }
}
