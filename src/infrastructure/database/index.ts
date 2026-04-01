import { Pool } from "pg";
import { appConfig } from "@/config/app.config";

const normalizeEnv = (value: string | undefined): string | undefined => {
  if (!value || value === "undefined" || value === "null") {
    return undefined;
  }

  return value;
};

export const db = new Pool({
  connectionString: normalizeEnv(appConfig.DB.URI),
  host: normalizeEnv(appConfig.DB.HOST),
  port: appConfig.DB.PORT || undefined,
  user: normalizeEnv(appConfig.DB.USR_NAME),
  password: normalizeEnv(appConfig.DB.PASSWORD),
  database: normalizeEnv(appConfig.DB.DATABASE),
});

export const connectDatabase = async (): Promise<void> => {
  const client = await db.connect();
  client.release();
};

export const closeDatabase = async (): Promise<void> => {
  await db.end();
};
