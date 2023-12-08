import { FastifyInstance } from "fastify";
import { FastifyPluginOptions } from "fastify";
import { FastifyError } from "fastify";
import { updateManagerHandler } from "./manager.controller";
function managerRoutes(
    app: FastifyInstance, 
    _: FastifyPluginOptions, 
    done: (err?: FastifyError) => void
 ) {
    app.put("/", {
        onRequest: [app.authenticate],
    },
    updateManagerHandler
    );
    done();

}
export default managerRoutes;