import { FastifyRequest } from "fastify/types/request";
import { createUser, findUserByCredentials, generateSalt } from "./user.service";
import { FastifyReply } from "fastify/types/reply";

import logger from "../../utils/logger";
import { COOKIE_DOMAIN } from "../../constants";
import { createManager, getManagerByUser } from "../manager/manager.service";
import { Document, Model, Error as MongooseError } from 'mongoose';
export async function registerHandler(request: FastifyRequest<{
    Body: Parameters<typeof createUser>[number];
}>, reply: FastifyReply)//We use the number as an index to avoid returning an array
{
    const body = request.body;

    try {
        const user = await createUser(body);
        const salt = generateSalt();
        const manager = await createManager({user: user._id.toString(), salt});//Double check this
        const accessToken = await reply.jwtSign({
            _id: user._id,
            username: user.username,
    });
    reply.setCookie("token", accessToken, {
        domain: COOKIE_DOMAIN,
        path : "/",
        secure: false, //If set to true, ensures that cookies are only sent through https connections
        httpOnly: true, //Cookie cant be accessed via javascript; only http
        sameSite: false,
    }); //Matches cookie name when creating the server in createServer.ts

    return reply.code(201).send({accessToken, manager: manager.data, salt});//if successful send the items
}catch(error){
    logger.error(error, "error creating the user");
    return reply.code(500).send(error);
}
}
export async function loginHandler(request: FastifyRequest<{
    Body: Parameters<typeof createUser>[number];
}>, reply: FastifyReply){
    const user = await findUserByCredentials(request.body);
    if (!user){
        return reply.status(401).send({
            message:"Password/username invalid."
        });
    }
    const manager = await getManagerByUser(String(user._id));
    const accessToken = await reply.jwtSign({
        _id: user._id,
        username: user.username,
    });
    reply.setCookie("token", accessToken, {
        domain: COOKIE_DOMAIN,
        path : "/",
        secure: false, //If set to true, ensures that cookies are only sent through https connections
        httpOnly: true, //Cookie cant be accessed via javascript; only http
        sameSite: false,
    }); 
    return reply.code(200).send({accessToken, manager: manager?.data, salt: manager?.salt});//if successful send the items
}