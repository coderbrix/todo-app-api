import transporter from "../infrastructure/mailer";

export class MailService {
  constructor() {}

  // Welcome Email
  async sendWelcomeEmail(name: string, email: string): Promise<void> {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Todo App 🎉",
      template: "welcome",
      context: { name },
    });
  }

  // Reset Password
  async sendResetPasswordEmail(
    email: string,
    token: string
  ): Promise<void> {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    const resetLink = `${baseUrl}/api/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      template: "reset-password",
      context: { resetLink },
    });
  }

  // Password Changed Email
  async sendChangedPasswordEmail(email: string): Promise<void> {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Password Has Been Changed",
      template: "password-changed",
    });
  }

  // Verification Email
  async sendVerificationEmail(
    email: string,
    token: string
  ): Promise<void> {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    const verificationUrl = `${baseUrl}/api/verify-email?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email Address",
      template: "verify-email",
      context: { verificationUrl },
    });
  }
}