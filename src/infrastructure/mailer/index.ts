import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import hbs from "nodemailer-express-handlebars";
import { appConfig } from "@/config/app.config";

const transporter = nodemailer.createTransport({
  host: appConfig.MAILER.HOST,
  // port: appConfig.MAILER.PORT,
  secure: appConfig.MAILER.SECURE,
  auth: {
    user: appConfig.MAILER.USER,
    pass: appConfig.MAILER.PASSWORD,
  },
});

// template config
transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      partialsDir: path.resolve(__dirname, "templates"),
    },
    viewPath: path.resolve(__dirname, "templates"),
    extName: ".hbs",
  }),
);

export default transporter;
