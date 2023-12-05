import { FastifyInstance } from "fastify";
import { FastifyPluginOptions } from "fastify";
import { FastifyError } from "fastify";
import { updateVaultHandler } from "./vault.controller";
function vaultRoutes(
    app: FastifyInstance, 
    _: FastifyPluginOptions, 
    done: (err?: FastifyError) => void
 ) {

    app.put("/", {
        onRequest: [app.authenticate],
    },
    updateVaultHandler
    );
    done();

}
export default vaultRoutes;