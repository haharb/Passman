import { FastifyRequest } from "fastify/types/request";
import { createUser, findUserByCredentials, generateSalt } from "./user.service";
import { FastifyReply } from "fastify/types/reply";

import logger from "../../utils/logger";
import { COOKIE_DOMAIN } from "../../constants";
import { createLocker, getLockerByUser } from "../locker/locker.service";
import { Document, Model, Error as MongooseError } from 'mongoose';


export async function registerHandler(
    request: FastifyRequest<{
    Body: Parameters<typeof createUser>[number];
}>, reply: FastifyReply)// The number is used as an index to avoid returning an array
{
    const body = request.body;

    try {
        const user = await createUser(body);
        const salt = generateSalt();
        const locker = await createLocker({user: user.id, salt});

        const accessToken = await reply.jwtSign({
            id: user.id,
            username: user.username,
    });

    reply.setCookie("token", accessToken, {
        domain: COOKIE_DOMAIN,
        path : "/",
        secure: false, //If set to true, ensures that cookies are only sent through https connections
        httpOnly: true, //Cookie cant be accessed via javascript; only http
        sameSite: false,
    }); //Matches cookie name when creating the server in createServer.ts

    return reply.code(201).send({accessToken, locker: locker.data, salt});//if successful send the items
}catch(error){
    logger.error(error, "error creating the user");
    return reply.code(500).send(error);
}
}

//Handles logins through the /api/users/login endpoint
export async function loginHandler(request: FastifyRequest<{
    Body: Parameters<typeof createUser>[number];
}>, reply: FastifyReply){
    
    try{
        const user = await findUserByCredentials(request.body);

        if (!user){
            return reply.status(401).send({
                message:"Password/username invalid."
            });
        }
    
        const locker = await getLockerByUser(user.id.toString());
    
        //Digitally sign the token 
        const accessToken = await reply.jwtSign(
                {id: user.id.toString(), username: user.username},
            );
    
        reply.setCookie("token", accessToken, {
            domain: COOKIE_DOMAIN,
            path : "/",
            secure: false, //Only accept https connections
            httpOnly: true, //Cookie cant be accessed via javascript; only http
            sameSite: false, //Would need to change in production mode
        }); 
        return reply.code(200).send({accessToken, locker: locker?.data, salt: locker?.salt});//if successful send the items
    } catch(error: any){
        request.log.error(error, "Login failed");
        reply.code(401).send({ message: "Invalid username or password." });

    }
    
}