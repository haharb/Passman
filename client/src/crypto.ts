import pbkdf2 from "crypto-js/pbkdf2";
import { AES, SHA256, enc } from "crypto-js";

export function generateLockerKey({
    password,
    username,
    salt }:{
        password: string;
        username: string;
        salt: string;
}){
    return pbkdf2(`${username}:${password}`, salt, {
        keySize: 32,
      }).toString();
}

export function encryptLocker({lockerKey, locker}: {
    lockerKey: string;
    locker: string;
}){
    return AES.encrypt(locker, lockerKey).toString();//Encrypting the locker and its key with aes256 encryption algorithm
}

export function decryptLocker({locker, lockerKey}: {
    locker: string;
    lockerKey: string;
}) {
        const bytes = AES.decrypt(locker, lockerKey); //Data is returned as raw binary data (bytes)
        const plaintext = bytes.toString(enc.Utf8); //Needs to be converted to string with UTF-8 encoding
    try{
        return JSON.parse(plaintext).locker;
    }catch(error){
        return null;
    }
}