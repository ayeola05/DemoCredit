import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenHandler } from '../utils/token-handler';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private  readonly usersService: UsersService,
    ){}

    //Endpoint to create a user
    @Post("register")
    async createUser(@Body() createUserDto: CreateUserDto): Promise<number[]>{

        //Checks if email already exists
        const userEmail = await this.usersService.findUser("email", createUserDto.email)

        //Throws error is email already exists
        if(userEmail[0]) throw new HttpException("email already exists", HttpStatus.BAD_REQUEST)

        //HASH PASSWORD
        createUserDto.password = await TokenHandler.hashKey(createUserDto.password)

        //returns user
        return await this.usersService.createUser(createUserDto)
    }

    //Endpoint to get a logged in users profile based on their userId
    @UseGuards(AuthGuard("jwt"))
    @Get("getProfile")
    async getProfile(@Request() req){
        return this.usersService.findUser("userId", req.user.userId)
    }

}

