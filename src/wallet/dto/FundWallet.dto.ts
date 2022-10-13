import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class FundWalletDto {
    
    @IsPositive()
    @IsInt()
    @IsNotEmpty()
    amount: number
}