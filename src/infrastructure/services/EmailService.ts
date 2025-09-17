import { injectable } from "inversify"
import nodemailer from "nodemailer"
import type { IEmailService } from "../../application/interfaces/services/IEmailService.ts"

@injectable()
export class EmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  async sendOTP(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "Your Devcruit Verification Code",
      html: `
        <div style="background:#0b1220;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" align="center" width="100%" style="max-width:640px;margin:0 auto;background:#0f172a;border:1px solid #1f2937;border-radius:10px;">
            <tr><td style="padding:28px 28px 8px;text-align:center;"><div style="font-weight:800;letter-spacing:.4px;font-size:18px;color:#4f46e5;">DEVCRUIT</div></td></tr>
            <tr><td style="padding:0 28px 4px;text-align:center;"><h1 style="margin:8px 0 0;font-size:22px;color:#f8fafc;">Email Verification Code</h1></td></tr>
            <tr><td style="padding:0 28px 8px;text-align:center;"><p style="margin:8px 0 0;color:#cbd5e1;line-height:1.55;">Please enter the verification code below to complete your email verification.</p></td></tr>
            <tr><td style="padding:16px 28px 24px;text-align:center;">
              <div style="background:#1f2937;border:2px solid #4f46e5;border-radius:12px;padding:24px 32px;margin:16px 0;display:inline-block;">
                <div style="font-size:32px;font-weight:700;letter-spacing:8px;color:#4f46e5;font-family:'Courier New',monospace;">${otp}</div>
              </div>
              <p style="margin:16px 0 0;color:#94a3b8;font-size:14px;">This code will expire in 5 minutes</p>
            </td></tr>
            <tr><td style="padding:0 28px 24px;text-align:center;">
              <div style="background:#1f2937;border-radius:8px;padding:16px;margin:16px 0;">
                <p style="margin:0;color:#cbd5e1;font-size:14px;line-height:1.5;">
                  <strong>Security Notice:</strong> Never share this code with anyone. Devcruit will never ask for your verification code via phone, email, or text message.
                </p>
              </div>
            </td></tr>
            <tr><td style="padding:0 28px 24px;text-align:center;">
              <p style="margin:0;color:#64748b;font-size:12px;line-height:1.4;">
                If you didn't request this verification code, please ignore this email or contact our support team immediately.
              </p>
            </td></tr>
          </table>
        </div>
      `,
    }

    await this.transporter.sendMail(mailOptions)
  }

  async sendCompanyApproved(toEmail: string, data: { contactName: string; companyName: string }): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: toEmail,
      subject: `Your company ${data.companyName} has been approved` ,
      html: `
        <div style="background:#0b1220;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" align="center" width="100%" style="max-width:640px;margin:0 auto;background:#0f172a;border:1px solid #1f2937;border-radius:10px;">
            <tr><td style="padding:28px 28px 8px;text-align:center;"><div style="font-weight:800;letter-spacing:.4px;font-size:18px;color:#4f46e5;">DEVCRUIT</div></td></tr>
            <tr><td style="padding:0 28px 4px;text-align:center;"><h1 style="margin:8px 0 0;font-size:22px;color:#f8fafc;">Your Company Has Been Approved 🎉</h1></td></tr>
            <tr><td style="padding:0 28px 8px;text-align:center;"><p style="margin:8px 0 0;color:#cbd5e1;line-height:1.55;">Hi <strong>${data.contactName}</strong>, great news! <strong>${data.companyName}</strong> has been approved. You can now access all employer features.</p></td></tr>
          </table>
        </div>
      `,
    })
  }

  async sendCompanyDeclined(
    toEmail: string,
    data: { contactName: string; companyName: string; reason?: string; requestedDocuments?: string[] },
  ): Promise<void> {
    const docs = (data.requestedDocuments ?? [])
      .map((d) => `<li style="margin:0;color:#cbd5e1;">${d}</li>`)
      .join("")
    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: toEmail,
      subject: `Review outcome for ${data.companyName}`,
      html: `
        <div style="background:#0b1220;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" align="center" width="100%" style="max-width:640px;margin:0 auto;background:#0f172a;border:1px solid #7f1d1d;border-radius:10px;">
            <tr><td style="padding:28px 28px 8px;text-align:center;"><div style="font-weight:800;letter-spacing:.4px;font-size:18px;color:#ef4444;">DEVCRUIT</div></td></tr>
            <tr><td style="padding:0 28px 4px;text-align:center;"><h1 style="margin:8px 0 0;font-size:22px;color:#f8fafc;">Review Outcome: Changes Required</h1></td></tr>
            <tr><td style="padding:0 28px 8px;text-align:left;"><p style="margin:8px 0 0;color:#cbd5e1;line-height:1.6;">Hi <strong>${data.contactName}</strong>, thank you for submitting <strong>${data.companyName}</strong>. After review, we couldn’t approve the application.</p>
              ${data.reason ? `<div style="margin:12px 0 0;padding:12px 14px;background:#1f2937;border:1px solid #f59e0b;border-radius:8px;color:#f59e0b;"><div style="font-weight:700;margin-bottom:4px;">Reason</div><div>${data.reason}</div></div>` : ""}
              ${docs ? `<div style="margin:12px 0 0;padding:12px 14px;background:#0b1220;border:1px dashed #475569;border-radius:8px;"><div style="font-weight:700;margin-bottom:6px;color:#e5e7eb;">What we need</div><ul style="margin:0 0 0 18px;padding:0;">${docs}</ul></div>` : ""}
            </td></tr>
          </table>
        </div>
      `,
    })
  }

  async sendCompanyBlocked(
    toEmail: string,
    data: { contactName: string; companyName: string; reason?: string; referenceId?: string },
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: toEmail,
      subject: `Account restricted for ${data.companyName}`,
      html: `
        <div style="background:#0b1220;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" align="center" width="100%" style="max-width:640px;margin:0 auto;background:#0f172a;border:1px solid #7f1d1d;border-radius:10px;">
            <tr><td style="padding:28px 28px 8px;text-align:center;"><div style="font-weight:800;letter-spacing:.4px;font-size:18px;color:#b91c1c;">DEVCRUIT</div></td></tr>
            <tr><td style="padding:0 28px 4px;text-align:center;"><h1 style="margin:8px 0 0;font-size:22px;color:#f8fafc;">Account Access Temporarily Restricted</h1></td></tr>
            <tr><td style="padding:0 28px 8px;text-align:left;"><p style="margin:8px 0 0;color:#cbd5e1;line-height:1.6;">Hi <strong>${data.contactName}</strong>, your company <strong>${data.companyName}</strong> has been temporarily blocked from accessing certain features.</p>
              ${data.reason ? `<div style="margin:12px 0 0;padding:12px 14px;background:#1f2937;border:1px solid #ef4444;border-radius:8px;color:#fecaca;"><div style=\"font-weight:700;margin-bottom:4px;\">Reason</div><div>${data.reason}</div></div>` : ""}
              ${data.referenceId ? `<p style=\"margin:12px 0 0;font-size:12px;color:#94a3b8;\">Reference ID: ${data.referenceId}</p>` : ""}
            </td></tr>
          </table>
        </div>
      `,
    })
  }

  async sendCompanyUnblocked(
    toEmail: string,
    data: { contactName: string; companyName: string; reason?: string; referenceId?: string },
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: toEmail,
      subject: `Account access restored for ${data.companyName}`,
      html: `
        <div style="background:#0b1220;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" align="center" width="100%" style="max-width:640px;margin:0 auto;background:#0f172a;border:1px solid #059669;border-radius:10px;">
            <tr><td style="padding:28px 28px 8px;text-align:center;"><div style="font-weight:800;letter-spacing:.4px;font-size:18px;color:#10b981;">DEVCRUIT</div></td></tr>
            <tr><td style="padding:0 28px 4px;text-align:center;"><h1 style="margin:8px 0 0;font-size:22px;color:#f8fafc;">Account Access Restored ✅</h1></td></tr>
            <tr><td style="padding:0 28px 8px;text-align:left;"><p style="margin:8px 0 0;color:#cbd5e1;line-height:1.6;">Hi <strong>${data.contactName}</strong>, great news! Your company <strong>${data.companyName}</strong> has been unblocked and you now have full access to all features.</p>
              ${data.reason ? `<div style="margin:12px 0 0;padding:12px 14px;background:#1f2937;border:1px solid #10b981;border-radius:8px;color:#a7f3d0;"><div style=\"font-weight:700;margin-bottom:4px;\">Reason</div><div>${data.reason}</div></div>` : ""}
              ${data.referenceId ? `<p style=\"margin:12px 0 0;font-size:12px;color:#94a3b8;\">Reference ID: ${data.referenceId}</p>` : ""}
            </td></tr>
            <tr><td style="padding:0 28px 24px;text-align:center;">
              <div style="background:#1f2937;border-radius:8px;padding:16px;margin:16px 0;">
                <p style="margin:0;color:#cbd5e1;font-size:14px;line-height:1.5;">
                  <strong>Welcome back!</strong> You can now log in and access all employer features on Devcruit.
                </p>
              </div>
            </td></tr>
          </table>
        </div>
      `,
    })
  }

  async sendDeveloperWarning(
    toEmail: string,
    data: { fullName: string; reason: string; details?: string; expectedResolution?: string; issuedAt?: Date },
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: toEmail,
      subject: `Account warning issued` ,
      html: `
        <div style="background:#0b1220;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" align="center" width="100%" style="max-width:640px;margin:0 auto;background:#0f172a;border:1px solid #78350f;border-radius:10px;">
            <tr><td style="padding:28px 28px 8px;text-align:center;"><div style="font-weight:800;letter-spacing:.4px;font-size:18px;color:#d97706;">DEVCRUIT</div></td></tr>
            <tr><td style="padding:0 28px 4px;text-align:center;"><h1 style="margin:8px 0 0;font-size:22px;color:#f8fafc;">Important Notice Regarding Your Account</h1></td></tr>
            <tr><td style="padding:0 28px 8px;text-align:left;">
              <p style="margin:8px 0 0;color:#cbd5e1;line-height:1.6;">Hi <strong>${data.fullName}</strong>, we’ve issued a warning on your account.</p>
              <div style="margin:12px 0 0;padding:12px 14px;background:#1f2937;border:1px solid #f59e0b;border-radius:8px;color:#f59e0b;">
                <div style="font-weight:700;margin-bottom:4px;">Reason</div>
                <div>${data.reason}${data.details ? ` — ${data.details}` : ''}</div>
              </div>
              ${data.expectedResolution ? `<div style=\"margin:12px 0 0;padding:12px 14px;background:#0b1220;border:1px solid #38bdf8;border-radius:8px;color:#7dd3fc;\"><div style=\"font-weight:700;margin-bottom:4px;\">Expected Resolution</div><div>${data.expectedResolution}</div></div>` : ''}
              ${data.issuedAt ? `<p style=\"margin:12px 0 0;font-size:12px;color:#94a3b8;\">Warning issued on: ${data.issuedAt.toUTCString()}</p>` : ''}
            </td></tr>
          </table>
        </div>
      `,
    })
  }

  async sendDeveloperBlocked(
    toEmail: string,
    data: { fullName: string; reason: string; details?: string; blockId?: string },
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: toEmail,
      subject: `Your account has been blocked` ,
      html: `
        <div style="background:#0b1220;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" align="center" width="100%" style="max-width:640px;margin:0 auto;background:#0f172a;border:1px solid #7f1d1d;border-radius:10px;">
            <tr><td style="padding:28px 28px 8px;text-align:center;"><div style="font-weight:800;letter-spacing:.4px;font-size:18px;color:#b91c1c;">DEVCRUIT</div></td></tr>
            <tr><td style="padding:0 28px 4px;text-align:center;"><h1 style="margin:8px 0 0;font-size:22px;color:#f8fafc;">Account Temporarily Blocked</h1></td></tr>
            <tr><td style="padding:0 28px 8px;text-align:left;">
              <p style="margin:8px 0 0;color:#cbd5e1;line-height:1.6;">Hi <strong>${data.fullName}</strong>, your account has been blocked.</p>
              <div style="margin:12px 0 0;padding:12px 14px;background:#1f2937;border:1px solid #ef4444;border-radius:8px;color:#fecaca;">
                <div style="font-weight:700;margin-bottom:4px;">Reason</div>
                <div>${data.reason}${data.details ? ` — ${data.details}` : ''}</div>
              </div>
              ${data.blockId ? `<p style=\"margin:12px 0 0;font-size:12px;color:#94a3b8;\">Block ID: ${data.blockId}</p>` : ''}
            </td></tr>
          </table>
        </div>
      `,
    })
  }

  async sendDeveloperTerminated(
    toEmail: string,
    data: { fullName: string; reason?: string; caseId?: string },
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: toEmail,
      subject: `Account termination notice` ,
      html: `
        <div style="background:#0b1220;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" align="center" width="100%" style="max-width:640px;margin:0 auto;background:#0f172a;border:1px solid #1f2937;border-radius:10px;">
            <tr><td style="padding:28px 28px 8px;text-align:center;"><div style="font-weight:800;letter-spacing:.4px;font-size:18px;color:#e5e7eb;">DEVCRUIT</div></td></tr>
            <tr><td style="padding:0 28px 4px;text-align:center;"><h1 style="margin:8px 0 0;font-size:22px;color:#f8fafc;">Account Termination Notice</h1></td></tr>
            <tr><td style="padding:0 28px 8px;text-align:left;">
              <p style="margin:8px 0 0;color:#cbd5e1;line-height:1.6;">Hi <strong>${data.fullName}</strong>, your Devcruit account has been terminated and can no longer be accessed.</p>
              ${data.reason ? `<div style=\"margin:12px 0 0;padding:12px 14px;background:#1f2937;border:1px solid #ef4444;border-radius:8px;color:#fecaca;\"><div style=\"font-weight:700;margin-bottom:4px;\">Reason</div><div>${data.reason}</div></div>` : ''}
              ${data.caseId ? `<p style=\"margin:12px 0 0;font-size:12px;color:#94a3b8;\">Case ID: ${data.caseId}</p>` : ''}
            </td></tr>
          </table>
        </div>
      `,
    })
  }
}
