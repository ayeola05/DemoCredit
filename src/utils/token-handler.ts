import * as argon2 from "argon2"

export class TokenHandler {
    static async hashKey(password: string): Promise<string> {
            return await argon2.hash(password)
    }

    static async verifyKey(hash: string, plain: string): Promise<boolean> {
            return await argon2.verify(hash, plain)
    }
}