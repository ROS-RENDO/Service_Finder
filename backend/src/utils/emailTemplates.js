const getPasswordResetEmail = (code, userName) => {
  return {
    subject: 'Password Reset Code - CleanService',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .code-box { background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>We received a request to reset your password. Use the verification code below to proceed:</p>
            
            <div class="code-box">
              <p style="margin: 0; color: #666; font-size: 14px;">Your verification code is:</p>
              <div class="code">${code}</div>
              <p style="margin: 0; color: #666; font-size: 12px; margin-top: 10px;">Valid for 15 minutes</p>
            </div>

            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <p style="margin: 5px 0 0 0;">If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
            </div>

            <p>Best regards,<br>The CleanService Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2024 CleanService. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hi ${userName},

      We received a request to reset your password.

      Your verification code is: ${code}

      This code will expire in 15 minutes.

      If you didn't request this password reset, please ignore this email.

      Best regards,
      The CleanService Team
    `
  };
};

module.exports = { getPasswordResetEmail };