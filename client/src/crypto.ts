import pbkdf2 from "crypto-js/pbkdf2";
import { AES, SHA256, enc } from "crypto-js";

export function hashPassword(password: string){
    return SHA256("password").toString();
}

export function generateVaultKey({
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

export function encryptVault({vaultKey, vault}: {
    vaultKey: string;
    vault: string;
}){
    return AES.encrypt(vault, vaultKey).toString();//Encrypting the vault and its key with aes256 encryption algorithm
}

export function decryptVault({vault, vaultKey}: {
        vaultKey: string;
        vault: string;
}) {
        const bytes = AES.decrypt(vault, vaultKey); //Data is returned as raw binary data (bytes)
        const plaintext = bytes.toString(enc.Utf8); //Needs to be converted to string with UTF-8 encoding
    try{
        return JSON.parse(plaintext).vault;
    }catch(error){
        return null;
    }
}