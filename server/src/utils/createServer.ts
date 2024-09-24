// This is where the server is created, created in a seperate file for easier testing
import fastify from "fastify";// fast web framewor
import jwt from "@fastify/jwt";
import path from "path";
import cookie from "@fastify/cookie";
import { FastifyRequest } from "fastify";
import { FastifyReply } from "fastify";
import cors from "@fastify/cors";
import { CORS_ORIGIN } from "../constants";
import { readFileSync, existsSync } from "fs";
import lockerRoutes from "../modules/locker/locker.route";
import userRoutes from "../modules/user/user.route";
import logger from "./logger";

//Extend fastify to include a custom authenticate function
declare module "fastify" {
    export interface FastifyInstance {
      authenticate: any;
    }
  }

//register methods register plugins to be used within an instance of an app, Fastify in this case.
export default function createServer(){

    
    const app = fastify({logger: true});

    //CORS middleware allows for restricting to certain domains/origins,
    // credentials:true allows for cookies to be sent
    app.register(cors, {
        origin: CORS_ORIGIN,
        credentials: true,
    });


    //Ensure that the private and public keys exist before grabbing them
    const privateKeyPath = path.join(process.cwd(), "certs", "private_key.pem");

    const publicKeyPath = path.join(process.cwd(), "certs", "public_key.pem");

    if (!existsSync(privateKeyPath)) {
      throw new Error(`Private key file not found at path: ${privateKeyPath}`);
    }
    
    if (!existsSync(publicKeyPath)) {
      throw new Error(`Public key file not found at path: ${publicKeyPath}`);
    }
    
    const privateKey = readFileSync(privateKeyPath);
    const publicKey = readFileSync(publicKeyPath);

    //JWT plugin to sign/verify tokens
    app.register(jwt, {
        secret: {
          private: privateKey,
          public: publicKey,
        },
            sign: { algorithm: "RS256" },
            cookie: {
              cookieName: "token",
              signed: false,
            },
          });

    //Cookie plugin allows for handling cookies
    app.register(cookie, {
      parseOptions: {},
      });
   
    // Authenticate is a decorator function that handles verifying jwt tokens within the request
    app.decorate(
        "authenticate",
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
              const user = await request.jwtVerify<{
                  id: string;
              }>();
    
              request.user = user;
            } catch (error) {
              logger.error(`Authentication failed: ${(error as Error).message}`);
              reply.code(401).send({ message: "Unauthorized" });
            }
        }
        );

    app.register(userRoutes, { prefix: "api/users"});

    app.register(lockerRoutes, { prefix: "api/locker"});

    return app;

}
