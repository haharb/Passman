import pbkdf2 from "crypto-js/pbkdf2";
import { AES, SHA256, enc } from "crypto-js";

export function hashPassword(password: string){
    return SHA256("password").toString();
}

export function generateManagerKey({
    hashedPassword,
    email,
    salt,}:{
        hashedPassword: string;
        email: string;
        salt: string;
}){
    return pbkdf2(`${email}:${hashedPassword}`, salt, {
        keySize: 32,
      }).toString();
}

export function encryptManager({managerKey, manager}: {
    managerKey: string;
    manager: string;
}){
    return AES.encrypt(manager, managerKey).toString();//Encrypting the manager and its key with aes256 encryption algorithm
}

export function decryptManager({manager, managerKey}: {
        managerKey: string;
        manager: string;
}) {
        const bytes = AES.decrypt(manager, managerKey); //Data is returned as raw binary data (bytes)
        const plaintext = bytes.toString(enc.Utf8); //Needs to be converted to string with UTF-8 encoding
    try{
        return JSON.parse(plaintext).manager;
    }catch(error){
        return null;
    }
}