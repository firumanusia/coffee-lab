import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import type { Role } from '@prisma/client'
import { ROLES_KEY } from './decorators'

/** Requires a valid access JWT (Authorization: Bearer ...). */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

/** Google OAuth entrypoint guard. */
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}

/** Requires the user's role to be in @Roles(...). Use after JwtAuthGuard. */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [ctx.getHandler(), ctx.getClass()])
    if (!required || required.length === 0) return true
    const { user } = ctx.switchToHttp().getRequest()
    if (!user || !required.includes(user.role)) throw new ForbiddenException('Insufficient role')
    return true
  }
}
