import { FastifyInstance } from "fastify";
import { FastifyPluginOptions } from "fastify";
import { FastifyError } from "fastify";
import { loginHandler, registerHandler } from "./user.controller";
function userRoutes(
    app: FastifyInstance, 
    _: FastifyPluginOptions, 
    done: (err?: FastifyError) => void
 ) {

    app.post('/', registerHandler);//Route registered with a prefix of /api/users
    app.post('/login', loginHandler);//Route registered with a prefix of /api/users/login
    done();

}
export default userRoutes;