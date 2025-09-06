import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SibApiV3Sdk from '@sharekey/sendinblue-client';
import * as nodemailer from 'nodemailer';
import { CustomEmailJob } from '@hic/shared-dto';
import { EmailTemplates } from '../templates/email-templates';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private apiInstance: SibApiV3Sdk.TransactionalEmailsApi;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    if (apiKey) {
      // Basic validation of API key format
      if (!apiKey.startsWith('xkeysib-') || apiKey.length < 50) {
        this.logger.warn('BREVO_API_KEY appears to be invalid or malformed. Email sending will be disabled.');
        this.logger.warn('Valid Brevo API keys should start with "xkeysib-" and be at least 50 characters long.');
        return;
      }
      
      this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      this.apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);
      this.logger.log('Email service initialized with Brevo API key');
    } else {
      this.logger.warn('BREVO_API_KEY not configured. Email sending will be disabled.');
    }
  }

  async sendEmail(data: CustomEmailJob): Promise<void> {
    const isDevelopment = this.configService.get<string>('NODE_ENV') === 'development';
    const useMailHog = this.configService.get<string>('USE_MAILHOG', 'false') === 'true';
    
    if (isDevelopment && useMailHog) {
      // Use MailHog in development mode
      await this.sendEmailViaMailHog(data);
      return;
    }
    
    if (isDevelopment) {
      // In development mode, log email to console instead of sending
      this.logger.log('='.repeat(80));
      this.logger.log('📧 EMAIL (Development Mode - Not Sent)');
      this.logger.log('='.repeat(80));
      this.logger.log(`To: ${data.to}`);
      this.logger.log(`Subject: ${data.subject}`);
      this.logger.log(`From: ${this.configService.get<string>('BREVO_SENDER_NAME', 'HIC Platform')} <${this.configService.get<string>('BREVO_SENDER_EMAIL', 'noreply@hic.com')}>`);
      
      if (data.templateId) {
        this.logger.log(`Template ID: ${data.templateId}`);
        this.logger.log(`Template Params: ${JSON.stringify(data.params || {}, null, 2)}`);
      } else {
        if (data.htmlContent) {
          this.logger.log('HTML Content:');
          this.logger.log(data.htmlContent);
        }
        if (data.textContent) {
          this.logger.log('Text Content:');
          this.logger.log(data.textContent);
        }
      }
      
      this.logger.log('='.repeat(80));
      this.logger.log('✅ Email logged successfully (Development Mode)');
      this.logger.log('='.repeat(80));
      return;
    }

    // Production mode - use actual email service
    if (!this.apiInstance) {
      this.logger.warn('Email service not configured. Skipping email send.');
      return;
    }

    try {
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      
      sendSmtpEmail.to = [{ email: data.to }];
      sendSmtpEmail.subject = data.subject;
      
      if (data.templateId) {
        sendSmtpEmail.templateId = data.templateId;
        sendSmtpEmail.params = data.params || {};
      } else {
        if (data.htmlContent) {
          sendSmtpEmail.htmlContent = data.htmlContent;
        }
        if (data.textContent) {
          sendSmtpEmail.textContent = data.textContent;
        }
      }

      sendSmtpEmail.sender = {
        name: this.configService.get<string>('BREVO_SENDER_NAME', 'HIC Platform'),
        email: this.configService.get<string>('BREVO_SENDER_EMAIL', 'noreply@hic.com'),
      };

      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      
      this.logger.log(`Email sent successfully to ${data.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${data.to}:`, error);
      
      // Handle authorization and API key issues gracefully
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.logger.error('Email sending failed due to authorization issues in production!');
        throw error;
      }
      
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    this.logger.log(`Sending welcome email to ${email}`);
    const template = EmailTemplates.welcomeEmail({ email, name });
    
    await this.sendEmail({
      to: email,
      subject: template.subject,
      htmlContent: template.html,
      textContent: template.text,
    });
    this.logger.log(`Welcome email sent to ${email}`);
  }

  async sendPasswordResetEmail(email: string, resetToken: string, frontendUrl: string): Promise<void> {
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}`;
    const template = EmailTemplates.passwordResetEmail({ 
      email, 
      name: email.split('@')[0], // Use email prefix as fallback name
      resetUrl 
    });
    
    await this.sendEmail({
      to: email,
      subject: template.subject,
      htmlContent: template.html,
      textContent: template.text,
    });
  }

  private async sendEmailViaMailHog(data: CustomEmailJob): Promise<void> {
    try {
      // Create MailHog transporter
      const transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025,
        secure: false,
        auth: null,
      });

      const mailOptions = {
        from: `${this.configService.get<string>('BREVO_SENDER_NAME', 'HIC Platform')} <${this.configService.get<string>('BREVO_SENDER_EMAIL', 'noreply@hic.com')}>`,
        to: data.to,
        subject: data.subject,
        html: data.htmlContent,
        text: data.textContent,
      };

      const info = await transporter.sendMail(mailOptions);
      
      this.logger.log(`📧 Email sent via MailHog to ${data.to}`);
      this.logger.log(`📧 Message ID: ${info.messageId}`);
      this.logger.log(`📧 View email at: http://localhost:8025`);
    } catch (error) {
      this.logger.error(`Failed to send email via MailHog to ${data.to}:`, error);
      // Fallback to console logging
      this.logger.log('='.repeat(80));
      this.logger.log('📧 EMAIL (MailHog Failed - Fallback to Console)');
      this.logger.log('='.repeat(80));
      this.logger.log(`To: ${data.to}`);
      this.logger.log(`Subject: ${data.subject}`);
      this.logger.log(`From: ${this.configService.get<string>('BREVO_SENDER_NAME', 'HIC Platform')} <${this.configService.get<string>('BREVO_SENDER_EMAIL', 'noreply@hic.com')}>`);
      
      if (data.htmlContent) {
        this.logger.log('HTML Content:');
        this.logger.log(data.htmlContent);
      }
      if (data.textContent) {
        this.logger.log('Text Content:');
        this.logger.log(data.textContent);
      }
      
      this.logger.log('='.repeat(80));
    }
  }
}