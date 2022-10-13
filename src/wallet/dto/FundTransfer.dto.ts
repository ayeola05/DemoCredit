import { IsNotEmpty, IsString, IsEmail, IsInt, IsPositive } from "class-validator"


export class FundTransferDto {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    amount: number
}