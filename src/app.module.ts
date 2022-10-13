require("dotenv").config()

import { Module } from '@nestjs/common';
import { KnexModule } from 'nest-knexjs';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    KnexModule.forRoot({
    config: {
      client: "mysql",
      version: "8.0.30",
      useNullAsDefault: true,
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
      }
    }),
    AuthModule,
    UsersModule,
    WalletModule
  ],
})

export class AppModule {}
