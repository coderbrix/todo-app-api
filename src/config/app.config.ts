import "dotenv/config";

export const appConfig = {
  MODE: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 4000,
  BASE_URL: process.env.BASE_URL || "http://localhost:4000",

  CLIENT: {
    LOCAL: process.env.CLIENT_URL || "http://localhost:3000",
    PROD: process.env.PROD_CLIENT_URL || "",
  },

  DB: {
    URI: process.env.DB_URI,
    HOST: process.env.DB_HOST,
    PORT: Number(process.env.DB_PORT),
    USR_NAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DB_DATABASE,
  },

  MAILER: {
    HOST: process.env.MAILER_HOST,
    PORT: Number(process.env.MAILER_PORT),
    SECURE: process.env.MAILER_SECURE === "true",
    USER: process.env.MAILER_USER,
    PASSWORD: process.env.MAILER_PASSWORD,
    FROM: process.env.MAILER_FROM,
  },

  JWT: {
    SECRET: process.env.JWT_SECRET || "changeMe",
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  },
};