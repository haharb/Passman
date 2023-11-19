// Used for holding constant variables throughout the app
export const DB_CON_STRING = process.env.DB_CON_STRING || 
'mongodb://localhost:27017/PassMan'; //Mongoose running on local server for the connection string to work
export const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || 'localhost';
export const CORS_ORIGIN  = process.env.CORS_ORIGIN || "http://localhost:3000";
