import argon2 from "argon2";
import { UserModel } from "./user.model";
import crypto from "crypto";

export async function createUser(input: {
    password: string;
    username: string;
}){
    return UserModel.create({
        username: input.username,
        password: input.password,
    });

}

// Generating a salt for passwords
export function generateSalt(){
    return crypto.randomBytes(64).toString("hex");//Random hex string of length 64 bytes is returned for the salt
}

// Gets user if the user exists and the hashed credentials match
export async function findUserByCredentials({username,
password}: {
    username: string;
    password: string;
}
    ){
        const user = await UserModel.findOne({username});
        if (user && await argon2.verify(user.password, password))
        {
            return user;
        }
        return null;
    }