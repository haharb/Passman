import { FastifyInstance } from "fastify";
import createServer from "./utils/createServer";
import logger from "./utils/logger";
import { connectToDb, disconnectFromDb } from "./utils/db";

function dbShutDown(signal: string, app: FastifyInstance){// Shuts down db gracefully.
    process.on(signal, async() =>{// What to do when a shutdown signal (SIGTERM or SIGINT for example) is received.
        logger.info(`Signal ${signal} received, shutting down, goodbye!`);
        logger.flush();

        app.close();//Closes the fastify instance.
        await disconnectFromDb();
        logger.info('Done');
        setTimeout(() => {
            process.exit(0);
        }, 1000); // Delay the process exit for 1 second (adjust as needed).
    });
}
console.log("Main test");

async function main(){
    const app = createServer();

    try{
        const url = await app.listen({ port: 4000, host: "0.0.0.0" });

        logger.info(`Server is ready at ${url}`);
        await connectToDb();
        logger.flush();
    }catch(error){
        logger.error(error);
        logger.flush();
        process.exit(1);
    }

    const signals = ["SIGTERM", "SIGINT"];//Array of shutdown signals.

    for (let i = 0; i < signals.length; i++){
        dbShutDown(signals[i], app);
    }
}

main();