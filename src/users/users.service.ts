import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel()  private readonly knex: Knex){}
    
    //Creates a user
    async createUser(createUserDto: CreateUserDto): Promise<number[]>{
        try{
            return await this.knex.table("users").insert({...createUserDto})
        } catch (err){
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        }
    }

    // Finds a user based on the field and the key passed
    async findUser(field: string, key: string | number){
        try{
            return await this.knex.table("users").where(field, key)
        } catch (err){
            throw new HttpException(err, HttpStatus.BAD_REQUEST)
        }
    }
}
