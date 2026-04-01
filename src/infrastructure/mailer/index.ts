import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
  },
});

// template config
transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.resolve(__dirname, "templates"),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, "templates"),
    extName: ".hbs",
  })
);

export default transporter;