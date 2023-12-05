export const DB_CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/Passman";//Mongoose running on local server for the connection string to work

export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

export const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || "localhost";

