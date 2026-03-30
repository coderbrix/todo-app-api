export class MailService {
  constructor() {}

  async sendWelcomeEmail(name: string, email: string) {}
  async sendResetPasswordEmail(email: string, resetLink: string) {}
  async sendChangedPasswordEmail(email: string) {}
}
