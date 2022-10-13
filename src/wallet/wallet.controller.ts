import { Controller, Post, UseGuards, Request, HttpException, HttpStatus, BadRequestException, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FundWalletDto } from './dto/FundWallet.dto';
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
        throw new BadRequestException("something went wrong")
    }

    //Ednpoint for funding a users wallet
    @Post("fundWallet")
    async fundWallet(@Request() req, @Body() fundWalletDto: FundWalletDto){
        //Finding the wallet if it exists also validated input from my dto
        const wallet = await this.walletService.findWallet(req.user.userId)

        //Throws error is wallet dosen't exist
        if(wallet.length < 1) throw new HttpException("user dosen't have a wallet", HttpStatus.BAD_REQUEST)

        //grabbing return value
        const isFunded = await this.walletService.fundWallet(req.user.userId, fundWalletDto)

        // Checking for return value and returning sucess message with wallet balance
        if(isFunded === 1){
            const updatedWallet = await this.walletService.findWallet(req.user.userId)
            return {
                message: "wallet deposit successful",
                updatedWallet
            }
        }

        //Throws error is something went wrong
        throw new BadRequestException("something went wrong")
        
    }
}
