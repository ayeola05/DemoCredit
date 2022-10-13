import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { FundWalletDto } from './dto/FundWallet.dto';

@Injectable()
export class WalletService {
    constructor(@InjectModel() private readonly knex: Knex){}

    //Service to create a wallet
    async createWallet(userId: number){
        return await this.knex.table("wallet").insert({
            userId
        })
    }

    //Finds a wallet based on the userId
    async findWallet(userId: number){
        return await this.knex.table("wallet").where("userId", userId)
    }

    // Credits a wallet
    async creditWallet(userId: number, fundWalletDto: FundWalletDto){
        return await this.knex.table("wallet")
            .where("userId", userId)
            .increment("walletBalance", fundWalletDto.amount)
    }

    //Debits a wallet
    async debitWallet(userId: number, fundWalletDto: FundWalletDto){
        return await this.knex.table("wallet")
            .where("userId", userId)
            .decrement("walletBalance", fundWalletDto.amount)
    }
}
