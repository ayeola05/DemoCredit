import { Controller, Post, UseGuards, Request, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WalletService } from './wallet.service';

@UseGuards(AuthGuard("jwt"))
@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService){}

    //Endpoint to create a wallet
    @Post("createWallet")
    async createWallet(@Request() req){
        //Chack if user already created a wallet
        const userWallet =  await this.walletService.findWallet(req.user.userId)

        //Throws error if user already has a wallet
        if(userWallet.length >= 1) throw new HttpException("user already created a wallet", HttpStatus.BAD_REQUEST)
        
        //Creates new wallet if user dosen't have an existing wallet
        const newUserWallet = await this.walletService.createWallet(req.user.userId)

        //Returns success message if wallet was created successfully
        if(newUserWallet.length >= 1) return "Wallet Created"

        //Else throws error if wallet wasn't created successfully
        throw new BadRequestException()
    }
}
