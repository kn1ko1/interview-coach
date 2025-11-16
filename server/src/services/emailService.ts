import fs from 'fs/promises';
import path from 'path';

interface EmailLog {
  to: string;
  subject: string;
  body: string;
  token: string;
  timestamp: string;
}

const EMAIL_LOG_FILE = path.join(__dirname, '../../email_logs.json');

export class EmailService {
  /**
   * Send login email (simulated - logs to file)
   */
  static async sendLoginEmail(email: string, token: string): Promise<void> {
    const subject = 'Interview Coach - Login Link';
    const body = `
      Click the link below to login to your Interview Coach account:
      
      Token: ${token}
      
      This link expires in 7 days.
    `;

    const emailLog: EmailLog = {
      to: email,
      subject,
      body,
      token,
      timestamp: new Date().toISOString(),
    };

    await this.logEmail(emailLog);
    console.log(`📧 Email sent to ${email}`);
  }

  /**
   * Log email to file (for testing)
   */
  private static async logEmail(email: EmailLog): Promise<void> {
    try {
      let logs: EmailLog[] = [];
      
      try {
        const content = await fs.readFile(EMAIL_LOG_FILE, 'utf-8');
        logs = JSON.parse(content);
      } catch {
        logs = [];
      }

      logs.push(email);

      await fs.writeFile(EMAIL_LOG_FILE, JSON.stringify(logs, null, 2));
    } catch (err) {
      console.error('Failed to log email:', err);
    }
  }

  /**
   * Get all email logs (for testing)
   */
  static async getEmailLogs(): Promise<EmailLog[]> {
    try {
      const content = await fs.readFile(EMAIL_LOG_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  /**
   * Get latest email (for testing)
   */
  static async getLatestEmail(): Promise<EmailLog | null> {
    try {
      const logs = await this.getEmailLogs();
      return logs.length > 0 ? logs[logs.length - 1] : null;
    } catch {
      return null;
    }
  }
}