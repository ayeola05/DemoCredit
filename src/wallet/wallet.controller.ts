import { Controller, Post, UseGuards, Request, HttpException, HttpStatus, BadRequestException, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
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
        const isFunded = await this.walletService.creditWallet(req.user.userId, fundWalletDto)

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

    @Post("fundTransfer")
    async fundTransfer(@Request() req, @Body() fundTransferDto: FundTransferDto){
        //Check if sender has a wallet
        const sendersWallet = await this.walletService.findWallet(req.user.userId)

        //Throw error if sender dosen't have a wallet
        if(sendersWallet.length !== 1)  throw new HttpException("Sender doesn't have a wallet", HttpStatus.BAD_REQUEST)

        //Check if receipient has a wallet
        const receipient = await this.usersService.findUser("email", fundTransferDto.email)

        const receipientsWallet = await this.walletService.findWallet(receipient[0].userId)

        //throws error if receipient dosen't have a wallet
        if(receipientsWallet.length !== 1)  throw new HttpException("receipient doesn't have a wallet", HttpStatus.BAD_REQUEST)

        //Checks if user has sufficient fund for the transfer
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
}
