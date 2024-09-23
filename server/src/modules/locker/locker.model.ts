import {getModelForClass, prop, Ref} from "@typegoose/typegoose";
import { User } from "../user/user.model";
export class Locker{
    @prop({required: true, ref: () => User})
    user: Ref<User>

    @prop({default: ""})
    data: string;

    @prop({required: true})
    salt: string;
}

export const LockerModel = getModelForClass(Locker, {
    schemaOptions: {
        timestamps: true,
    },
});