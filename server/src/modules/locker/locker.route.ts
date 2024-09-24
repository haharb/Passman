import { FastifyInstance } from "fastify";
import { FastifyPluginOptions } from "fastify";
import { FastifyError } from "fastify";
import { updateLockerHandler } from "./locker.controller";


export default function lockerRoutes(
    app: FastifyInstance, 
    _: FastifyPluginOptions, 
    done: (err?: FastifyError) => void
 ) {
    app.put("/", {onRequest: [app.authenticate]}, updateLockerHandler);
    done();

}