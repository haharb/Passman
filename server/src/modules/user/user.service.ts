
import { UserModel } from "./user.model";
import crypto from "crypto";
// Creating a user
export async function createuser(input: {
    hashedPassword: string
    hashedEmail: string
}){
    return UserModel.create(input);
}

// Generating a salt for passwords
export function generateSalt(){
    return crypto.randomBytes(64).toString("hex");
}