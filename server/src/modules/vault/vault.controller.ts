import { FastifyReply, FastifyRequest } from "fastify";
import { get } from "lodash";
import { updateVault } from "./vault.service";
import logger from "../../utils/logger";

export async function updateVaultHandler(request: FastifyRequest<{Body: {
    encryptedVault: string;
};
}>,
reply: FastifyReply)
{
    const userId = get(request, "user._id");

    try{
        await updateVault({
            data: request.body.encryptedVault,
            userId,
        });
        return reply.code(200).send("Vault has been updated");
    }catch(error){
        logger.error(error, "There was an error when updating the vault.");
        return reply.code(500).send(error);//Could be improved with better status codes and tests.
    }
}