import { Body, Controller, Get, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenHandler } from 'src/utils/token-handler';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private  readonly usersService: UsersService){}

    //Endpoint to create a user
    @Post()
    async create(@Body() createUserDto: CreateUserDto){

        //Checks if email already exists
        const userEmail = await this.usersService.findUser("email", createUserDto.email)

        //Throws error is email already exists
        console.log(userEmail[0].password)
        if(userEmail.length >= 1) throw new HttpException("email already exists", HttpStatus.BAD_REQUEST)

        //HASH PASSWORD
        createUserDto.password = await TokenHandler.hashKey(createUserDto.password)

        //Grabs return value
        const newUser = await this.usersService.createUser(createUserDto)

        // Returns sucess message
        if(newUser.length >= 1) return "User Created"
        
    }

    //Endpoint to get a logged in users profile based on their userId
    @UseGuards(AuthGuard("jwt"))
    @Get("getProfile")
    async getProfile(@Request() req){
        return this.usersService.findUser("userId", req.user.userId)
    }
}

