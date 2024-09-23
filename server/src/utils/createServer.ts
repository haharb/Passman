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
import lockerRoutes from "../modules/locker/locker.route";
import userRoutes from "../modules/user/user.route";


declare module "fastify" {
    export interface FastifyInstance {
      authenticate: any;
    }
  }

//register methods register plugins to be used within an instance of an app, Fastify in this case.
export default function createServer(){
    const app = fastify({logger: true});

    app.register(cors, {
        origin: CORS_ORIGIN,
        credentials: true,
    });



    const privateKeyPath = path.join(process.cwd(), "certs", "private_key.pem");

    const publicKeyPath = path.join(process.cwd(), "certs", "public_key.pem");

    const privateKey = fs.readFileSync(privateKeyPath);
    const publicKey = fs.readFileSync(publicKeyPath);

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

    app.register(userRoutes, { prefix: "api/users"});

    app.register(lockerRoutes, { prefix: "api/locker"});

    return app;

}
