import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPaylaod } from './jwt-payload.interface';
import { AuthConfig } from './config';
import { UserService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AuthConfig.jwtSecret,
    });
  }

  /**
   * Takes a JWT payload containing the userId
   * and return the user if found, otherwise throw exceptions
   * @param {JwtPaylaod} payload
   * @returns {Promise<User>}
   * @throws {UnauthorizedException}
   */
  async validate(payload: JwtPaylaod): Promise<User> {
    const { userId } = payload;

    const user = await this.userService.findOne({ _id: userId });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
