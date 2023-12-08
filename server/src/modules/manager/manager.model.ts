import {getModelForClass, prop, Ref} from "@typegoose/typegoose";
import { User } from "../user/user.model";
export class Manager{
    @prop({required: true, ref: () => User})
    user: Ref<User>

    @prop({default: ""})
    data: string;

    @prop({required: true})
    salt: string;
}

export const ManagerModel = getModelForClass(Manager, {
    schemaOptions: {
        timestamps: true,
    },
});