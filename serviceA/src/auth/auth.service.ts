import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Login user
   * @param {AuthCredentialsDto} authCredentials
   * @returns {Promise<AuthResponseDto>}
   */
  async login(authCredentials: AuthCredentialsDto): Promise<AuthResponseDto> {
    const user = await this.userService.findOne({
      username: authCredentials.username,
    });

    if (
      !user ||
      !bcrypt.compareSync(authCredentials.password, user?.password)
    ) {
      throw new UnauthorizedException(`Credentials not valid`);
    }

    const payload = { userId: user._id };
    const access_token = await this.jwtService.sign(payload);
    return { access_token };
  }
}
