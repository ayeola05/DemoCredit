import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { FundWalletDto } from './dto/FundWallet.dto';

@Injectable()
export class WalletService {
    constructor(@InjectModel() private readonly knex: Knex){}

    //Service to create a wallet
    async createWallet(userId: string){
        return await this.knex.table("wallet").insert({
            userId
        })
    }

    //Finds a wallet based on the userId
    async findWallet(userId: string){
        return await this.knex.table("wallet").where("userId", userId)
    }

    // Updates amount deposited by the user
    async fundWallet(userId: string, fundWalletDto: FundWalletDto){
        return await this.knex.table("wallet")
            .where("userId", userId)
            .increment("walletBalance", fundWalletDto.amount)
    }
}
