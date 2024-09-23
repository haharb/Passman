import { FastifyInstance } from "fastify";
import { FastifyPluginOptions } from "fastify";
import { FastifyError } from "fastify";
import { loginHandler, registerHandler } from "./user.controller";

function userRoutes(
    app: FastifyInstance, 
    _: FastifyPluginOptions, 
    done: (err?: FastifyError) => void
 ) {

    app.post('/', registerHandler);

    app.post('/login', loginHandler);
    
    done();

}
export default userRoutes;