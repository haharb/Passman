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
import managerRoutes from "../modules/locker/locker.route";
import userRoutes from "../modules/user/user.route";

//NOTES: Includes an extra module called authenticate 
//from FastifyInstance (extends ) to authenticate jwt (jsonwebtokens)
declare module "fastify" {
    export interface FastifyInstance {
      authenticate: any;
    }
  }
//register methods register plugins to be used within an instance of an app, Fastify in this case.
function createServer(){
    const app = fastify({logger: true});
    //NOTES: Where the client ip is registered to enable communication
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
              // Sign cookie for extra security
              cookieName: "token",
              signed: true,
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

    app.register(managerRoutes, { prefix: "api/manager"});

    return app;

}

export default createServer;