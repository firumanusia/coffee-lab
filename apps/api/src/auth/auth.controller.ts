import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import type { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { LoginDto, RefreshDto, RegisterDto } from './dto'
import { GoogleAuthGuard, JwtAuthGuard } from './guards'
import { CurrentUser, type AuthUser } from './decorators'

const REFRESH_COOKIE = 'refresh_token'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  private setRefreshCookie(res: Response, token: string) {
    res.cookie(REFRESH_COOKIE, token, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/v1/auth',
      maxAge: 30 * 864e5,
    })
  }

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...rest } = await this.auth.register(dto.email, dto.password, dto.name)
    this.setRefreshCookie(res, refreshToken)
    return { ...rest, refreshToken }
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...rest } = await this.auth.login(dto.email, dto.password)
    this.setRefreshCookie(res, refreshToken)
    return { ...rest, refreshToken }
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const presented = req.cookies?.[REFRESH_COOKIE] ?? dto.refreshToken
    const { refreshToken, ...rest } = await this.auth.refresh(presented)
    this.setRefreshCookie(res, refreshToken)
    return { ...rest, refreshToken }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.auth.logout(req.cookies?.[REFRESH_COOKIE])
    res.clearCookie(REFRESH_COOKIE, { path: '/v1/auth' })
    return { ok: true }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.auth.me(user.userId)
  }

  // ---- Google OAuth (web redirect flow) ----
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  google() {
    /* GoogleAuthGuard redirects to Google's consent screen */
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const profile = req.user as { googleId: string; email: string; name?: string }
    const { accessToken, refreshToken } = await this.auth.googleLogin(profile)
    this.setRefreshCookie(res, refreshToken)
    const web = this.config.get('WEB_URL') ?? 'http://localhost:5173'
    res.redirect(`${web}/auth/callback#access_token=${encodeURIComponent(accessToken)}`)
  }
}
