import { Controller, Post, UseGuards, Request, HttpException, HttpStatus, BadRequestException, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { FundTransferDto } from './dto/FundTransfer.dto';
import { FundWalletDto } from './dto/FundWallet.dto';
import { WalletService } from './wallet.service';

@UseGuards(AuthGuard("jwt"))
@Controller('wallet')
export class WalletController {
    constructor(
        private readonly walletService: WalletService,
        private readonly usersService: UsersService 
    ){}

    //Endpoint to create a wallet
    @Post("createWallet")
    async createWallet(@Request() req): Promise<string>{
        //Chack if user already created a wallet
        const userWallet =  await this.walletService.findWallet(req.user.userId)
        
        //Throws error if user already has a wallet
        if(userWallet[0]) throw new HttpException("user already created a wallet", HttpStatus.BAD_REQUEST)
        
        //Creates new wallet if user dosen't have an existing wallet
        const newWallet = await this.walletService.createWallet(req.user.userId)

        console.log(newWallet)

        if(newWallet[0]) return "Wallet Created"

        throw new BadRequestException("Something went wrong")

    }

    //Endpoint to get a users wallet
    @Get("findWallet")
    async findWallet(@Request() req){
        // Checks if a user has a wallet
        const userWallet =  await this.walletService.findWallet(req.user.userId)

        //Throws error if user dosen't have a wallet
        if(!userWallet[0]) throw new HttpException("user dosen't have a wallet", HttpStatus.BAD_REQUEST)

        //Returns userWallet
        return userWallet
    }

    //Ednpoint for funding a users wallet
    @Post("fundWallet")
    async fundWallet(@Request() req, @Body() fundWalletDto: FundWalletDto){
        //Finding the wallet if it exists also validated input from my dto
        const wallet = await this.walletService.findWallet(req.user.userId)

        //Throws error is wallet dosen't exist
        if(!wallet[0]) throw new HttpException("user dosen't have a wallet", HttpStatus.BAD_REQUEST)

        //grabbing return value
        const isCredited = await this.walletService.creditWallet(req.user.userId, fundWalletDto)

        // Checking for return value and returning sucess message with wallet balance
        if(isCredited === 1){
            const updatedWallet = await this.walletService.findWallet(req.user.userId)
            return {
                message: "wallet deposit successful",
                updatedWallet
            }
        }

        //Throws error is something went wrong
        throw new BadRequestException("something went wrong")
        
    }

    //Endpoint to transfer funds from one person to another
    @Post("transferFund")
    async transferFund(@Request() req, @Body() fundTransferDto: FundTransferDto){
        //Check if sender has a wallet
        const sendersWallet = await this.walletService.findWallet(req.user.userId)

        //Throw error if sender dosen't have a wallet
        if(!sendersWallet[0])  throw new HttpException("Sender doesn't have a wallet", HttpStatus.BAD_REQUEST)

        //Check if receipient has a wallet
        const receipient = await this.usersService.findUser("email", fundTransferDto.email)
        
        if(!receipient[0]) throw new HttpException("no user found", HttpStatus.BAD_REQUEST)

        const receipientsWallet = await this.walletService.findWallet(receipient[0].userId)

        //throws error if receipient dosen't have a wallet
        if(!receipientsWallet[0])  throw new HttpException("receipient doesn't have a wallet", HttpStatus.BAD_REQUEST)

        //Checks if user has sufficient funds for the transfer
        if(fundTransferDto.amount > sendersWallet[0].walletBalance) throw new HttpException("Insufficient Balance", HttpStatus.BAD_REQUEST)

        //Grab return value to check if sender was debited
        const isDebited =  await this.walletService.debitWallet(req.user.userId, fundTransferDto)

        //Throws error if debit failed
        if(isDebited !== 1) throw new HttpException("something went wrong, failed to debit wallet", HttpStatus.BAD_REQUEST)

        //Grab return value to check if receipient was credited
        const isCredited = await this.walletService.creditWallet(receipient[0].userId, fundTransferDto)

        //Throws error if credit failed
        if(isCredited !== 1) throw new HttpException("something went wrong, failed to credit credit", HttpStatus.BAD_REQUEST)
    
        //Grab the current wallet balance of sender after debit
        const updatedSendersWallet = await this.walletService.findWallet(req.user.userId)

        //Grab the current wallet balance of receiver after credit
        const updatedReceipientsWallet = await this.walletService.findWallet(receipient[0].userId)


        //Returns success message and updated wallets of sender and receiver
        return {
            message: `Transfer between ${req.user.email} and ${receipient[0].email} was successful`,
            updatedSendersWallet,
            updatedReceipientsWallet
        }

    }

    //Endpoint to withdraw funds
    @Post("withdrawFund")
    async withdrawFund(@Request() req, @Body() fundWalletDto: FundWalletDto){
         //Finding the wallet if it exists also validated input from my dto
         const wallet = await this.walletService.findWallet(req.user.userId)

         //Throws error is wallet dosen't exist
         if(wallet.length !== 1) throw new HttpException("user dosen't have a wallet", HttpStatus.BAD_REQUEST)

        //Checks if user has sufficient funds for withdrawal
        if(fundWalletDto.amount > wallet[0].walletBalance) throw new HttpException("Insufficient Balance", HttpStatus.BAD_REQUEST)
 
         //grabbing return value
         const isDebited = await this.walletService.debitWallet(req.user.userId, fundWalletDto)
 
         // Checking for return value and returning sucess message with wallet balance
         if(isDebited === 1){
             const updatedWallet = await this.walletService.findWallet(req.user.userId)
             return {
                 message: "wallet withdrawal successful",
                 updatedWallet
             }
         }
 
         //Throws error is something went wrong
         throw new BadRequestException("something went wrong")
    }

}
