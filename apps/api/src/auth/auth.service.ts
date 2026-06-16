import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import type { User } from '@prisma/client'
import * as argon2 from 'argon2'
import { PrismaService } from '../prisma/prisma.service'
import { MailService } from '../mail/mail.service'

export interface Tokens {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
  ) {}

  private publicUser(u: User) {
    return { id: u.id, email: u.email, name: u.name, role: u.role }
  }

  /** Email + password registration. Sends a verification code; no tokens until verified. */
  async register(email: string, password: string, name?: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } })
    if (existing) {
      if (!existing.emailVerified) {
        await this.issueCode(existing.id, email)
        return { needsVerification: true, email }
      }
      throw new ConflictException('Email already registered')
    }
    const passwordHash = await argon2.hash(password)
    const user = await this.prisma.user.create({ data: { email, passwordHash, name, emailVerified: false } })
    await this.issueCode(user.id, email)
    return { needsVerification: true, email }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials')
    const ok = await argon2.verify(user.passwordHash, password)
    if (!ok) throw new UnauthorizedException('Invalid credentials')
    if (!user.emailVerified) {
      await this.issueCode(user.id, email)
      throw new ForbiddenException('EMAIL_NOT_VERIFIED')
    }
    const tokens = await this.issueTokens(user)
    return { user: this.publicUser(user), ...tokens }
  }

  /** Generate + email a 6-digit code (15 min expiry). */
  private async issueCode(userId: string, email: string) {
    const code = String(Math.floor(100000 + Math.random() * 900000))
    await this.prisma.user.update({
      where: { id: userId },
      data: { verifyCode: code, verifyExpiry: new Date(Date.now() + 15 * 60 * 1000) },
    })
    await this.mail.sendVerificationCode(email, code)
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new UnauthorizedException('Invalid code')
    if (user.emailVerified) {
      const tokens = await this.issueTokens(user)
      return { user: this.publicUser(user), ...tokens }
    }
    if (!user.verifyCode || !user.verifyExpiry || user.verifyExpiry < new Date() || user.verifyCode !== code) {
      throw new UnauthorizedException('Invalid or expired code')
    }
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verifyCode: null, verifyExpiry: null },
    })
    const tokens = await this.issueTokens(updated)
    return { user: this.publicUser(updated), ...tokens }
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (user && !user.emailVerified) await this.issueCode(user.id, email)
    return { ok: true } // don't leak whether the account exists
  }

  /** Find-or-create a user from a verified Google profile, then issue tokens. */
  async googleLogin(profile: { googleId: string; email: string; name?: string }) {
    let user = await this.prisma.user.findFirst({
      where: { OR: [{ googleId: profile.googleId }, { email: profile.email }] },
    })
    if (!user) {
      user = await this.prisma.user.create({
        data: { googleId: profile.googleId, email: profile.email, name: profile.name, emailVerified: true },
      })
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: profile.googleId, emailVerified: true },
      })
    }
    const tokens = await this.issueTokens(user)
    return { user: this.publicUser(user), ...tokens }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new UnauthorizedException()
    return this.publicUser(user)
  }

  /** Rotate: verify the presented refresh token, revoke it, issue a fresh pair. */
  async refresh(presented: string): Promise<Tokens & { user: ReturnType<AuthService['publicUser']> }> {
    let payload: { sub: string; jti: string }
    try {
      payload = await this.jwt.verifyAsync(presented, { secret: this.config.get('JWT_REFRESH_SECRET') })
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }
    const row = await this.prisma.refreshToken.findUnique({ where: { id: payload.jti } })
    if (!row || row.revoked || row.expiresAt < new Date()) throw new UnauthorizedException('Refresh expired')
    const matches = await argon2.verify(row.tokenHash, presented)
    if (!matches) throw new UnauthorizedException('Invalid refresh token')

    await this.prisma.refreshToken.update({ where: { id: row.id }, data: { revoked: true } })
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) throw new UnauthorizedException()
    const tokens = await this.issueTokens(user)
    return { user: this.publicUser(user), ...tokens }
  }

  async logout(presented?: string) {
    if (!presented) return
    try {
      const payload: { jti: string } = await this.jwt.verifyAsync(presented, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      })
      await this.prisma.refreshToken.updateMany({ where: { id: payload.jti }, data: { revoked: true } })
    } catch {
      /* ignore invalid token on logout */
    }
  }

  private async issueTokens(user: User): Promise<Tokens> {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      { secret: this.config.get('JWT_ACCESS_SECRET'), expiresIn: this.config.get('JWT_ACCESS_TTL') ?? '900s' },
    )
    const ttl = this.config.get('JWT_REFRESH_TTL') ?? '30d'
    const row = await this.prisma.refreshToken.create({
      data: { userId: user.id, tokenHash: '', expiresAt: refreshExpiry(ttl) },
    })
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, jti: row.id },
      { secret: this.config.get('JWT_REFRESH_SECRET'), expiresIn: ttl },
    )
    await this.prisma.refreshToken.update({ where: { id: row.id }, data: { tokenHash: await argon2.hash(refreshToken) } })
    return { accessToken, refreshToken }
  }
}

/** Parse simple TTL strings like "30d", "15m", "900s" into a future Date. */
function refreshExpiry(ttl: string): Date {
  const m = /^(\d+)([smhd])$/.exec(ttl.trim())
  const now = Date.now()
  if (!m) return new Date(now + 30 * 864e5)
  const n = Number(m[1])
  const mult = { s: 1e3, m: 6e4, h: 36e5, d: 864e5 }[m[2] as 's' | 'm' | 'h' | 'd']
  return new Date(now + n * mult)
}
