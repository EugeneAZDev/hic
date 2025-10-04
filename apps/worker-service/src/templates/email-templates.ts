export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface WelcomeEmailData {
  name: string;
  email: string;
}

export interface PasswordResetEmailData {
  name: string;
  email: string;
  resetUrl: string;
}

export class EmailTemplates {
  static welcomeEmail(data: WelcomeEmailData): EmailTemplate {
    return {
      subject: "Welcome to HIC Platform!",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">Welcome to HIC Platform!</h1>
            </div>
            
            <div style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Hello ${data.name}!</h2>
              <p style="color: #666; line-height: 1.6;">
                Thank you for joining our platform. Your account has been successfully created.
              </p>
              <p style="color: #666; line-height: 1.6;">
                You can now access all the features and start exploring what we have to offer.
              </p>
              
              <div style="margin: 30px 0; padding: 20px; background-color: white; border-radius: 5px; border-left: 4px solid #667eea;">
                <p style="margin: 0; color: #333;">
                  <strong>Next steps:</strong><br>
                  • Complete your profile<br>
                  • Explore available features<br>
                  • Contact support if you need help
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                If you have any questions, feel free to contact our support team.
              </p>
              
              <p style="color: #666; margin-bottom: 0;">
                Best regards,<br>
                The HIC Team
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
Welcome to HIC Platform!

Hello ${data.name}!

Thank you for joining our platform. Your account has been successfully created.

You can now access all the features and start exploring what we have to offer.

Next steps:
• Complete your profile
• Explore available features  
• Contact support if you need help

If you have any questions, feel free to contact our support team.

Best regards,
The HIC Team
      `,
    };
  }

  static passwordResetEmail(data: PasswordResetEmailData): EmailTemplate {
    return {
      subject: "Password Reset Request - HIC Platform",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ff7b7b 0%, #ff416c 100%); padding: 30px; border-radius: 10px; color: white; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
            </div>
            
            <div style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
              <p style="color: #666; line-height: 1.6;">
                Hello ${data.name}, we received a request to reset your password for your HIC Platform account.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.resetUrl}" 
                   style="background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          display: inline-block;
                          font-weight: bold;">
                  Reset My Password
                </a>
              </div>
              
              <div style="margin: 30px 0; padding: 20px; background-color: white; border-radius: 5px; border-left: 4px solid #ff416c;">
                <p style="margin: 0; color: #333;">
                  <strong>Security Note:</strong><br>
                  This link will expire in 1 hour for your security.
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
              </p>
              
              <p style="color: #999; font-size: 14px; line-height: 1.4;">
                If the button doesn't work, copy and paste this link in your browser:<br>
                <span style="word-break: break-all;">${data.resetUrl}</span>
              </p>
              
              <p style="color: #666; margin-bottom: 0;">
                Best regards,<br>
                The HIC Team
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
Password Reset Request

Hello ${data.name}, we received a request to reset your password for your HIC Platform account.

To reset your password, please visit the following link:
${data.resetUrl}

This link will expire in 1 hour for your security.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

Best regards,
The HIC Team
      `,
    };
  }
}
