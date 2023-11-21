import pbkdf2 from "crypto-js/pbkdf2";
import { SHA256 } from "crypto-js";

export function hashCredentials(password: string, email: string){
    return SHA256(`${email}: ${password}`).toString();
}

export function generateVaultKey({
    hashedCredentials,
    salt}:{
    hashedCredentials: string,
    salt: string
}){
    return pbkdf2(hashedCredentials, salt, {
        keySize: 32,
    }).toString();
}