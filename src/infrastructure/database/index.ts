import { Pool } from "pg";
import { appConfig } from "@/config/app.config";

export const db = new Pool({
  host: appConfig.DB.HOST,
  port: appConfig.DB.PORT,
  user: appConfig.DB.USR_NAME,
  password: appConfig.DB.PASSWORD,
  database: appConfig.DB.DATABASE,
  ssl: true
});

export const connectDatabase = async (): Promise<void> => {
  const client = await db.connect();
  client.release();
};

export const closeDatabase = async (): Promise<void> => {
  await db.end();
};
