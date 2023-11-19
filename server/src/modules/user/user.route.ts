import { FastifyInstance } from "fastify";
import { FastifyPluginOptions } from "fastify";
import { FastifyError } from "fastify";
import { registerUserHandler } from "./user.controller";
function userRoutes(
    app: FastifyInstance, 
    _: FastifyPluginOptions, 
    done: (err?: FastifyError) => void
 ) {

    app.post('/', registerUserHandler);//Route registered with a prefix of /api/users
    done();

}
export default userRoutes;