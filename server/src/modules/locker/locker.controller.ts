import { FastifyReply, FastifyRequest } from "fastify";
import { get } from "lodash";
import { updateLocker } from "./locker.service";
import logger from "../../utils/logger";

export async function updateLockerHandler(request: FastifyRequest<{Body: {
    encryptedLocker: string;
};
}>,
reply: FastifyReply)
{
    const userId = get(request, "user._id");

    try{
        await updateLocker({
            data: request.body.encryptedLocker,
            userId,
        });
        return reply.code(200).send("Locker has been updated");
    }catch(error){
        logger.error(error, "There was an error when updating the locker.");
        return reply.code(500).send(error);//Could be improved with better status codes and tests.
    }
}