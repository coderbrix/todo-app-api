import transporter from "../infrastructure/mailer";

export class MailService {
  constructor() {}

  async sendWelcomeEmail(name: string, email: string): Promise<void> {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome!",
      template: "welcome",
      context: { name },
    });
  }

  async sendResetPasswordEmail(
    email: string,
    resetLink: string
  ): Promise<void> {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `<a href="${resetLink}">Reset Password</a>`,
    });
  }

  async sendChangedPasswordEmail(email: string): Promise<void> {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Changed",
      html: `<p>Password changed successfully</p>`,
    });
  }

  // ✅ YOUR MAIN TASK (FIXED)
  async sendVerificationEmail(
    email: string,
    token: string
  ): Promise<void> {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    const verificationUrl = `${baseUrl}/api/verify-email?token=${token}`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        template: "verify-email",
        context: { verificationUrl },
      });
    } catch (error) {
      console.error("Verification email failed:", error);
      throw error;
    }
  }
}