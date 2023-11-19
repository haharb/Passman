import { FastifyRequest } from "fastify/types/request";
import { createUser, generateSalt } from "./user.service";
import { createVault } from "../vault/vault.service";
import { FastifyReply } from "fastify/types/reply";
import { COOKIE_DOMAIN } from "../../constants";
import logger from "../../utils/logger";
export async function registerUserHandler(request: FastifyRequest<{
    Body: Parameters<typeof createUser>[number];//We use the number as an index to avoid returning an array
}>, reply: FastifyReply)
{
    const body = request.body;

    try {
        const user = await createUser(body);
        const salt = generateSalt();
        const vault = await createVault({user: user._id.toString(), salt});//Double check this
        const accessToken = await reply.jwtSign({
            _id: user._id,
            email: user.email,
    });
    reply.setCookie("token", accessToken, {
        domain: COOKIE_DOMAIN,
        path : '/',
        secure: false, //If set to true, ensures that cookies are only sent through https connections
        httpOnly: true, //Cookie cant be accessed via javascript; only http
        sameSite: false,
    }); //Matches cookie name when creating the server in createServer.ts

    return reply.code(201).send({accessToken, vault: vault.data, salt})//if successful send the items
    }catch(error){
        logger.error(error, "error creating the user");
        return reply.code(500).send(error);
    }
}