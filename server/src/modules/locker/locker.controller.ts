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
    const userId = get(request, "user.id");

    if (!userId) {
        return reply.code(400).send("User ID is required"); // Handle missing user ID
      }
    
      try {
        // Convert userId to string if it's an ObjectId
        await updateLocker({
          data: request.body.encryptedLocker,
          userId
        });
    
        return reply.code(200).send("Locker updated");
      } catch (e) {
        logger.error(e, "Error updating locker");
        return reply.code(500).send(e);
      }
    }