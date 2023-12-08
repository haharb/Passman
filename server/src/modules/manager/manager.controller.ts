import { FastifyReply, FastifyRequest } from "fastify";
import { get } from "lodash";
import { updateManager } from "./manager.service";
import logger from "../../utils/logger";

export async function updateManagerHandler(request: FastifyRequest<{Body: {
    encryptedManager: string;
};
}>,
reply: FastifyReply)
{
    const userId = get(request, "user._id");

    try{
        await updateManager({
            data: request.body.encryptedManager,
            userId,
        });
        return reply.code(200).send("Manager has been updated");
    }catch(error){
        logger.error(error, "There was an error when updating the manager.");
        return reply.code(500).send(error);//Could be improved with better status codes and tests.
    }
}