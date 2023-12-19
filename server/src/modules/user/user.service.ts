import argon2 from "argon2";
import { UserModel } from "./user.model";
import crypto from "crypto";
// Creating a user
export async function createUser(input: {
    hashedPassword: string;
    username: string;
}){
    return UserModel.create({
        username: input.username,
        password: input.hashedPassword,
    });
}

// Generating a salt for passwords
export function generateSalt(){
    return crypto.randomBytes(64).toString("hex");//Random hex string of length 64 bytes is returned for the salt
}
async function generateHash(password: string){
    return argon2.hash(password) //Hash to compare user's hashed password 
}
export async function findUserByCredentials({username,
hashedPassword}: {
    username: string;
    hashedPassword: string;
}
    ){
        const user = await UserModel.findOne({username});
        const hash = await generateHash(hashedPassword) ;
        if(!user)
        {
            return null;
        }
        else if(await argon2.verify(user.password, hash))
        {
            return user;
        }
        return null;
    }