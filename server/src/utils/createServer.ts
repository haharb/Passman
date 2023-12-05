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
declare module "fastify" {
    export interface FastifyInstance {
      authenticate: any;
    }
  }

function createServer(){
    const app = fastify({logger: true,
    });
    app.register(cors, {
        origin: CORS_ORIGIN,
        credentials: true,
    });
        app.register(jwt, {
            secret: {
              private: fs.readFileSync(
                `${(path.join(process.cwd()), "certs")}/private_key.pem`//cwd returns current working directory for project, private key to verify certificate
              ),
              public: fs.readFileSync(
                `${(path.join(process.cwd()), "certs")}/public_key.pem`// public key to verify certificate
              ),
            },
            sign: { algorithm: "RS256" },
            cookie: {
              cookieName: "token",
              signed: false,
            },
          });
    app.register(cookie, {
        parseOptions: {},
        });
   
    app.decorate(
        "authenticate",
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
            const user = await request.jwtVerify<{
                _id: string;
            }>();
    
            request.user = user;
            } catch (error) {
            return reply.send(error);
            }
        }
        );
    app.register(userRoutes);
    app.register(vaultRoutes);
    return app;

}

export default createServer;