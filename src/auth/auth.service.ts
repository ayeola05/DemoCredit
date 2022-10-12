import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenHandler } from 'src/utils/token-handler';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async validateUser(email: string, password: string): Promise<any> {
        //Finds data of the user trying to login
        const user = await this.usersService.findUser("email", email)
        
        //Returns user data
        if(user.length === 1 && await TokenHandler.verifyKey(user[0].password, password)) {
            return user
        }

        return null
    }

    async login(user: any){
        const payload = {email: user.email, sub: user.userId}
        return {
            userId: user.userId,
            token: this.jwtService.sign(payload)
        }
    }
}
