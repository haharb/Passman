//Functions for connecting and disconnecting to the database.
import mongoose from "mongoose";//Mongoose for object data modeling for mongodb
import { DB_CONNECTION_STRING } from "../constants";
import logger from "./logger";


export async function connectToDb(){
    try {
        await mongoose.connect(DB_CONNECTION_STRING);
    } catch (error) {
        logger.error(error, "There was en error connecting to database, check that mongodb server is running.");
        process.exit(1);
    }
}

export async function disconnectFromDb(){
    await mongoose.connection.close();
    
    logger.info("Disconnected from the database.");

    return;
}