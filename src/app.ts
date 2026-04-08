import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "@/routes";
import { errorMiddleware } from "@/middlewares/error.middleware";
import { NotFoundException } from "./core/exceptions/not-found.exception";
import { corsOptions } from "./config/cors.config";

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use(routes);
app.use((_req, _res, next) => {
  next(new NotFoundException());
});
app.use(errorMiddleware);

export default app;
