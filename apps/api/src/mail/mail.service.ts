import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private transporter: nodemailer.Transporter | null = null

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST')
    if (!host) {
      this.logger.warn('SMTP_HOST not set — verification emails will be logged, not sent.')
      return
    }
    const port = Number(this.config.get('SMTP_PORT') ?? 587)
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    })
  }

  private from() {
    return this.config.get<string>('MAIL_FROM') ?? `MENOOWEL <${this.config.get('SMTP_USER')}>`
  }

  async sendVerificationCode(to: string, code: string) {
    const subject = 'Your MENOOWEL verification code'
    const text = `Your MENOOWEL verification code is ${code}. It expires in 15 minutes.`
    if (!this.transporter) {
      this.logger.log(`[DEV] Verification code for ${to}: ${code}`)
      return
    }
    await this.transporter.sendMail({ from: this.from(), to, subject, text, html: this.template(code) })
  }

  private template(code: string) {
    return `<!doctype html><html><body style="margin:0;background:#faf7f4;font-family:Inter,Arial,sans-serif;color:#2b2422">
  <div style="max-width:460px;margin:32px auto;background:#fff;border:1px solid #ececea;border-radius:16px;overflow:hidden">
    <div style="background:#171717;padding:20px 24px">
      <span style="color:#E84B3D;font-weight:800;font-size:20px;letter-spacing:.5px">MENOOWEL</span>
      <span style="color:#069494;font-weight:700;font-size:12px;margin-left:6px">BrewLab Studio</span>
    </div>
    <div style="padding:28px 24px">
      <h2 style="margin:0 0 8px;font-size:18px">Confirm your email</h2>
      <p style="margin:0 0 20px;color:#6f6a67;font-size:14px">Enter this code to activate your account. It expires in 15 minutes.</p>
      <div style="font-size:34px;font-weight:800;letter-spacing:10px;color:#171717;background:#faf7f4;border:1px dashed #E84B3D;border-radius:12px;padding:16px;text-align:center">${code}</div>
      <p style="margin:20px 0 0;color:#9d9794;font-size:12px">If you didn't create a MENOOWEL account, you can ignore this email.</p>
    </div>
  </div></body></html>`
  }
}
