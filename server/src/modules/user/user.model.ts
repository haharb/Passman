import { pre, prop, getModelForClass } from "@typegoose/typegoose"// Creating a model with typegoose, allowing to export interface and model from the same class
import argon2 from "argon2";


@pre<User>("save", async function (next) {
    if(this.isModified('password') || this.isNew){
        const hash = await argon2.hash(`${this.username}:${this.password}`); // hashing username and password for added security

        this.password = hash;
        return next();
    }
})
export class User {
    @prop({required: true, unique: true})
    username: string;

    @prop({required: true})
    password: string;
} 

export const UserModel = getModelForClass(User, {
    schemaOptions: {
        timestamps: true,
    },
}
);