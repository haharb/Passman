//This creates a logger file for enhanced security
import pino from "pino";// pino is a logging utility

const logger = pino({
    transport: {
        target: 'pino-pretty',//prettifies the log in a more readible way
        options: {
            ignore: 'hostname',// possibly change, not sure if helpful to ignore host name
        },
        }
        
});

export default logger;