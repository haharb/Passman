import { LockerModel } from "./locker.model";

export function createLocker(input: {user: string; salt: string}) {
        return LockerModel.create(input);
    }
export function updateLocker({
    userId,
    data,
}: {
    userId: string;
    data: string;
}) {
    return LockerModel.updateOne({user: userId}, {data});
}

export function getLockerByUser(userId: string){
    return LockerModel.findOne({user: userId});
}