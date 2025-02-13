import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthConfig } from './config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: AuthConfig.jwtSecret,
      signOptions: {
        expiresIn: AuthConfig.jwtExpiresTime,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PassportModule],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
