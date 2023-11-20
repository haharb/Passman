import { SHA256 } from "crypto-js";

export function hashCredentials(password: string, email: string){
    return SHA256(`${email}: ${password}`).toString();
}