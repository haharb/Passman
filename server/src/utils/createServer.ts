// This is where the server is created, created in a seperate file for easier testing
import fastify from "fastify";// fast web framewor
import jwt from "@fastify/jwt";
import path from "path";
import cookie from "@fastify/cookie";
import { FastifyRequest } from "fastify";
import { FastifyReply } from "fastify";
import cors from "@fastify/cors";
import { CORS_ORIGIN } from "../constants";
import fs from "fs";
import userRoutes from "../modules/vault/vault.route";
import vaultRoutes from "../modules/vault/vault.route";
function createServer(){

    const app = fastify();
    app.register(jwt, {
        secret: {
            private: fs.readFileSync(
                `${(path.join(process.cwd()), "certs")}/private_key.pem`//cwd returns current working directory for project, private key to verify certificate
                ),
                public: fs.readFileSync(`${(path.join(process.cwd()), "certs")}/public_key.pem`)// public key to verify certificate
            },
            cookie:{
                cookieName: "accessToken",
                signed: false,
            },
            sign: { algorithm: "RS256"},
        });
    app.register(cookie, {
        parseOptions: {},
        });
    app.register(cors, {
        origin: CORS_ORIGIN,
        credentials: true,
    });
    app.decorate("authenticate", 
    async (request: FastifyRequest, reply: FastifyReply) =>{
        try {
            const user = await request.jwtVerify<{
                _id: string;
            }>();
            request.user = user;
        } catch (e) {
            return reply.send(e);
        }
    });
    app.register(userRoutes, { prefix: "api/users"});
    app.register(vaultRoutes, { prefix: "api/vault"});
    return app;

}

export default createServer;