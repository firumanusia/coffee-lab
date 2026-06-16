import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy as JwtStrategyBase } from 'passport-jwt'
import { Strategy as GoogleStrategyBase, type Profile } from 'passport-google-oauth20'
import type { AuthUser } from './decorators'

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtStrategyBase, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET') ?? 'dev-access',
    })
  }
  validate(payload: { sub: string; email: string; role: AuthUser['role'] }): AuthUser {
    return { userId: payload.sub, email: payload.email, role: payload.role }
  }
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(GoogleStrategyBase, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID') || 'missing',
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET') || 'missing',
      callbackURL: config.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:3000/v1/auth/google/callback',
      scope: ['email', 'profile'],
    })
  }
  validate(_at: string, _rt: string, profile: Profile) {
    return {
      googleId: profile.id,
      email: profile.emails?.[0]?.value ?? '',
      name: profile.displayName,
    }
  }
}
