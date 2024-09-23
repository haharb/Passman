import argon2 from "argon2";
import { UserModel } from "./user.model";
import crypto from "crypto";

export async function createUser(input: {
    username: string;
    hashedPassword: string;
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
// Generate a hash for the password
async function generateHash(password: string){
    return argon2.hash(password) //Hash to compare user's hashed password 
}

// Gets user and the hashed password if the user exists
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