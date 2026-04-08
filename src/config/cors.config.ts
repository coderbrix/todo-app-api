import { appConfig } from "./app.config";

const allowedOrigins = [
  appConfig.CLIENT.LOCAL,
  appConfig.CLIENT.PROD,
];

export const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};