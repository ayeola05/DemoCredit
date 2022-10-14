import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { FundWalletDto } from './dto/FundWallet.dto';

@Injectable()
export class WalletService {
    constructor(@InjectModel() private readonly knex: Knex){}

    //Service to create a wallet
    async createWallet(userId: number): Promise<number[]>{
        try{
            return await this.knex.table("wallet").insert({
                userId
            })
        } catch (err){
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        }
        
    }

    //Finds a wallet based on the userId
    async findWallet(userId: number){
        try{
            return await this.knex.table("wallet").where("userId", userId)
        } catch (err){
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        }
        
    }

    // Credits a wallet
    async creditWallet(userId: number, fundWalletDto: FundWalletDto){
        try{
            return await this.knex.table("wallet")
                .where("userId", userId)
                .increment("walletBalance", fundWalletDto.amount)
        } catch(err){
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        }
        
    }

    //Debits a wallet
    async debitWallet(userId: number, fundWalletDto: FundWalletDto){
        try{
            return await this.knex.table("wallet")
                .where("userId", userId)
                .decrement("walletBalance", fundWalletDto.amount)
        } catch(err){
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        }
        
    }
}
