import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [WalletService],
  controllers: [WalletController],
  imports: [UsersModule]
})
export class WalletModule {}
