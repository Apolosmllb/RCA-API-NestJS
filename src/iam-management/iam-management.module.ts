import { Module } from "@nestjs/common";
import { UsersController } from "./api/users/users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthController } from "./api/auth/auth.controller";
import { AuthService } from "./application/services/auth/auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./infrastructure/strategies/jwt.strategy";
import { User } from "./domain/entities/user.entity";
import { Account } from "./domain/entities/account.entity";
import { Profile } from "./domain/entities/profile.entity";

@Module({
  controllers: [UsersController, AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Account, Profile]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get("JWT_SECRET"),
          signOptions: {
            expiresIn: "12h"
          }
        };
      }
    })
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class IamManagementModule {
}
