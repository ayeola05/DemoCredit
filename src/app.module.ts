require("dotenv").config()

import { Module } from '@nestjs/common';
import { KnexModule } from 'nest-knexjs';

console.log(process.env.DB_HOST)
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
    })
  ],
})

export class AppModule {}
