import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";


@Injectable()
export class Localstrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super({usernameField: "email"})
    }

    async validate(username: string, password: string): Promise<any> {
        //Validates a users credentials
        const user = await this.authService.validateUser(username, password)

        //Throws unauthorized error if no user is found
        if(!user) throw new UnauthorizedException()

        //Returns a user if found
        return user
    }

}