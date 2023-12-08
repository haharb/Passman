import { ManagerModel } from "./manager.model";

export function createManager(input: {user: string; salt: string}) {
        return ManagerModel.create(input);
    }
export function updateManager({
    userId,
    data,
}: {
    userId?: string;
    data: string;
}) {
    return ManagerModel.updateOne({user: userId}, {data});
}

export function getManagerByUser(userId: string){
    return ManagerModel.findOne({user: userId});
}