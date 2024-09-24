import argon2 from "argon2";
import { UserModel } from "./user.model";
import crypto from "crypto";

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

async function getHash(password: string) {
    return argon2.hash(password);
  }

// Gets user if the user exists and the hashed credentials match
export async function findUserByCredentials({username,
hashedPassword}: {
    username: string;
    hashedPassword: string;
}
    ){
        const user = await UserModel.findOne({username});
        const digest = await getHash(hashedPassword);
        if (!user || await argon2.verify(user.password, digest))
        {
            return null;
        }
        return user;
    }