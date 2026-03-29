import "dotenv/config";

export const appConfig = {
  MODE: String(process.env.NODE_ENV) || "development",
  PORT: Number(process.env.PORT),
  DB: {
    URI: String(process.env.DB_URI),
    HOST: String(process.env.DB_HOST),
    PORT: Number(process.env.DB_PORT),
    USR_NAME: String(process.env.DB_USERNAME),
    PASSWORD: String(process.env.DB_PASSWORD),
    DATABASE: String(process.env.DB_DATABASE),
  },
  MAILER: {
    HOST: String(process.env.MAILER_HOST),
    PORT: String(process.env.MAILER_PORT),
    SECURE: Boolean(process.env.MAILER_SECURE),
    USER: String(process.env.MAILER_USER),
    PASSWORD: String(process.env.MAILER_PASSWORD),
    FROM: String(process.env.MAILER_FROM),
  },
  JWT: {
    SECRET: String(process.env.JWT_SECRET),
    EXPIRES_IN: String(process.env.JWT_EXPIRES_IN),
  },
};
